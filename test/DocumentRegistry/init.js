const DocumentRegistry = artifacts.require("./DocumentRegistry.sol");

contract("DocumentRegistry", accounts => {

  it("should be initialized", async () => {

    // prepare
    const documentRegistry = await DocumentRegistry.deployed();

    // logic
    var x = new Date();
    var y = x.getFullYear();
    var m = x.getMonth();
    var d = x.getDate();
    var u = new Date(Date.UTC(y, m, d, 0, 0, 0, 0, 0));
    const timestamp = u.getTime();

    await documentRegistry.init(timestamp, 300, { from: accounts[0] });

    // assert
    const b = await documentRegistry.isInitialized();
    assert.equal(true, b, "was not initialized");
  });

});
