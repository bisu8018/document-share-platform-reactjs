const Deck = artifacts.require("./Deck.sol");
const Utility = artifacts.require("./Utility.sol");
const DocumentReg = artifacts.require("./DocumentReg.sol");
const AuthorPool = artifacts.require("./AuthorPool.sol");

contract("DocumentReg", accounts => {

  it("determine rewards", async () => {

    // prepare
    const docId = "1234567890abcdefghijklmnopqrstuv";
    const pageView = 234;
    const t_deco = 300 * 1000 * 1000;

    const deck = await Deck.deployed();
    const utility = await Utility.deployed();
    const documentReg = await DocumentReg.deployed();
    const authorPool = await AuthorPool.deployed();

    init(documentReg, deck, authorPool, "", utility);

    // logic
    const timestamp = await utility.getDateMillis();
    await documentReg.register(docId, { from: accounts[0] });
    await documentReg.confirmPageView(docId, timestamp, pageView, { from: accounts[0] });
    await documentReg.confirmTotalPageViewSquare(timestamp, pageView * pageView, { from: accounts[0] });

    // assert
    const r_tokens = await documentReg.determineDeco(docId);
    assert.equal(t_deco * 0.7, r_tokens.valueOf(), "different page view");
  });

  it("determine rewards for multi documents", async () => {

    // prepare
    const docId1 = "1234567890abcdefghijklmnopqrstuv";
    const docId2 = "1234567890abcdefghijklmnopqrstu1";

    const orgPageView = 234;
    const newPageView = 123;

    const tpvs = (orgPageView * orgPageView) + (newPageView * newPageView);
    const t_deco = 300 * 1000 * 1000;

    const utility = await Utility.deployed();
    const documentReg = await DocumentReg.deployed();

    // setting up
    const timestamp = await utility.getDateMillis();
    await documentReg.register(docId2, { from: accounts[0] });
    await documentReg.confirmPageView(docId1, timestamp, orgPageView, { from: accounts[0] });
    await documentReg.confirmPageView(docId2, timestamp, newPageView, { from: accounts[0] });
    await documentReg.confirmTotalPageViewSquare(timestamp, tpvs, { from: accounts[0] });

    // logic
    const r_deco1 = await documentReg.determineDeco(docId1);
    const r_deco2 = await documentReg.determineDeco(docId2);

    // assert
    //console.log('[doc1] pv : ' + orgPageView + ', deco : ' + r_deco1.valueOf());
    //console.log('[doc2] pv : ' + newPageView + ', deco : ' + r_deco2.valueOf());

    const sample1 = t_deco * 0.7 * ((orgPageView ** 2) / tpvs);
    const sample2 = t_deco * 0.7 * ((newPageView ** 2) / tpvs);

    assert.equal(Math.floor(sample1), r_deco1.valueOf(), "doc1 : different page view");
    assert.equal(Math.floor(sample2), r_deco2.valueOf(), "doc2 : different page view");
  });

  function init(documentReg, deck, authorPool, curatorPool, utility) {

    var _token = deck.address;
    var _utility = utility.address;
    var _author = authorPool.address;
    var _curator = "";

    // logic
    documentReg.init(_token, _author, _curator, _utility, { from: accounts[0] });
  }

});
