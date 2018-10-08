const MyStringStore = artifacts.require("MyStringStore");
const Deck = artifacts.require("Deck");
const Utility = artifacts.require("Utility");
const DocumentReg = artifacts.require("DocumentReg");
const AuthorPool = artifacts.require("AuthorPool");

module.exports = function(deployer) {
  deployer.deploy(MyStringStore);
  deployer.deploy(Deck);
  deployer.deploy(Utility);
  deployer.deploy(DocumentReg);
  deployer.deploy(AuthorPool);
};
