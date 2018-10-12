const Deck = artifacts.require("./Deck.sol");
const Utility = artifacts.require("./Utility.sol");
const CuratorPool = artifacts.require("./CuratorPool.sol");

contract("CuratorPool", accounts => {

  it("determine deco of a document with a vote", async () => {
    // prepare
    const docId = "1234567890abcdefghijklmnopqrstuv";
    const pv = 123;
    const pvts = 123 ** 2;

    const deck = await Deck.deployed();
    const utility = await Utility.deployed();
    const curatorPool = await CuratorPool.deployed();

    var _token = deck.address;
    var _utility = utility.address;

    await curatorPool.init(_token, _utility, { from: accounts[0] });

    // logic
    const c1 = await curatorPool.getVoteCount(accounts[1]);
    assert.equal(0, c1 * 1, "not empty");
    await curatorPool.addVote(accounts[1], docId, 10);
    const c2 = await curatorPool.getVoteCount(accounts[1]);
    assert.equal(c1 * 1 + 1, c2 * 1, "failed to add a vote");

    const timestamp = await utility.getDateMillis();
    var deco = await curatorPool.determineDeco(accounts[1], 0, timestamp, pv, pvts);

    // assert
    var sample = (pv ** 2) * (300 * 300 * 1000 / pvts);
    assert.equal(sample, deco * 1, "wrong reward deco");

    var curators = await curatorPool.getCurators();
    assert.equal(1, curators.length, "curator not exist");
  });

  it("determine deco of a document with multi vote", async () => {

    // prepare
    const docId = "1234567890abcdefghijklmnopqrst11";
    const pv1 = 123;
    const pv2 = 234;
    const pvts = 234 ** 2 + 123 ** 2;;

    const deck = await Deck.deployed();
    const utility = await Utility.deployed();
    const curatorPool = await CuratorPool.deployed();

    var curators = await curatorPool.getCurators();
    assert.equal(1, curators.length, "curator not exist");
    //console.log('curators : ' + curators.length);

    // logic
    var c1 = await curatorPool.getVoteCount(accounts[1]);
    assert.equal(1, c1 *= 1, "vote not exist");
    //console.log('vote counts 1 : ' + (c1 * 1));

    await curatorPool.addVote(accounts[1], docId, 20);
    var c2 = await curatorPool.getVoteCount(accounts[1]);
    assert.equal(2, c2 *= 1, "failed to add a vote 2");
    //console.log('vote counts 2 : ' + (c2 * 1));

    await curatorPool.addVote(accounts[1], docId, 30);
    var c3 = await curatorPool.getVoteCount(accounts[1]);
    assert.equal(3, c3 *= 1, "failed to add a vote 3");
    //console.log('vote counts 3 : ' + (c3 * 1));

    const timestamp = await utility.getDateMillis();
    var deco1 = await curatorPool.determineDeco(accounts[1], 0, timestamp, pv1, pvts);
    //console.log('deco 1 : ' + (deco1 * 1));
    var deco2 = await curatorPool.determineDeco(accounts[1], 1, timestamp, pv2, pvts);
    //console.log('deco 2 : ' + (deco2 * 1));
    var deco3 = await curatorPool.determineDeco(accounts[1], 2, timestamp, pv2, pvts);
    //console.log('deco 3 : ' + (deco3 * 1));

    // assert
    var s1 = Math.floor(300 * 300 * 1000 * ((pv1 ** 2)/pvts) * 10/10);
    var s2 = Math.floor(300 * 300 * 1000 * ((pv2 ** 2)/pvts) * 20/50);
    var s3 = Math.floor(300 * 300 * 1000 * ((pv2 ** 2)/pvts) * 30/50);
    var reference = Math.floor((s1 + s2 + s3) / 1000000);
    var sample = Math.floor(((deco1 *= 1) + (deco2 *= 1) + (deco3 *= 1)) / 1000000);

    assert.equal(reference, sample, "wrong reward deco");
  });

});
