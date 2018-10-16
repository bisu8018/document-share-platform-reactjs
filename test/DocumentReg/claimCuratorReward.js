const Deck = artifacts.require("./Deck.sol");
const Utility = artifacts.require("./Utility.sol");
const DocumentReg = artifacts.require("./DocumentReg.sol");
const AuthorPool = artifacts.require("./AuthorPool.sol");
const CuratorPool = artifacts.require("./CuratorPool.sol");

contract("DocumentReg", accounts => {

  it("claim curator reward", async () => {

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

    const BigNumber = web3.BigNumber;
    const totalSupply = new web3.BigNumber(1000000000);
    const deposit = new web3.BigNumber(100000000);

    await deck.issue(accounts[0], totalSupply, { from: accounts[0] });
    await deck.release({ from: accounts[0] });
    await deck.transfer(documentReg.address, deposit, { from: accounts[0] });
    await deck.transfer(accounts[3], 20, { from: accounts[0] });

    const balance = await deck.balanceOf(documentReg.address);
    //console.log('balance : ' + balance.toString());
    assert.equal("100000000", balance.valueOf());

    const timestamp = await utility.getDateMillis();
    await documentReg.register(docId, { from: accounts[0] });
    await documentReg.confirmPageView(docId, timestamp, pageView, { from: accounts[0] });
    await documentReg.confirmTotalPageView(timestamp, pageView, pageViewSquare, { from: accounts[0] });

    // logic
    await deck.approve(documentReg.address, 10, { from: accounts[3] });
    await documentReg.voteOnDocument(docId, 10, { from: accounts[3] });

    // assert
    const balance2 = await deck.balanceOf(accounts[3]);
    //console.log('balance : ' + balance.toString());
    assert.equal("10", balance2.valueOf(), "wrong amount of token deposit");

    await documentReg.claimCuratorReward(docId, { from: accounts[3] });

    // assert
    const balance3 = await deck.balanceOf(accounts[3]);
    //console.log('balance : ' + balance.toString());
    assert.equal("10", balance3.valueOf(), "wrong amount of token reward received");
    // assert
    const balance4 = await deck.balanceOf(documentReg.address);
    assert.equal("100000010", balance4.valueOf(), "wrong amount of token reward withdraw");
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
