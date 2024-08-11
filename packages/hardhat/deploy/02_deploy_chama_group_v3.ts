import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployChamaGroup: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const chamaGroup = await deploy("ChamaGroupV3", {
    from: deployer,
    log: true,
    autoMine: true,
  });

  console.log("👋 ChamaGroupV3 contract deployed", chamaGroup.address);
};

export default deployChamaGroup;

deployChamaGroup.tags = ["ChamaGroup"];
