const DocumentRegistry = artifacts.require("./DocumentRegistry.sol");

contract("DocumentRegistry", accounts => {

  it("registered document should exist", async () => {

    // prepare
    const docId = "1234567890abcdefghijklmnopqrstuv";
    const documentRegistry = await DocumentRegistry.deployed();

    // logic
    await documentRegistry.registerDocument(docId, { from: accounts[0] });

    // assert
    const isExist = await documentRegistry.isExist(docId, { from: accounts[0] });
    assert.equal(true, isExist, "can't find document");
  });

});
