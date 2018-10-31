
export default class DrizzleApis {

  constructor(drizzle){
      this.drizzle = drizzle;
  }

  fromAscii = (str) => {
    return this.drizzle.web3.utils.fromAscii(str);
  }

  toWei = (str) => {
    return this.drizzle.web3.utils.fromWei(str, "ether");
  }

  toNumber = (str) => {
    return str*1;
  }

  toBigNumber = (str) => {
    const v = this.drizzle.web3.utils.toWei(str, 'ether');
    //console.log(str, "to bignumber ", v);
    return v;
  }

  isExistDocument = (documentId, ethAccount) => {

    const drizzle = this.drizzle;
    //console.log("isExistDocument account", account, "documentId", documentId, drizzle);

    const contract = drizzle.contracts.DocumentReg;

    const dataKey = contract.methods["contains"].cacheCall(this.fromAscii(documentId), {
      from: ethAccount
    });

    return dataKey;

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
    console.log("vote on document id", documentId, "deposit", deposit, bigNumberDeposit, "contract address", contract.address);
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

  requestTotalBalance = () => {
    const drizzleState = this.drizzle.store.getState();
    const ethAccount = drizzleState.accounts[0];
    const contract = this.drizzle.contracts.Deck;

    if(!ethAccount){
      console.error("The Metamask login is required.")
      return null;
    }

    console.log("account", ethAccount);
    const dataKey = contract.methods.balanceOf.cacheCall(ethAccount, {
      from: ethAccount
    });

    return dataKey;
  };

  getTotalBalance = (dataKey) => {
    if(!dataKey) return 0;
    const drizzleState = this.drizzle.store.getState();
    const ethAccount = drizzleState.accounts[0];
    const contract = this.drizzle.contracts.Deck;

    if(!ethAccount){
      console.error("The Metamask login is required.")
      return null;
    }
    
    console.log("getTotalBalance", drizzleState.contracts.Deck.balanceOf[dataKey]);

    if(!drizzleState.contracts.Deck.balanceOf[dataKey]) return 0;

    //const isExistInBlockChain = drizzleState.contracts.DocumentReg.contains[this.state.isExistDataKey].value
    //console.log("getTotalBalance", ethAccount, v);
    return this.toWei(drizzleState.contracts.Deck.balanceOf[dataKey].value);
  };

  requestPageView = (documentId) => {
    const drizzleState = this.drizzle.store.getState();
    const ethAccount = drizzleState.accounts[0];
    const contract = this.drizzle.contracts.DocumentReg;
    const curDate = this.getBlockchainTimestamp(new Date());
    const dataKey = contract.methods.getPageView.cacheCall(this.fromAscii(documentId), curDate, {
      from: ethAccount
    });

    return dataKey;
  };

  getPageView = (dateKey) => {
    const drizzleState = this.drizzle.store.getState();
    const ethAccount = drizzleState.accounts[0];
    const contract = this.drizzle.contracts.DocumentReg;

    const curDate = this.getBlockchainTimestamp(new Date());
    const v = contract.methods.getPageView[dateKey].value

    return v;
  };

  requestTotalPageView = (dataKey) => {
    const drizzleState = this.drizzle.store.getState();
    const ethAccount = drizzleState.accounts[0];
    const contract = this.drizzle.contracts.DocumentReg;

    const v = contract.methods.calculateAuthorReward[dataKey].value;

    return v;
  };

  requestAuthorReward = (pageView, totalPageView) => {
    const drizzleState = this.drizzle.store.getState();
    const ethAccount = drizzleState.accounts[0];
    const contract = this.drizzle.contracts.DocumentReg;

    const dataKey = contract.methods.calculateAuthorReward.cacheCall(pageView, totalPageView, {
      from: ethAccount
    });

    return dataKey;
  };

  getAuthorReward = (dataKey) => {
    const drizzleState = this.drizzle.store.getState();
    const ethAccount = drizzleState.accounts[0];
    const contract = this.drizzle.contracts.DocumentReg;
    const v = contract.methods.balanceOf[dataKey];

    console.log("getTotalBalance", ethAccount, v);
    return v;
  };

  getBlockchainTimestamp = (date) => {
    // daily YYYY-MM-DD 00:00:00(실행기준에서 전날 일자)
    //let yesterday = new Date(); /* 현재 */
    //yesterday.setDate(yesterday.getDate() - 1);

    /* 날짜 - 1일 */

    const d = Math.floor(date / (60 * 60 *24 * 1000)) * (60 * 60 *24 * 1000);
    //console.log("getBlockchainTimestamp", d, new Date(d));
    return d;
  }

}
