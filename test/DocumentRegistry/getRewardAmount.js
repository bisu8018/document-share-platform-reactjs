const DocumentRegistry = artifacts.require("./DocumentRegistry.sol");

const ONE_DAY_MILLIS = 86400000;

contract("DocumentRegistry", accounts => {

  it("can get reward amount of mine", async () => {

    // prepare
    const docId = "1234567890abcdefghijklmnopqrstuv";

    var x = new Date();
    var y = x.getFullYear();
    var m = x.getMonth();
    var d = x.getDate();
    var u = new Date(Date.UTC(y, m, d, 0, 0, 0, 0, 0));
    const timestamp = u.getTime();

    const documentRegistry = await DocumentRegistry.deployed();
    await documentRegistry.init(timestamp, 300, { from: accounts[0] });
    await documentRegistry.registerDocument(docId, { from: accounts[0] });
    await documentRegistry.confirmTotalPageView(timestamp, 10000, { from: accounts[0] });
    await documentRegistry.confirmPageView(docId, timestamp, 100, { from: accounts[0] });

    //console.log('timestamp : ' + timestamp);
    //console.log('docId : ' + docId);
    const r_dr = await documentRegistry.getRewardAmount(docId, timestamp, { from: accounts[0] });
    assert.equal(0, r_dr.ValueOf(), "can't get reward amount");
  });

});
