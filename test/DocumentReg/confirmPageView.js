const Deck = artifacts.require("./Deck.sol");
const Utility = artifacts.require("./Utility.sol");
const DocumentReg = artifacts.require("./DocumentReg.sol");
const AuthorPool = artifacts.require("./AuthorPool.sol");
const CuratorPool = artifacts.require("./CuratorPool.sol");

contract("DocumentReg", accounts => {

  it("confirm page view", async () => {

    // prepare
    const docId = "1234567890abcdefghijklmnopqrst33";
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
    const timestamp = await utility.getDateMillis();
    //console.log('registering...');
    await documentReg.register(docId, { from: accounts[3] });
    //console.log('confirm page views...');
    await documentReg.confirmPageView(docId, timestamp, pageView);

    // assert
    //console.log('get page views...');
    const r_pageView = await documentReg.getPageView(docId, timestamp);
    //console.log('page views is ' + (r_pageView * 1));
    assert.equal(pageView, r_pageView, "different page view");
    assert.equal(pageView, 234, "different page view");
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
