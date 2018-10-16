const Deck = artifacts.require("./Deck.sol");
const Utility = artifacts.require("./Utility.sol");
const DocumentReg = artifacts.require("./DocumentReg.sol");
const AuthorPool = artifacts.require("./AuthorPool.sol");
const CuratorPool = artifacts.require("./CuratorPool.sol");

contract("DocumentReg", accounts => {

  it("claim author deco", async () => {

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

    await authorPool.transferOwnership(documentReg.address, { from: accounts[0] });
    await curatorPool.transferOwnership(documentReg.address, { from: accounts[0] });

    init(documentReg, deck, authorPool, curatorPool, utility);

    const BigNumber = web3.BigNumber;
    const totalSupply = new web3.BigNumber(2500000000);
    const rewardPool = new web3.BigNumber(230000000);

    await deck.issue(accounts[0], totalSupply, { from: accounts[0] });
    await deck.release({ from: accounts[0] });
    await deck.transfer(documentReg.address, rewardPool, { from: accounts[0] });

    const balance = await deck.balanceOf(documentReg.address);
    //console.log('balance : ' + balance.toString());
    assert.equal("230000000", balance.valueOf());

    const timestamp = await utility.getDateMillis();
    await documentReg.register(docId, { from: accounts[0] });
    await documentReg.confirmPageView(docId, timestamp, pageView, { from: accounts[0] });
    await documentReg.confirmTotalPageView(timestamp, pageView, pageViewSquare, { from: accounts[0] });

    // logic
    //console.log('calling... determineAuthorDeco');
    const r_tokens = await documentReg.determineAuthorDeco(accounts[0], docId);
    //console.log('calling... assert');
    assert.equal(t_deco * 0.7, r_tokens.valueOf(), "different reward tokens determined");
    //console.log('calling... claimAuthorDeco');
    await documentReg.claimAuthorDeco(docId, { from: accounts[0] });

    // assert
    const balance2 = await deck.balanceOf(documentReg.address);
    //console.log('balance2 : ' + balance2.toString());
    assert.equal("20000000", balance2.valueOf(), "different reward tokens claimed");
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
