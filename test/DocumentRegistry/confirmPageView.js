const DocumentRegistry = artifacts.require("./DocumentRegistry.sol");

contract("DocumentRegistry", accounts => {

  it("confirm page view", async () => {

    // prepare
    const docId = "1234567890abcdefghijklmnopqrstuv";
    const pageView = 234;

    var x = new Date();
    var y = x.getFullYear();
    var m = x.getMonth();
    var d = x.getDate();
    var u = new Date(Date.UTC(y, m, d, 0, 0, 0, 0, 0));
    const timestamp = u.getTime();

    console.log('timestamp : ' + timestamp);
    console.log('getDateTimestamp() : ' + timestamp);

    const documentRegistry = await DocumentRegistry.deployed();
    await documentRegistry.init(timestamp, 300, { from: accounts[0] });
    await documentRegistry.registerDocument(docId, { from: accounts[0] });

    // logic
    await documentRegistry.confirmPageView(docId, timestamp, pageView, { from: accounts[0] });

    // assert
    const r_pageView = await documentRegistry.getPageView(docId, timestamp);
    assert.equal(pageView, r_pageView, "different page view");
  });

});
