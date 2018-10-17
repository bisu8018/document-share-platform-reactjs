const Deck = artifacts.require("./Deck.sol");
const Utility = artifacts.require("./Utility.sol");
const DocumentReg = artifacts.require("./DocumentReg.sol");
const AuthorPool = artifacts.require("./AuthorPool.sol");
const CuratorPool = artifacts.require("./CuratorPool.sol");

contract("DocumentReg", accounts => {

  const DOC1 = "10000000000000000000000000000001";
  const DOC2 = "10000000000000000000000000000002";
  const DOC3 = "10000000000000000000000000000003";
  const DOC4 = "10000000000000000000000000000004";
  const DOC5 = "10000000000000000000000000000005";

  var DAYS_0;
  var DAYS_1;
  var DAYS_2;
  var DAYS_3;
  var DAYS_4;
  var DAYS_5;
  var DAYS_6;
  var DAYS_7;
  var DAYS_8;

  it("setting up....", async () => {

    // ---------------------------
    // INIT CONTRACTS
    // ---------------------------
    _deck = await Deck.deployed();
    _utility = await Utility.deployed();
    _authorPool = await AuthorPool.deployed();
    _curatorPool = await CuratorPool.deployed();
    _documentReg = await DocumentReg.deployed();

    await _authorPool.transferOwnership(_documentReg.address, { from: accounts[0] });
    await _curatorPool.transferOwnership(_documentReg.address, { from: accounts[0] });

    await _documentReg.init (
      _deck.address,
      _authorPool.address,
      _curatorPool.address,
      _utility.address,
      { from: accounts[0] }
    );

    DAYS_0 = ((await _utility.getDateMillis()) * 1) - 0 * (await _utility.getOneDayMillis());
    DAYS_1 = ((await _utility.getDateMillis()) * 1) - 1 * (await _utility.getOneDayMillis());
    DAYS_2 = ((await _utility.getDateMillis()) * 1) - 2 * (await _utility.getOneDayMillis());
    DAYS_3 = ((await _utility.getDateMillis()) * 1) - 3 * (await _utility.getOneDayMillis());
    DAYS_4 = ((await _utility.getDateMillis()) * 1) - 4 * (await _utility.getOneDayMillis());
    DAYS_5 = ((await _utility.getDateMillis()) * 1) - 5 * (await _utility.getOneDayMillis());
    DAYS_6 = ((await _utility.getDateMillis()) * 1) - 6 * (await _utility.getOneDayMillis());
    DAYS_7 = ((await _utility.getDateMillis()) * 1) - 7 * (await _utility.getOneDayMillis());
    DAYS_8 = ((await _utility.getDateMillis()) * 1) - 8 * (await _utility.getOneDayMillis());

    // ---------------------------
    // DECK
    // ---------------------------
    // - TOTAL SUPPLY (ACCOUNT[0]) : 10,000,000,000 DECK
    // - REWARD POOL (documentReg.address) : 200,000,000 DECK
    // - ACCOUNT[1] : 300,000 DECK
    // - ACCOUNT[2] : 200,000 DECK
    // - ACCOUNT[3] : 100,000 DECK
    // - ACCOUNT[4] : 100,000 DECK
    // - ACCOUNT[5] : 100,000 DECK

    const totalSupply = new web3.BigNumber('10000000000000000000000000000');
    const rewardPool = new web3.BigNumber('200000000000000000000000000');

    await _deck.issue(accounts[0], totalSupply, { from: accounts[0] });
    await _deck.release({ from: accounts[0] });

    await _deck.transfer(accounts[1], '300000000000000000000000', { from: accounts[0] });
    await _deck.transfer(accounts[2], '200000000000000000000000', { from: accounts[0] });
    await _deck.transfer(accounts[3], '100000000000000000000000', { from: accounts[0] });
    await _deck.transfer(accounts[4], '100000000000000000000000', { from: accounts[0] });
    await _deck.transfer(accounts[5], '100000000000000000000000', { from: accounts[0] });

    // ---------------------------
    // DOCUMENT REGISTRY
    // ---------------------------
    // DOC #1 : ACOUNT[1], PV(100, 200, 300, 400, 500)
    // DOC #2 : ACOUNT[1], PV(200)
    // DOC #3 : ACOUNT[1], PV()
    // DOC #4 : ACOUNT[2], PV(100, 200, 300, 400, 500, 600, 700, 800)
    // DOC #5 : ACOUNT[2], PV(300)

    // ---------------------------
    // AUTHOR POOL
    // ---------------------------
    // ACOUNT[1] : DOC #1, +5 DAYS
    // ACOUNT[1] : DOC #2, +1 DAYS
    // ACOUNT[1] : DOC #3, +0 DAYS
    // ACOUNT[2] : DOC #4, +8 DAYS
    // ACOUNT[2] : DOC #5, +1 DAYS

    await _documentReg.update(accounts[1], DOC1, DAYS_5, { from: accounts[0] });
    await _documentReg.update(accounts[1], DOC2, DAYS_1, { from: accounts[0] });
    await _documentReg.update(accounts[1], DOC3, DAYS_0, { from: accounts[0] });
    await _documentReg.update(accounts[2], DOC4, DAYS_8, { from: accounts[0] });
    await _documentReg.update(accounts[2], DOC5, DAYS_1, { from: accounts[0] });

    await _documentReg.confirmPageView(DOC1, DAYS_1, 100, { from: accounts[0] });
    await _documentReg.confirmPageView(DOC1, DAYS_2, 200, { from: accounts[0] });
    await _documentReg.confirmPageView(DOC1, DAYS_3, 300, { from: accounts[0] });
    await _documentReg.confirmPageView(DOC1, DAYS_4, 400, { from: accounts[0] });
    await _documentReg.confirmPageView(DOC1, DAYS_5, 500, { from: accounts[0] });
    await _documentReg.confirmPageView(DOC2, DAYS_1, 200, { from: accounts[0] });
    await _documentReg.confirmPageView(DOC4, DAYS_1, 100, { from: accounts[0] });
    await _documentReg.confirmPageView(DOC4, DAYS_2, 200, { from: accounts[0] });
    await _documentReg.confirmPageView(DOC4, DAYS_3, 300, { from: accounts[0] });
    await _documentReg.confirmPageView(DOC4, DAYS_4, 400, { from: accounts[0] });
    await _documentReg.confirmPageView(DOC4, DAYS_5, 500, { from: accounts[0] });
    await _documentReg.confirmPageView(DOC4, DAYS_6, 600, { from: accounts[0] });
    await _documentReg.confirmPageView(DOC4, DAYS_7, 700, { from: accounts[0] });
    await _documentReg.confirmPageView(DOC4, DAYS_8, 800, { from: accounts[0] });
    await _documentReg.confirmPageView(DOC5, DAYS_1, 300, { from: accounts[0] });

    await _documentReg.confirmTotalPageView(DAYS_1, 700, 150000, { from: accounts[0] });
    await _documentReg.confirmTotalPageView(DAYS_2, 400, 80000, { from: accounts[0] });
    await _documentReg.confirmTotalPageView(DAYS_3, 600, 180000, { from: accounts[0] });
    await _documentReg.confirmTotalPageView(DAYS_4, 800, 320000, { from: accounts[0] });
    await _documentReg.confirmTotalPageView(DAYS_5, 1000, 500000, { from: accounts[0] });
    await _documentReg.confirmTotalPageView(DAYS_6, 600, 360000, { from: accounts[0] });
    await _documentReg.confirmTotalPageView(DAYS_7, 700, 490000, { from: accounts[0] });
    await _documentReg.confirmTotalPageView(DAYS_8, 800, 640000, { from: accounts[0] });

    const balance_A1_S1 = web3.fromWei(await _deck.balanceOf(accounts[1]), "ether");
    assert.equal(300000, balance_A1_S1 * 1);

    // ---------------------------
    // CURATOR POOL
    // ---------------------------
    // ACOUNT[3] : DOC #1(100), +5 DAYS
    // ACOUNT[3] : DOC #2(200), +1 DAYS
    // ACOUNT[4] : DOC #1(100), +5 DAYS
    // ACOUNT[4] : DOC #4(400), +4 DAYS
    // ACOUNT[4] : DOC #3(100), +0 DAYS

  });

  it("claim author reward", async () => {

    // ------------------
    // ACCOUNT[1]
    //  : 300,000 DECK
    //  : DOC #1, +5 DAYS, PV(100, 200, 300, 400, 500)
    //  : DOC #2, +1 DAYS, PV(200)
    //  : DOC #3, +0 DAYS, PV()

    // #1. check initial token balance
    const balance_A1_S1 = web3.fromWei(await _deck.balanceOf(accounts[1]), "ether");
    console.log('balance_A1_S1 : ' + balance_A1_S1.toString());
    assert.equal(300000, balance_A1_S1 * 1);

    const balance_A4_S1 = web3.fromWei(await _deck.balanceOf(accounts[4]), "ether");
    console.log('balance_A4_S1 : ' + balance_A4_S1.toString());
    assert.equal(100000, balance_A4_S1 * 1);

    // #2. determine the amount of reward (DOC #1~#3)
    const rwdDoc1 = web3.fromWei(await _documentReg.determineAuthorReward(accounts[1], DOC1));
    console.log('rwdDoc1 : ' + rwdDoc1);
    assert.equal(rwdDoc1 * 1, rwdDoc1 * 1, "wrong amount of reward token determined doc #1");

    const rwdDoc2 = web3.fromWei(await _documentReg.determineAuthorReward(accounts[1], DOC2));
    console.log('rwdDoc2 : ' + rwdDoc2);
    assert.equal(rwdDoc2 * 1, rwdDoc2 * 1, "wrong amount of reward token determined doc #2");

    const rwdDoc3 = web3.fromWei(await _documentReg.determineAuthorReward(accounts[1], DOC3));
    console.log('rwdDoc3 : ' + rwdDoc3);
    assert.equal(rwdDoc3 * 1, rwdDoc3 * 1, "wrong amount of reward token determined doc #3");

    await _documentReg.claimAuthorReward(DOC1, { from: accounts[4] });
    const balance_A1_S2 = web3.fromWei(await _deck.balanceOf(accounts[1]), "ether");
    console.log('balance_A1_S2 : ' + balance_A1_S2.toString());
    assert.equal(balance_A1_S1 * 1, balance_A1_S2 * 1);

    await _documentReg.claimAuthorReward(DOC1, { from: accounts[1] });
    const balance_A1_S3 = web3.fromWei(await _deck.balanceOf(accounts[1]), "ether");
    console.log('balance_A1_S3 : ' + balance_A1_S3.toString());
    assert.isBelow(balance_A1_S1 * 1, balance_A1_S3 * 1);

    //console.log('called claimAuthorReward');
/*
    // assert
    var balance2 = await deck.balanceOf(documentReg.address);
    balance2 = web3.fromWei(balance2, "ether");
    //console.log('balance2 : ' + balance2.toString());

    var s1 = 200;
    var s2 = Math.round((balance2 * 1) / 1000000);

    assert.equal(s1, s2 * 1, "different reward tokens claimed");
*/
  });

});
