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

  it("should be able to get my documents", async () => {

    // prepare
    var x = accounts[0].toString();
    x = x.substring(3,23);

    const docId0 = x + "klmnopqrstuv";
    const docId1 = x + "klmnopqrstu1";
    const docId2 = x + "klmnopqrstu2";
    const docId3 = x + "klmnopqrstu3";

    //console.log("docId0 : " + docId0);

    const documentRegistry = await DocumentRegistry.deployed();

    //console.log("documentRegistry : " + documentRegistry.toString());

    await documentRegistry.registerDocument(docId0, { from: accounts[0] });
    await documentRegistry.registerDocument(docId1, { from: accounts[0] });
    await documentRegistry.registerDocument(docId2, { from: accounts[0] });
    await documentRegistry.registerDocument(docId3, { from: accounts[0] });

    // logic
    var docCount = await documentRegistry.getUserDocumentsCount({ from: accounts[0] });

    var r1 = false;
    for (var i=0; i<docCount; i++) {
      const cur = await documentRegistry.getUserDocument(i, { from: accounts[0] });
      if (docId1 == cur) {
        r1 = true;
        break;
      }
    }

    var r2 = false;
    for (var i=0; i<docCount; i++) {
      const cur = await documentRegistry.getUserDocument(i, { from: accounts[0] });
      if (docId2 == cur) {
        r2 = true;
        break;
      }
    }

    var r3 = false;
    for (var i=0; i<docCount; i++) {
      const cur = await documentRegistry.getUserDocument(i, { from: accounts[0] });
      if (docId3 == cur) {
        r3 = true;
        break;
      }
    }

    //console.log('document count : ' + docCount);

    // assert
    assert.equal(true, r1, "different document 1");
    assert.equal(true, r2, "different document 2");
    assert.equal(true, r3, "different document 3");
  });

});
