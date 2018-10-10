const Deck = artifacts.require("./Deck.sol");
const Utility = artifacts.require("./Utility.sol");
const AuthorPool = artifacts.require("./AuthorPool.sol");

contract("AuthorPool", accounts => {

  it("should be initialized", async () => {

    // prepare
    const deck = await Deck.deployed();
    const utility = await Utility.deployed();
    const authorPool = await AuthorPool.deployed();

    var _token = deck.address;
    var _utility = utility.address;

    // logic
    await authorPool.init(_token, _utility, { from: accounts[0] });

    // assert
    const b = await authorPool.createTime.call();
    assert.notEqual(b, 0, "was not initialized");
  });

  it("registered document should exist", async () => {

    // prepare
    const docId = "1234567890abcdefghijklmnopqrstuv";
    const authorPool = await AuthorPool.deployed();

    // logic
    await authorPool.register(docId, { from: accounts[0] });

    // assert
    const isExist = await authorPool.contains(docId, { from: accounts[0] });
    assert.equal(true, isExist, "can't find document");
  });

});
