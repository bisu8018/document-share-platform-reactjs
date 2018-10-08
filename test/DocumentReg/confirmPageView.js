const Deck = artifacts.require("./Deck.sol");
const Utility = artifacts.require("./Utility.sol");
const DocumentReg = artifacts.require("./DocumentReg.sol");
const AuthorPool = artifacts.require("./AuthorPool.sol");

contract("DocumentReg", accounts => {

  it("confirm page view", async () => {

    // prepare
    const docId = "1234567890abcdefghijklmnopqrstuv";
    const pageView = 234;

    const deck = await Deck.deployed();
    const utility = await Utility.deployed();
    const documentReg = await DocumentReg.deployed();
    const authorPool = await AuthorPool.deployed();

    init(documentReg, deck, authorPool, "", utility);

    // logic
    const timestamp = await utility.getDateMillis();
    await documentReg.register(docId, { from: accounts[0] });
    await documentReg.confirmPageView(docId, timestamp, pageView, { from: accounts[0] });

    // assert
    const r_pageView = await documentReg.getPageView(docId, timestamp);
    assert.equal(pageView, r_pageView, "different page view");
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
