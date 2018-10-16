const Deck = artifacts.require("./Deck.sol");
const Utility = artifacts.require("./Utility.sol");
const DocumentReg = artifacts.require("./DocumentReg.sol");
const AuthorPool = artifacts.require("./AuthorPool.sol");
const CuratorPool = artifacts.require("./CuratorPool.sol");

contract("DocumentReg", accounts => {

  it("claim author reward", async () => {

    // prepare
    const docId = "1234567890abcdefghijklmnopqrstuv";
    const pageView = 2340;
    const pageViewSquare = 2340 ** 2;

    const deck = await Deck.deployed();
    const utility = await Utility.deployed();
    const documentReg = await DocumentReg.deployed();
    const authorPool = await AuthorPool.deployed();
    const curatorPool = await CuratorPool.deployed();

    const timestamp = await utility.getDateMillis();
    var t_reward = await utility.getDailyRewardPool(70, timestamp);
    t_reward = web3.fromWei(t_reward, "ether");

    await authorPool.transferOwnership(documentReg.address, { from: accounts[0] });
    await curatorPool.transferOwnership(documentReg.address, { from: accounts[0] });

    init(documentReg, deck, authorPool, curatorPool, utility);

    const totalSupply = new web3.BigNumber('10000000000000000000000000000');
    const rewardPool = new web3.BigNumber('200000000000000000000000000');

    await deck.issue(accounts[0], totalSupply, { from: accounts[0] });
    await deck.release({ from: accounts[0] });
    await deck.transfer(documentReg.address, rewardPool, { from: accounts[0] });

    var balance = await deck.balanceOf(documentReg.address);
    balance = web3.fromWei(balance, "ether");
    //console.log('balance : ' + balance.toString());
    assert.equal(200000000, balance * 1);

    await documentReg.register(docId, { from: accounts[0] });
    await documentReg.confirmPageView(docId, timestamp, pageView, { from: accounts[0] });
    await documentReg.confirmTotalPageView(timestamp, pageView, pageViewSquare, { from: accounts[0] });

    // logic
    //console.log('calling... determineAuthorReward');
    var r_tokens = await documentReg.determineAuthorReward(accounts[0], docId);
    //console.log('calling... fron wei : ' + r_tokens);
    r_tokens = web3.fromWei(r_tokens, "ether");
    //console.log('calling... assert');
    assert.equal(t_reward * 1, r_tokens * 1, "different reward tokens determined");
    //console.log('calling... claimAuthorReward');
    await documentReg.claimAuthorReward(docId, { from: accounts[0] });
    //console.log('called claimAuthorReward');

    // assert
    var balance2 = await deck.balanceOf(documentReg.address);
    balance2 = web3.fromWei(balance2, "ether");
    //console.log('balance2 : ' + balance2.toString());

    var s1 = 200;
    var s2 = Math.round((balance2 * 1) / 1000000);

    assert.equal(s1, s2 * 1, "different reward tokens claimed");

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
