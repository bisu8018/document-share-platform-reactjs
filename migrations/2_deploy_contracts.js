const MyStringStore = artifacts.require("MyStringStore");
const Deck = artifacts.require("Deck");
const DocumentRegistry = artifacts.require("DocumentRegistry");

module.exports = function(deployer) {
  deployer.deploy(MyStringStore);
  deployer.deploy(Deck);
  deployer.deploy(DocumentRegistry);
};
