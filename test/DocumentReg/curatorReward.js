const Deck = artifacts.require("./Deck.sol");
const Utility = artifacts.require("./Utility.sol");
const DocumentReg = artifacts.require("./DocumentReg.sol");
const AuthorPool = artifacts.require("./AuthorPool.sol");
const CuratorPool = artifacts.require("./CuratorPool.sol");

contract("DocumentReg - estimate curator rewards", accounts => {

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
  var DAYS_9;

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
    DAYS_9 = ((await _utility.getDateMillis()) * 1) - 9 * (await _utility.getOneDayMillis());

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

    await _deck.transfer(_documentReg.address, rewardPool, { from: accounts[0] });

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
    // ACOUNT[4] : DOC #1(100), +3 DAYS
    // ACOUNT[4] : DOC #4(400), +4 DAYS
    // ACOUNT[4] : DOC #3(100), +0 DAYS

    const VOTE_A3_D1 = new web3.BigNumber('100000000000000000000');
    const VOTE_A3_D2 = new web3.BigNumber('200000000000000000000');
    const VOTE_A4_D1 = new web3.BigNumber('100000000000000000000');
    const VOTE_A4_D4 = new web3.BigNumber('400000000000000000000');
    const VOTE_A4_D3 = new web3.BigNumber('100000000000000000000');

    await _documentReg.updateVoteOnDocument(accounts[3], DOC1, VOTE_A3_D1, DAYS_5, { from: accounts[0] });
    await _documentReg.updateVoteOnDocument(accounts[3], DOC2, VOTE_A3_D2, DAYS_1, { from: accounts[0] });
    await _documentReg.updateVoteOnDocument(accounts[4], DOC1, VOTE_A4_D1, DAYS_3, { from: accounts[0] });
    await _documentReg.updateVoteOnDocument(accounts[4], DOC4, VOTE_A4_D4, DAYS_4, { from: accounts[0] });
    await _documentReg.updateVoteOnDocument(accounts[4], DOC3, VOTE_A4_D3, DAYS_0, { from: accounts[0] });

    const deposit_A3_D1 = (await _documentReg.getDepositOnDocument(accounts[3], DOC1, DAYS_5)) * 1;
    //console.log('deposit_A3_D1 : ' + deposit_A3_D1);
    assert.equal(VOTE_A3_D1, deposit_A3_D1);

    const deposit_A3_D2 = (await _documentReg.getDepositOnDocument(accounts[3], DOC2, DAYS_1)) * 1;
    //console.log('deposit_A3_D2 : ' + deposit_A3_D2);
    assert.equal(VOTE_A3_D2, deposit_A3_D2);

    const deposit_A4_D1 = (await _documentReg.getDepositOnDocument(accounts[4], DOC1, DAYS_3)) * 1;
    //console.log('deposit_A4_D1 : ' + deposit_A4_D1);
    assert.equal(VOTE_A4_D1, deposit_A4_D1);

    const deposit_A4_D4 = (await _documentReg.getDepositOnDocument(accounts[4], DOC4, DAYS_4)) * 1;
    //console.log('deposit_A4_D4 : ' + deposit_A4_D4);
    assert.equal(VOTE_A4_D4, deposit_A4_D4);

    const deposit_A4_D3 = (await _documentReg.getDepositOnDocument(accounts[4], DOC3, DAYS_0)) * 1;
    //console.log('deposit_A4_D3 : ' + deposit_A4_D3);
    assert.equal(VOTE_A4_D3, deposit_A4_D3);
  });

  it("estimate curator reward for 1day", async () => {

    // ---------------------------
    // CURATOR POOL
    // ---------------------------
    // ACOUNT[3] : DOC #1(100), +5 DAYS, VOTE(100, 100, 100, 100, 100)
    // ACOUNT[3] : DOC #2(200), +1 DAYS, VOTE(200)
    // ACOUNT[4] : DOC #1(100), +3 DAYS, VOTE(100, 100, 100)
    // ACOUNT[4] : DOC #4(400), +4 DAYS, VOTE(400, 400, 400, 400)
    // ACOUNT[4] : DOC #3(100), +0 DAYS, VOTE()

    // DOC #1 : ACOUNT[1], PV(100, 200, 300, 400, 500)
    // DOC #2 : ACOUNT[1], PV(200)
    // DOC #3 : ACOUNT[1], PV()
    // DOC #4 : ACOUNT[2], PV(100, 200, 300, 400, 500, 600, 700, 800)
    // DOC #5 : ACOUNT[2], PV(300)

    const todayMillis = (await _utility.getTimeMillis()) * 1;
    const dayMillis = (await _utility.getOneDayMillis()) * 1;
    const drp_1 = web3.fromWei(await _utility.getDailyRewardPool(30, todayMillis - 1 * dayMillis));

    // ---------------
    const ref_A3_D2_D1 = (drp_1 * 1) * (200 / (200)) * (40000 / (10000 + 40000 + 10000 + 90000));

    const reward_A3_D2 = web3.fromWei(await _documentReg.estimateCuratorReward(accounts[3], DOC2, { from: accounts[0] }));
    const sample = Math.round((reward_A3_D2 * 1) / 100);
    const reference = Math.round((ref_A3_D2_D1) / 100);
    assert.equal(reference, sample, "wrong amount of estimated token curator #3, doc #2");
  });

  it("estimate curator reward for 5days", async () => {

    // ---------------------------
    // CURATOR POOL
    // ---------------------------
    // ACOUNT[3] : DOC #1(100), +5 DAYS, VOTE(100, 100, 100, 100, 100)
    // ACOUNT[3] : DOC #2(200), +1 DAYS, VOTE(200)
    // ACOUNT[4] : DOC #1(100), +3 DAYS, VOTE(100, 100, 100)
    // ACOUNT[4] : DOC #4(400), +4 DAYS, VOTE(400, 400, 400, 400)
    // ACOUNT[4] : DOC #3(100), +0 DAYS, VOTE()

    // DOC #1 : ACOUNT[1], PV(100, 200, 300, 400, 500)
    // DOC #2 : ACOUNT[1], PV(200)
    // DOC #3 : ACOUNT[1], PV()
    // DOC #4 : ACOUNT[2], PV(100, 200, 300, 400, 500, 600, 700, 800)
    // DOC #5 : ACOUNT[2], PV(300)

    const todayMillis = (await _utility.getTimeMillis()) * 1;
    const dayMillis = (await _utility.getOneDayMillis()) * 1;
    const drp_1 = web3.fromWei(await _utility.getDailyRewardPool(30, todayMillis - 1 * dayMillis));
    const drp_2 = web3.fromWei(await _utility.getDailyRewardPool(30, todayMillis - 2 * dayMillis));
    const drp_3 = web3.fromWei(await _utility.getDailyRewardPool(30, todayMillis - 3 * dayMillis));
    const drp_4 = web3.fromWei(await _utility.getDailyRewardPool(30, todayMillis - 4 * dayMillis));
    const drp_5 = web3.fromWei(await _utility.getDailyRewardPool(30, todayMillis - 5 * dayMillis));

    // ---------------
    const ref_A3_D1_D1 = ((drp_1 * 1) * (100 / (100 + 100))) / (10000 + 40000 + 10000 + 90000) * 10000;
    const ref_A3_D1_D2 = ((drp_2 * 1) * (100 / (100 + 100))) / (40000 + 40000) * 40000;
    const ref_A3_D1_D3 = ((drp_3 * 1) * (100 / (100 + 100))) / (90000 + 90000) * 90000;
    const ref_A3_D1_D4 = ((drp_4 * 1) * (100 / (100))) / (160000 + 160000) * 160000;
    const ref_A3_D1_D5 = ((drp_5 * 1) * (100 / (100))) / (250000 + 250000) * 250000;

    //console.log('ref_A3_D1_D1 : ' + ref_A3_D1_D1);
    //console.log('ref_A3_D1_D2 : ' + ref_A3_D1_D2);
    //console.log('ref_A3_D1_D3 : ' + ref_A3_D1_D3);
    //console.log('ref_A3_D1_D4 : ' + ref_A3_D1_D4);
    //console.log('ref_A3_D1_D5 : ' + ref_A3_D1_D5);

    const reward_A3_D1 = web3.fromWei(await _documentReg.estimateCuratorReward(accounts[3], DOC1, { from: accounts[0] }));
    const sample = Math.floor((reward_A3_D1 * 1) / 10);
    const reference = Math.floor((ref_A3_D1_D1 + ref_A3_D1_D2 + ref_A3_D1_D3 + ref_A3_D1_D4 + ref_A3_D1_D5) / 10);
    assert.equal(reference, sample, "wrong amount of estimated token curator #3, doc #1");
  });

  it("determine curator reward for 29, 30, 31 days", async () => {

    // ---------------------------
    // CURATOR POOL
    // ---------------------------
    // ACOUNT[3] : DOC #1(100), +5 DAYS, VOTE(100, 100, 100, 100, 100)
    // ACOUNT[3] : DOC #2(200), +1 DAYS, VOTE(200)
    // ACOUNT[4] : DOC #1(100), +3 DAYS, VOTE(100, 100, 100)
    // ACOUNT[4] : DOC #4(400), +4 DAYS, VOTE(400, 400, 400, 400)
    // ACOUNT[4] : DOC #3(100), +0 DAYS, VOTE()

    // DOC #1 : ACOUNT[1], PV(100, 200, 300, 400, 500)
    // DOC #2 : ACOUNT[1], PV(200)
    // DOC #3 : ACOUNT[1], PV()
    // DOC #4 : ACOUNT[2], PV(100, 200, 300, 400, 500, 600, 700, 800)
    // DOC #5 : ACOUNT[2], PV(300)

    const DAYS_29 = ((await _utility.getDateMillis()) * 1) - 29 * (await _utility.getOneDayMillis());
    const DAYS_30 = ((await _utility.getDateMillis()) * 1) - 30 * (await _utility.getOneDayMillis());
    const DAYS_31 = ((await _utility.getDateMillis()) * 1) - 31 * (await _utility.getOneDayMillis());

    const todayMillis = (await _utility.getTimeMillis()) * 1;
    const dayMillis = (await _utility.getOneDayMillis()) * 1;
    const drp_1 = web3.fromWei(await _utility.getDailyRewardPool(30, todayMillis - 1 * dayMillis));
    const drp_2 = web3.fromWei(await _utility.getDailyRewardPool(30, todayMillis - 2 * dayMillis));
    const drp_3 = web3.fromWei(await _utility.getDailyRewardPool(30, todayMillis - 3 * dayMillis));
    const drp_4 = web3.fromWei(await _utility.getDailyRewardPool(30, todayMillis - 4 * dayMillis));
    const drp_5 = web3.fromWei(await _utility.getDailyRewardPool(30, todayMillis - 5 * dayMillis));

    // ---------------
    const ref_A3_D1_D1 = 0; //((drp_1 * 1) * (100 / (100 + 100))) / (10000 + 40000 + 10000 + 90000) * 10000;
    const ref_A3_D1_D2 = ((drp_2 * 1) * (100 / (100 + 100 + 100 + 100 + 100))) / (40000 + 40000) * 40000;
    const ref_A3_D1_D3 = ((drp_3 * 1) * (100 / (100 + 100 + 100 + 100 + 100))) / (90000 + 90000) * 90000;
    const ref_A3_D1_D4 = ((drp_4 * 1) * (100 / (100 + 100 + 100 + 100))) / (160000 + 160000) * 160000;
    const ref_A3_D1_D5 = ((drp_5 * 1) * (100 / (100 + 100 + 100 + 100))) / (250000 + 250000) * 250000;

    //console.log('ref_A3_D1_D1 : ' + ref_A3_D1_D1);
    //console.log('ref_A3_D1_D2 : ' + ref_A3_D1_D2);
    //console.log('ref_A3_D1_D3 : ' + ref_A3_D1_D3);
    //console.log('ref_A3_D1_D4 : ' + ref_A3_D1_D4);
    //console.log('ref_A3_D1_D5 : ' + ref_A3_D1_D5);

    const VOTE_A3_D1 = new web3.BigNumber('100000000000000000000');
    const reference = Math.floor((ref_A3_D1_D1 + ref_A3_D1_D2 + ref_A3_D1_D3 + ref_A3_D1_D4 + ref_A3_D1_D5));

    const reward_A3_D2_E = web3.fromWei(await _documentReg.estimateCuratorReward(accounts[3], DOC1, { from: accounts[0] }));

    await _documentReg.update(accounts[1], DOC1, DAYS_31, { from: accounts[0] });
    await _documentReg.updateVoteOnDocument(accounts[3], DOC1, VOTE_A3_D1, DAYS_29, { from: accounts[0] });
    const reward_A3_D1_29 = web3.fromWei(await _documentReg.determineCuratorReward(DOC1, { from: accounts[3] }));
    const sample_29 = Math.floor((reward_A3_D1_29 * 1));
    assert.equal(0, sample_29, "wrong amount of determined token curator #3, doc #1, day 29");

    await _documentReg.updateVoteOnDocument(accounts[3], DOC1, VOTE_A3_D1, DAYS_30, { from: accounts[0] });
    const reward_A3_D1_30 = web3.fromWei(await _documentReg.determineCuratorReward(DOC1, { from: accounts[3] }));
    const sample_30 = Math.floor((reward_A3_D1_30 * 1));
    assert.equal(0, sample_30, "wrong amount of determined token curator #3, doc #1, day 30");

    await _documentReg.updateVoteOnDocument(accounts[3], DOC1, VOTE_A3_D1, DAYS_31, { from: accounts[0] });
    const reward_A3_D1_31 = web3.fromWei(await _documentReg.determineCuratorReward(DOC1, { from: accounts[3] }));
    const sample_31 = Math.floor((reward_A3_D1_31 * 1));
    //assert.equal(reward_A3_D2_E, sample_31, "wrong amount of determined token curator #3, doc #1, day 31");
    assert.equal(reference, sample_31, "wrong amount of determined token curator #3, doc #1, day 31");
  });

  it("claim curator reward for 29, 30, 31 days", async () => {
    // TODO : coding test
  });

  it("vote on a document", async () => {
    // TODO : coding test
  });

  it("get tokens a user voted on a document", async () => {
    // TODO : coding test
  });

  it("get tokens voted on a document", async () => {
    // TODO : coding test
  });

  it("get tokens a user earned on a document", async () => {
    // TODO : coding test
  });

  it("get tokens earned on a document", async () => {
    // TODO : coding test
  });

});
