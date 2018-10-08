const Deck = artifacts.require("./Deck.sol");
const Utility = artifacts.require("./Utility.sol");
const DocumentReg = artifacts.require("./DocumentReg.sol");
const AuthorPool = artifacts.require("./AuthorPool.sol");

contract("DocumentReg", accounts => {

  it("should be initialized", async () => {

    // prepare
    const deck = await Deck.deployed();
    const utility = await Utility.deployed();
    const documentReg = await DocumentReg.deployed();
    const authorPool = await AuthorPool.deployed();

    var _token = deck.address;
    var _utility = utility.address;
    var _author = authorPool.address;
    var _curator = "";

    // logic
    await documentReg.init(_token, _author, _curator, _utility, { from: accounts[0] });

    // assert
    const b = await documentReg.createTime.call();
    assert.notEqual(b, 0, "was not initialized");
  });

});
