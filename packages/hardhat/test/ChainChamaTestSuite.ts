import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumberish } from "ethers";
import { ChamaGroupV5, MiwaMeter, ChainChamaCharge } from "../typechain-types";

describe("ChamaGroupV5 Simplified Tests", function () {
  let chamaGroup: ChamaGroupV5;
  let miwaMeter: MiwaMeter;
  let chainChamaCharge: ChainChamaCharge;
  let addr2: any;

  before(async () => {
    [addr2] = await ethers.getSigners();

    // Deploy MiwaMeter token
    const MiwaMeterFactory = await ethers.getContractFactory("MiwaMeter");
    miwaMeter = await MiwaMeterFactory.deploy(ethers.parseUnits("10000", 18));
    await miwaMeter.waitForDeployment();

    // Deploy ChainChamaCharge token
    const ChainChamaChargeFactory = await ethers.getContractFactory("ChainChamaCharge");
    chainChamaCharge = await ChainChamaChargeFactory.deploy(ethers.parseUnits("10000", 18));
    await chainChamaCharge.waitForDeployment();

    // Deploy the ChamaGroupV5 contract
    const ChamaGroupFactory = await ethers.getContractFactory("ChamaGroupV5");
    chamaGroup = await ChamaGroupFactory.deploy();
    await chamaGroup.waitForDeployment();

    // Create a group allowing MiwaMeter and ChainChamaCharge tokens
    await chamaGroup.createGroup(
      "Token Test Group",
      "Testing group with custom ERC20 tokens.",
      ethers.parseUnits("10", 18), // Contribution amount
      3600, // 1 hour in seconds
      5000, // 50% savings ratio
      [miwaMeter.getAddress(), chainChamaCharge.getAddress()]
    );
  });

  describe("Deployment", function () {
    it("Should deploy with an initial group ID incremented", async function () {
      const nextId: BigNumberish = await chamaGroup.nextId();
      expect(nextId).to.equal(2); // Starts from 1, then increments after creating the first group
    });
  });

  describe("Group Creation", function () {
    it("Should allow creating a new group", async function () {
      await chamaGroup.createGroup(
        "Ether Test Group",
        "Testing group with Ether contributions.",
        ethers.parseEther("1"),
        3600, // 1 hour in seconds
        5000, // 50% savings ratio
        []
      );

      const groupDetails = await chamaGroup.getGroupById(2);
      expect(groupDetails.name).to.equal("Ether Test Group");
      expect(groupDetails.description).to.equal("Testing group with Ether contributions.");
    });
  });

  describe("Grantee Selection", function () {
    it("Should correctly select the grantee after a contribution", async function () {
      const groupDetailsBefore = await chamaGroup.getGroupById(2);
      const selectedGranteeBefore = groupDetailsBefore.selectedGrantee;

      await chamaGroup.connect(addr2).contribute(2, ethers.ZeroAddress, 0, { value: ethers.parseEther("1") });

      const groupDetailsAfter = await chamaGroup.getGroupById(2);
      const selectedGranteeAfter = groupDetailsAfter.selectedGrantee;

      expect(selectedGranteeAfter).to.not.equal(selectedGranteeBefore);
    });
  });

  describe("Withdrawal", function () {
    it("Should allow the selected grantee to withdraw Ether", async function () {
      const initialBalance: bigint = await ethers.provider.getBalance(addr2.address);

      await chamaGroup.connect(addr2).withdraw(2, ethers.ZeroAddress);

      const finalBalance: bigint = await ethers.provider.getBalance(addr2.address);
      expect(finalBalance - initialBalance > ethers.parseEther("0.9")).to.be.true; // Considering gas fees
    });
  });

  describe("Group Archiving", function () {
    it("Should allow the group creator to archive the group", async function () {
      await chamaGroup.archiveGroup(2);

      const groupDetails = await chamaGroup.getGroupById(2);
      expect(groupDetails.status).to.equal(1); // STATUS.ARCHIVED
    });
  });
});
