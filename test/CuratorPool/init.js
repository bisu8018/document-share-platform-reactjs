const Deck = artifacts.require("./Deck.sol");
const Utility = artifacts.require("./Utility.sol");
const CuratorPool = artifacts.require("./CuratorPool.sol");

contract("CuratorPool", accounts => {

  it("should be initialized", async () => {

    // prepare
    const deck = await Deck.deployed();
    const utility = await Utility.deployed();
    const curatorPool = await CuratorPool.deployed();

    var _token = deck.address;
    var _utility = utility.address;

    // logic
    await curatorPool.init(_token, _utility, { from: accounts[0] });

    // assert
    const b = await curatorPool.createTime.call();
    assert.notEqual(b, 0, "was not initialized");
  });

});
