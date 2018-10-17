
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

  toBigNumber = (str) => {

    const v = this.drizzle.web3.utils.toWei(str, 'ether');
    //console.log(str, "to bignumber ", v);
    return v;
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
    const drizzleState = this.drizzle.store.getState();

    if (!drizzleState.drizzleStatus.initialized) {
      console.error("drizzle state is not initialized!!!");
      return ;
    }

    if(!documentId){
      alert("documentId is nothing");
      return;
    }

    if(deposit<=0){
      alert("Deposit must be greater than zero.");
      return;
    }

    const ethAccount = drizzleState.accounts[0];

    if(!ethAccount){
      alert("Metamast Account is invaild");
      return;
    }

    const contract = this.drizzle.contracts.DocumentReg;
    const bigNumberDeposit = this.toBigNumber(deposit);
    console.log("vote on document id", documentId, "deposit", deposit, bigNumberDeposit);
    const stackId = contract.methods["voteOnDocument"].cacheSend(this.fromAscii(documentId), bigNumberDeposit, {
      from: ethAccount
    });
    console.log("voteOnDocument stackId", stackId);
    // save the `stackId` for later reference
    return stackId;
  };

  approve = (deposit) => {
    const drizzleState = this.drizzle.store.getState();
    console.log(drizzleState);
    if (!drizzleState.drizzleStatus.initialized) {
      console.error("drizzle state is not initialized!!!");
      return ;
    }

    if(deposit<=0){
      console.log("Deposit must be greater than zero.");
      return;
    }

    const ethAccount = drizzleState.accounts[0];

    if(!ethAccount){
      console.error("Metamast Account is invaild");
      return;
    }

    const DocumentReg = this.drizzle.contracts.DocumentReg;

    if(!DocumentReg){
      console.error("DocumentReg Contract is invaild");
      return;
    }

    const bigNumberDeposit = this.toBigNumber(deposit);
    const stackId = this.drizzle.contracts.Deck.methods["approve"].cacheSend(DocumentReg.address, bigNumberDeposit, {
      from: ethAccount
    });

    console.log("approve stackId", stackId);
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

    const dataKey = contract.methods["determineAuthorToken"].cacheCall(ethAccount, this.fromAscii(documentId), {
      from: ethAccount
    });

    return new Promise(function (resolve, reject) {
      // subscribe to changes in the store
      console.log("dataKey", dataKey);
      const unsubscribe = drizzle.store.subscribe(() => {
        // every time the store updates, grab the state from drizzle
        const drizzleState = drizzle.store.getState();
        // check to see if it's ready, if so, update local component state
        if(drizzleState.contracts.DocumentReg.determineAuthorToken[dataKey]){
          unsubscribe();
          const dataValue = drizzleState.contracts.DocumentReg.determineAuthorToken[dataKey].value
          console.log("subscribe determineAuthorToken", dataValue);
          return resolve(dataValue);
        }

      });
    });
  };

  registDocumentToSmartContract = (documentId) => {
    console.log(documentId, this.drizzle);
    if(!documentId){
      alert("documentId is nothing");
      return;
    }

    const drizzleState = this.drizzle.store.getState();
    const ethAccount = drizzleState.accounts[0];
    const contract = this.drizzle.contracts.DocumentReg;
    const stackId = contract.methods["register"].cacheSend(this.fromAscii(documentId), {
      from: ethAccount
    });
    console.log("registSmartContractAddress stackId", stackId);
    // save the `stackId` for later reference

    return stackId;
  };
}
