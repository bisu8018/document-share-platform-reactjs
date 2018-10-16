const Deck = artifacts.require("./Deck.sol");
const Utility = artifacts.require("./Utility.sol");
const DocumentReg = artifacts.require("./DocumentReg.sol");
const AuthorPool = artifacts.require("./AuthorPool.sol");
const CuratorPool = artifacts.require("./CuratorPool.sol");

contract("DocumentReg", accounts => {

  it("registered document should exist", async () => {

    // prepare
    const docId = "1234567890abcdefghijklmnopqrs44";
    const pageView = 234;

    const deck = await Deck.deployed();
    const utility = await Utility.deployed();
    const documentReg = await DocumentReg.deployed();
    const authorPool = await AuthorPool.deployed();
    const curatorPool = await CuratorPool.deployed();

    await authorPool.transferOwnership(documentReg.address, { from: accounts[0] });
    await curatorPool.transferOwnership(documentReg.address, { from: accounts[0] });

    init(documentReg, deck, authorPool, curatorPool, utility);

    // logic
    //console.log('check the document ...');
    var isExist = await documentReg.contains(docId, { from: accounts[4] });
    if (!isExist) {
      //console.log('registering ...');
      await documentReg.register(docId, { from: accounts[4] });
      isExist = await documentReg.contains(docId, { from: accounts[4] });
    }

    // assert
    assert.equal(true, isExist, "can't find document");
  });

  function init (documentReg, deck, authorPool, curatorPool, utility) {

    var _token = deck.address;
    var _utility = utility.address;
    var _author = authorPool.address;
    var _curator = curatorPool.address;

    // logic
    documentReg.init(_token, _author, _curator, _utility, { from: accounts[0] });
  }

});
