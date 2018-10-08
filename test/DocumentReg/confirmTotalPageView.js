const Deck = artifacts.require("./Deck.sol");
const Utility = artifacts.require("./Utility.sol");
const DocumentReg = artifacts.require("./DocumentReg.sol");
const AuthorPool = artifacts.require("./AuthorPool.sol");

contract("DocumentReg", accounts => {

  it("confirm total page view", async () => {

    // prepare
    const totalPageView = 234000;

    const deck = await Deck.deployed();
    const utility = await Utility.deployed();
    const documentReg = await DocumentReg.deployed();
    const authorPool = await AuthorPool.deployed();

    init(documentReg, deck, authorPool, "", utility);

    // logic
    const timestamp = await utility.getDateMillis();
    await documentReg.confirmTotalPageView(timestamp, totalPageView);

    // assert
    const r_totalPageView = await documentReg.getTotalPageView(timestamp);
    assert.equal(totalPageView, r_totalPageView, "different total page view");
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
