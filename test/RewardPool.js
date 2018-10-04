const RewardPool = artifacts.require("./RewardPool.sol");

contract("RewardPool", accounts => {

  it("should store the string 'Hey there!'", async () => {
    const rewardPool = await RewardPool.deployed();
    await rewardPool.set("Hey there!", { from: accounts[0] });
    const storeString = await rewardPool.myString.call();
    assert.equal(storeString, "Hey there!", "The string was not stored");
  });

});
