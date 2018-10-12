const Deck = artifacts.require("./Deck.sol");
const Utility = artifacts.require("./Utility.sol");
const DocumentReg = artifacts.require("./DocumentReg.sol");
const AuthorPool = artifacts.require("./AuthorPool.sol");
const CuratorPool = artifacts.require("./CuratorPool.sol");

contract("DocumentReg", accounts => {

  it("determine author deco", async () => {

    // prepare
    const docId = "1234567890abcdefghijklmnopqrstuv";
    const pageView = 23400;
    const pageViewSquare = 23400 ** 2;
    const t_deco = 300 * 1000 * 1000;

    const deck = await Deck.deployed();
    const utility = await Utility.deployed();
    const documentReg = await DocumentReg.deployed();
    const authorPool = await AuthorPool.deployed();
    const curatorPool = await CuratorPool.deployed();

    init(documentReg, deck, authorPool, curatorPool, utility);

    // logic
    const timestamp = await utility.getDateMillis();
    await documentReg.register(docId, { from: accounts[0] });
    await documentReg.confirmPageView(docId, timestamp, pageView, { from: accounts[0] });
    await documentReg.confirmTotalPageView(timestamp, pageView, pageViewSquare, { from: accounts[0] });

    // assert
    const r_tokens = await documentReg.determineAuthorDeco(accounts[0], docId);
    assert.equal(t_deco * 0.7, r_tokens.valueOf(), "different page view");
  });

  it("determine author deco for multi documents", async () => {

    // prepare
    const docId1 = "1234567890abcdefghijklmnopqrstuv";
    const docId2 = "1234567890abcdefghijklmnopqrstu1";

    const orgPageView = 23400;
    const newPageView = 12300;

    const tpv = orgPageView + newPageView;
    const tpvs = (orgPageView * orgPageView) + (newPageView * newPageView);
    const t_deco = 300 * 1000 * 1000;

    const utility = await Utility.deployed();
    const documentReg = await DocumentReg.deployed();

    // setting up
    const timestamp = await utility.getDateMillis();
    await documentReg.register(docId2, { from: accounts[0] });
    await documentReg.confirmPageView(docId1, timestamp, orgPageView, { from: accounts[0] });
    await documentReg.confirmPageView(docId2, timestamp, newPageView, { from: accounts[0] });
    await documentReg.confirmTotalPageView(timestamp, tpv, tpvs, { from: accounts[0] });

    // logic
    const r_deco1 = await documentReg.determineAuthorDeco(accounts[0], docId1);
    const r_deco2 = await documentReg.determineAuthorDeco(accounts[0], docId2);

    // assert
    //console.log('[doc1] pv : ' + orgPageView + ', deco : ' + r_deco1.valueOf());
    //console.log('[doc2] pv : ' + newPageView + ', deco : ' + r_deco2.valueOf());

    const sample1 = t_deco * 0.7 * (orgPageView / tpv);
    const sample2 = t_deco * 0.7 * (newPageView / tpv);

    assert.equal(Math.floor(sample1), r_deco1.valueOf(), "doc1 : different page view");
    assert.equal(Math.floor(sample2), r_deco2.valueOf(), "doc2 : different page view");
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
