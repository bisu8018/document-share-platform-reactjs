const DocumentRegistry = artifacts.require("./DocumentRegistry.sol");

function getDateTimestamp() {
  var x = new Date();
  var y = x.getFullYear();
  var m = x.getMonth();
  var d = x.getDate();
  return (new Date(y, m, d, 0, 0, 0, 0, 0)).getTime();
}

contract("DocumentRegistry", accounts => {

  it("confirm page view", async () => {

    // prepare
    const docId = "1234567890abcdefghijklmnopqrstuv";
    const timestamp = getDateTimestamp();
    const pageView = 234;

    const documentRegistry = await DocumentRegistry.deployed();
    await documentRegistry.init({ from: accounts[0] });
    await documentRegistry.registerDocument(docId, { from: accounts[0] });

    // logic
    await documentRegistry.confirmPageView(docId, timestamp, pageView, { from: accounts[0] });

    // assert
    const r_pageView = await documentRegistry.getPageView(docId, timestamp);
    assert.equal(pageView, r_pageView, "different page view");
  });

});
