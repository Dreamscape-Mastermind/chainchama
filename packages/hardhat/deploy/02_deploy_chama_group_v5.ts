import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployChamaGroup: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const chamaGroup = await deploy("ChamaGroupV5", {
    from: deployer,
    log: true,
    autoMine: true,
  });

  console.log("👋 ChamaGroupV5 contract deployed", chamaGroup.address);
  console.log("📄 ChamaGroupV5 contract details", chamaGroup);
};

export default deployChamaGroup;

deployChamaGroup.tags = ["ChamaGroup"];
