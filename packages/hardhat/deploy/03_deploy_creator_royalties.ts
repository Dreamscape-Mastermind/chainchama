import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys CreatorRoyaltiesV0 contract
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployCreatorRoyalties: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("CreatorRoyaltiesV0", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Get deployed contract
  const creatorRoyalties = await hre.ethers.getContract("CreatorRoyaltiesV0", deployer);
  console.log("✅ CreatorRoyaltiesV0 deployed at:", await creatorRoyalties.getAddress());
};

export default deployCreatorRoyalties;

// Tags for selective deployment
deployCreatorRoyalties.tags = ["CreatorRoyaltiesV0", "creator-economy"];
