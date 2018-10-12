const Deck = artifacts.require("./Deck.sol");
const Utility = artifacts.require("./Utility.sol");
const DocumentReg = artifacts.require("./DocumentReg.sol");
const AuthorPool = artifacts.require("./AuthorPool.sol");
const CuratorPool = artifacts.require("./CuratorPool.sol");

contract("DocumentReg", accounts => {

  it("confirm total page view square", async () => {

    // prepare
    const totalPageView = 234000;
    const totalPageViewSquare = 234000 ** 2;

    const deck = await Deck.deployed();
    const utility = await Utility.deployed();
    const documentReg = await DocumentReg.deployed();
    const authorPool = await AuthorPool.deployed();
    const curatorPool = await CuratorPool.deployed();

    init(documentReg, deck, authorPool, curatorPool, utility);

    // logic
    const timestamp = await utility.getDateMillis();
    await documentReg.confirmTotalPageView(timestamp, totalPageView, totalPageViewSquare);

    // assert
    const r_totalPageView = await documentReg.getTotalPageView(timestamp);
    const r_totalPageViewSquare = await documentReg.getTotalPageViewSquare(timestamp);
    assert.equal(totalPageView, r_totalPageView, "different total page view");
    assert.equal(totalPageViewSquare, r_totalPageViewSquare, "different total page view square");
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
