const Deck = artifacts.require("./Deck.sol");
const Utility = artifacts.require("./Utility.sol");
const DocumentReg = artifacts.require("./DocumentReg.sol");
const AuthorPool = artifacts.require("./AuthorPool.sol");
const CuratorPool = artifacts.require("./CuratorPool.sol");

contract("DocumentReg", accounts => {

  it("determine author reward", async () => {

    // prepare
    const docId = "1234567890abcdefghijklmnopqrstuv";
    const pageView = 23400;
    const pageViewSquare = 23400 ** 2;
    const t_reward = 300 * 1000 * 1000;

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
    await documentReg.register(docId, { from: accounts[0] });
    await documentReg.confirmPageView(docId, timestamp, pageView, { from: accounts[0] });
    await documentReg.confirmTotalPageView(timestamp, pageView, pageViewSquare, { from: accounts[0] });

    // assert
    var r_tokens = await documentReg.determineAuthorReward(accounts[0], docId);
    r_tokens = web3.fromWei(r_tokens.toNumber(), "ether");
    //console.log('called determineAuthorReward');
    var sample = web3.fromWei(await utility.getDailyRewardPool(70, timestamp), "ether");
    assert.equal(sample * 1, r_tokens * 1, "different page view");
    //console.log('called assert');
  });

  it("determine author reward for multi documents", async () => {

    // prepare
    const docId1 = "1234567890abcdefghijklmnopqrstuv";
    const docId2 = "1234567890abcdefghijklmnopqrstu1";

    const orgPageView = 23400;
    const newPageView = 12300;

    const tpv = orgPageView + newPageView;
    const tpvs = (orgPageView * orgPageView) + (newPageView * newPageView);

    const utility = await Utility.deployed();
    const documentReg = await DocumentReg.deployed();

    // setting up
    const timestamp = await utility.getDateMillis();
    await documentReg.register(docId2, { from: accounts[0] });
    await documentReg.confirmPageView(docId1, timestamp, orgPageView, { from: accounts[0] });
    await documentReg.confirmPageView(docId2, timestamp, newPageView, { from: accounts[0] });
    await documentReg.confirmTotalPageView(timestamp, tpv, tpvs, { from: accounts[0] });

    // logic
    var r_reward1 = await documentReg.determineAuthorReward(accounts[0], docId1);
    var r_reward2 = await documentReg.determineAuthorReward(accounts[0], docId2);
    r_reward1 = web3.fromWei(r_reward1, "ether");
    r_reward2 = web3.fromWei(r_reward2, "ether");
    // assert
    //console.log('[doc1] pv : ' + orgPageView + ', reward : ' + r_reward1.valueOf());
    //console.log('[doc2] pv : ' + newPageView + ', reward : ' + r_reward2.valueOf());

    var sample = await utility.getDailyRewardPool(70, timestamp);
    sample = web3.fromWei(sample, "ether");

    const sample1 = (sample * 1) * (orgPageView / tpv);
    const sample2 = (sample * 1) * (newPageView / tpv);

    assert.equal(sample1, r_reward1 * 1, "doc1 : different page view");
    assert.equal(sample2, r_reward2 * 1, "doc2 : different page view");
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
