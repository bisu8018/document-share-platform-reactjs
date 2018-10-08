const Deck = artifacts.require("./Deck.sol");
const Utility = artifacts.require("./Utility.sol");
const DocumentReg = artifacts.require("./DocumentReg.sol");
const AuthorPool = artifacts.require("./AuthorPool.sol");

contract("DocumentReg", accounts => {

  it("registered document should exist", async () => {

    // prepare
    const docId = "1234567890abcdefghijklmnopqrstuv";
    const pageView = 234;

    const deck = await Deck.deployed();
    const utility = await Utility.deployed();
    const documentReg = await DocumentReg.deployed();
    const authorPool = await AuthorPool.deployed();

    init(documentReg, deck, authorPool, "", utility);

    // logic
    await documentReg.register(docId, { from: accounts[0] });

    // assert
    const isExist = await documentReg.contains(docId, { from: accounts[0] });
    assert.equal(true, isExist, "can't find document");
  });

  function init (documentReg, deck, authorPool, curatorPool, utility) {

    var _token = deck.address;
    var _utility = utility.address;
    var _author = authorPool.address;
    var _curator = "";

    // logic
    documentReg.init(_token, _author, _curator, _utility, { from: accounts[0] });
  }
  
});
