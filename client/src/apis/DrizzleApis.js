
export default class DrizzleApis {

  constructor(drizzle){
      this.drizzle = drizzle;
  }

  fromAscii = (str) => {
    return this.drizzle.web3.utils.fromAscii(str);
  }

  toNumber = (str) => {
    return str*1;
  }

  isExistDocument = (documentId) => {

    const drizzle = this.drizzle;
    //console.log("isExistDocument account", account, "documentId", documentId, drizzle);

    const drizzleState = drizzle.store.getState();
    if (!drizzleState.drizzleStatus.initialized) {
      console.error("drizzle state is not initialized!!!");
      return false;
    }
    const ethAccount = drizzleState.accounts[0];
    const contract = drizzle.contracts.DocumentReg;

    const dataKey = contract.methods["contains"].cacheCall(this.fromAscii(documentId), {
      from: ethAccount
    });

    return new Promise(function (resolve, reject) {
      // subscribe to changes in the store
      const unsubscribe = drizzle.store.subscribe(() => {
        // every time the store updates, grab the state from drizzle
        const drizzleState = drizzle.store.getState();
        // check to see if it's ready, if so, update local component state
        if(drizzleState.contracts.DocumentReg.contains[dataKey]){
          unsubscribe();
          console.log("subscribe isExist", drizzleState.contracts.DocumentReg.contains[dataKey].value);
          return resolve(drizzleState.contracts.DocumentReg.contains[dataKey].value);
        }

      });
    });
  }

  voteOnDocument = (documentId, deposit) => {

    if(!documentId){
      alert("documentId is nothing");
      return;
    }

    if(deposit<=0){
      alert("Deposit must be greater than zero.");
      return;
    }
    const drizzleState = this.drizzle.store.getState();
    const ethAccount = drizzleState.accounts[0];
    const contract = this.drizzle.contracts.DocumentReg;
    const stackId = contract.methods["voteOnDocument"].cacheSend(ethAccount, this.fromAscii(documentId), this.toNumber(deposit), {
      from: ethAccount
    });
    console.log("registSmartContractAddress stackId", stackId);
    // save the `stackId` for later reference

    return stackId;
  };

  determineAuthorToken = (documentId) => {

    const drizzle = this.drizzle;
    console.log("determineAuthorToken", documentId, drizzle);

    const drizzleState = drizzle.store.getState();
    if (!drizzleState.drizzleStatus.initialized) {
      console.error("drizzle state is not initialized!!!");
      return ;
    }
    const ethAccount = drizzleState.accounts[0];
    const contract = drizzle.contracts.DocumentReg;

    const dataKey = contract.methods["determineAuthorDeco"].cacheCall(ethAccount, this.fromAscii(documentId), {
      from: ethAccount
    });

    return new Promise(function (resolve, reject) {
      // subscribe to changes in the store
      console.log("dataKey", dataKey);
      const unsubscribe = drizzle.store.subscribe(() => {
        // every time the store updates, grab the state from drizzle
        const drizzleState = drizzle.store.getState();
        // check to see if it's ready, if so, update local component state
        if(drizzleState.contracts.DocumentReg.determineAuthorDeco[dataKey]){
          unsubscribe();
          const dataValue = drizzleState.contracts.DocumentReg.determineAuthorDeco[dataKey].value
          console.log("subscribe determineAuthorToken", dataValue);
          return resolve(dataValue);
        }

      });
    });
  };

  registDocumentToSmartContract = (account, documentId) => {

    if(!documentId){
      alert("documentId is nothing");
      return;
    }

    if(!account){
      alert("account is nothing");
      return;
    }

    const contract = this.drizzle.contracts.DocumentReg;
    const stackId = contract.methods["register"].cacheSend(this.fromAscii(documentId), {
      from: account
    });
    console.log("registSmartContractAddress stackId", stackId);
    // save the `stackId` for later reference

    return stackId;
  };
}
