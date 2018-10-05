const DocumentRegistry = artifacts.require("./DocumentRegistry.sol");

contract("DocumentRegistry", accounts => {

  it("confirm total page view", async () => {

    // prepare
    const totalPageView = 234000;

    var x = new Date();
    var y = x.getFullYear();
    var m = x.getMonth();
    var d = x.getDate();
    var u = new Date(Date.UTC(y, m, d, 0, 0, 0, 0, 0));
    const timestamp = u.getTime();

    const documentRegistry = await DocumentRegistry.deployed();
    await documentRegistry.init(timestamp, 300, { from: accounts[0] });

    // logic
    await documentRegistry.confirmTotalPageView(timestamp, totalPageView, { from: accounts[0] });

    // assert
    const r_totalPageView = await documentRegistry.getTotalPageView(timestamp);
    assert.equal(totalPageView, r_totalPageView, "different total page view");
  });

});
