const DocumentRegistry = artifacts.require("./DocumentRegistry.sol");

contract("DocumentRegistry", accounts => {

  it("should be initialized", async () => {

    // prepare
    const documentRegistry = await DocumentRegistry.deployed();

    // logic
    await documentRegistry.init({ from: accounts[0] });

    // assert
    const foundation = await documentRegistry.foundation.call();
    assert.equal(foundation, accounts[0], "did not initialized");
  });

});
