const MyStringStore = artifacts.require("MyStringStore");
const DocumentRegistry = artifacts.require("DocumentRegistry");
const RewardPool = artifacts.require("RewardPool");

module.exports = function(deployer) {
  deployer.deploy(MyStringStore);
  deployer.deploy(DocumentRegistry);
  deployer.deploy(RewardPool);
};
