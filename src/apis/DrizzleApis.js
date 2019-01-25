// import drizzle functions and contract artifact
import { Drizzle, generateStore } from "drizzle";
import DocumentReg from "contracts-rinkeby/DocumentReg.json";
import Deck from "contracts-rinkeby/Deck.json";
import BountyOne from "contracts-rinkeby/BountyOne.json";

import {BigNumber} from 'bignumber.js';
// import drizzle functions and contract artifact

const defaultAccountId = "0x7069Ba7ec699e5446cc27058DeF50dE2224796AE";
export default class DrizzleApis {

  callbackFuncs = [];

  // let drizzle know what contracts we want
  // let drizzle know what contracts we want
  options = { contracts: [DocumentReg, Deck, BountyOne] };
  // setup the drizzle store and drizzle
  drizzleStore = generateStore(this.options);

  constructor(callback) {
    try{
      this.drizzle = new Drizzle(this.options, this.drizzleStore);

      this.unsubscribe = this.drizzle.store.subscribe(() => {

        // every time the store updates, grab the state from drizzle
        this.drizzleState = this.drizzle.store.getState();
        //console.log("DrizzleApis subscribe", this.drizzleState);
        // check to see if it's ready, if so, update local component state
        if(callback) callback(this, this.drizzle, this.drizzleState);
  
        if (this.drizzleState.drizzleStatus.initialized) {
          //console.log("DrizzleApis", "drizzleStatus initialized", this.drizzleState);
          //this.setState({ loading: false, this.drizzleState });
  
          for(const idx in this.callbackFuncs){
            const callbackFunc = this.callbackFuncs[idx];
            if(callbackFunc){
              callbackFunc(this.drizzle, this.drizzleState);
            }
          }
        }
  
      });
    } catch(e){
      console.error("DrizzleApis initialize fail", e);
    }
    

  }

  isInitialized = () => {
    if(!this.drizzleState) return;

    return this.drizzleState.drizzleStatus.initialized;
  }

  isAuthenticated = () => {

    if(!this.drizzle) return;

    //console.log(this.drizzleState);

    if(!this.drizzleState) return;

    if(this.drizzleState.accounts && this.drizzleState.accounts[0]) return this.isInitialized() && true;

    return false;
  }

  getLoggedInAccount = () => {
    if(!this.isAuthenticated()) return;

    return this.drizzleState.accounts[0];
  }

  getReaderAccount = () => {
    if(this.isAuthenticated()) return this.getLoggedInAccount();

    return defaultAccountId;
  }

  fromAscii = (str) => {
    return this.drizzle.web3.utils.fromAscii(str);
  }

  fromWei = (str) => {

    return this.drizzle.web3.utils.fromWei(str, "ether");
  }

  toDollar = (str) => {

    if(isNaN(str)){
      return 0;
    }
    //console.log("toDollar", this.drizzle.web3.utils);
    //const c = this.drizzle.web3.utils.toWei(0.005);
    const c = 0.005;
    //const t =  this.drizzle.web3.utils.toWei(c, "ether");

    //const ether= this.drizzle.web3.utils.fromWei(str, "ether");

    const d = new BigNumber("1e+18")
    const bn = new BigNumber(str);
    const dollar = bn.dividedBy(d).multipliedBy(c);
    const result = Math.round(dollar.toNumber() * 100) / 100;
    //120,000,000,000,000,000,000
    //console.log("toDollar", str, bn, dollar, result);

    //return this.drizzle.web3.utils.fromWei(bn, "ether");
    return result;
  }

  deckToDollar = (str) => {

    if(isNaN(str)){
      return 0;
    }

    const c = 0.005;
    const bn = new BigNumber(str);
    const dollar = bn.multipliedBy(c);
    const result = Math.round(dollar.toNumber() * 100) / 100;

    return result;
  }

  toEther = (str) => {

    const d = new BigNumber("1e+18")
    const bn = new BigNumber(str);
    const ether = bn.dividedBy(d);
    const result = Math.round(ether.toNumber() * 100) / 100;

    return result;
  }

  toNumber = (number) => {
    return isNaN(parseInt(number, 10)) ? 0 : parseInt(number, 10);
  }


  toBigNumber = (str) => {
    const v = this.drizzle.web3.utils.toWei(str, 'ether');
    //console.log(str, "to bignumber ", v);
    return v;
  }

  requestIsExistDocument = (documentId) => {

    if(!this.isInitialized()){
      console.error("Metamask doesn't initialized");
      return;
    }

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }

    const ethAccount = this.drizzleState.accounts[0]

    const contract = this.drizzle.contracts.DocumentReg;

    const dataKey = contract.methods["contains"].cacheCall(this.fromAscii(documentId), {
      from: ethAccount
    });
    console.log(dataKey);
    return dataKey;

  }

  isExistDocument = (dataKey) => {

    if(!this.isInitialized()){
      console.error("Metamask doesn't initialized");
      return;
    }

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }

    if(this.drizzleState.contracts.DocumentReg.contains[dataKey]){
      const isExistInBlockChain = this.drizzleState.contracts.DocumentReg.contains[dataKey].value
      //this.setState({isExistInBlockChain});
      return isExistInBlockChain;
//      this.setState({isExistInBlockChain: isExistDocument});
    }
    return false;
  }

  bounty = () => {

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }

    const ethAccount = this.drizzleState.accounts[0];

    const BountyOne = this.drizzle.contracts.BountyOne;
    console.log(this.drizzle.contracts);
    console.log(BountyOne);
    if(!BountyOne){
      console.error("Bounty Contract is invaild");
      return;
    }


    const stackId = BountyOne.methods["claim"].cacheSend({
      from: ethAccount
    });

    console.log("bounty stackId", stackId);
    return stackId;
  };


  approve = (deposit) => {


    if(!this.isInitialized()){
      console.error("Metamask doesn't initialized");
      return;
    }

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }

    if(deposit<=0){
      console.log("Deposit must be greater than zero.");
      return;
    }

    const ethAccount = this.drizzleState.accounts[0];

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

  voteOnDocument = (documentId, deposit) => {

    if(!this.isInitialized()){
      console.error("Metamask doesn't initialized");
      return;
    }

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }


    if(!documentId){
      alert("documentId is nothing");
      return;
    }

    if(deposit<=0){
      alert("Deposit must be greater than zero.");
      return;
    }

    const ethAccount = this.drizzleState.accounts[0];

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

  registDocumentToSmartContract = (documentId) => {
    console.log(documentId, this.drizzle);
    if(!documentId){
      alert("documentId is nothing");
      return;
    }

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }

    const drizzleState = this.drizzle.store.getState();
    console.log("drizzleState", drizzleState);
    const ethAccount = drizzleState.accounts[0];
    const contract = this.drizzle.contracts.DocumentReg;
    const stackId = contract.methods["register"].cacheSend(this.fromAscii(documentId), {
      from: ethAccount
    });
    console.log("registSmartContractAddress stackId", stackId);
    // save the `stackId` for later reference

    return stackId;
  };

  claimAuthorReward = (documentId) => {
    //function claimAuthorReward(bytes32 _docId) public

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }

    const ethAccount = this.drizzleState.accounts[0];
    const contract = this.drizzle.contracts.DocumentReg;
    console.log("claimAuthorReward", ethAccount, "Profile account", documentId, this.fromAscii(documentId));
    const stackId = contract.methods.claimAuthorReward.cacheSend(this.fromAscii(documentId), {
      from: ethAccount
    });

    return stackId;

  }

  claimCuratorReward = (documentId) => {
    //function claimCuratorReward(bytes32 _docId) public

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }

    const ethAccount = this.drizzleState.accounts[0];
    const contract = this.drizzle.contracts.DocumentReg;
    console.log("claimCuratorReward", ethAccount, "Profile account", documentId, this.fromAscii(documentId));
    const stackId = contract.methods.claimCuratorReward.cacheSend(this.fromAscii(documentId), {
      from: ethAccount
    });

    return stackId;

  }


  requestTotalBalance = (accountId) => {


    if(!this.isInitialized()){
      console.error("Metamask doesn't initialized");
      return;
    }

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }
    const ethAccount = this.drizzleState.accounts[0];
    const contract = this.drizzle.contracts.Deck;
    console.log("Metamask logged in account", ethAccount, "Profile account", accountId);
    const dataKey = contract.methods.balanceOf.cacheCall(accountId, {
      from: ethAccount
    });

    return dataKey;
  };

  getTotalBalance = (dataKey) => {
    if(!dataKey) return 0;
    const drizzleState = this.drizzle.store.getState();
    const ethAccount = drizzleState.accounts[0];
    const contract = this.drizzle.contracts.Deck;

    if(!this.isInitialized()){
      console.error("Metamask doesn't initialized");
      return;
    }

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }

    //console.log("getTotalBalance", drizzleState.contracts.Deck.balanceOf[dataKey]);

    if(!drizzleState.contracts.Deck.balanceOf[dataKey]) return 0;

    //const isExistInBlockChain = drizzleState.contracts.DocumentReg.contains[this.state.isExistDataKey].value
    //console.log("getTotalBalance", ethAccount, v);
    return this.fromWei(drizzleState.contracts.Deck.balanceOf[dataKey].value);
  };

  requestCalculateAuthorReward = (pageView, totalPageView) => {

    if(!this.isInitialized()){
      console.error("Metamask doesn't initialized");
      return;
    }

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }

    const ethAccount = this.drizzleState.accounts[0];
    const contract = this.drizzle.contracts.DocumentReg;

    const dataKey = contract.methods.calculateAuthorReward.cacheCall(pageView, totalPageView, {
      from: ethAccount
    });

    return dataKey;
  };

  getCalculateAuthorReward = (dataKey) => {

    if(!this.isInitialized()){
      console.error("Metamask doesn't initialized");
      return;
    }

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }

    if(!dataKey) return;

    const ethAccount = this.drizzleState.accounts[0];
    const contract = this.drizzle.contracts.DocumentReg;

    const v = this.drizzleState.contracts.DocumentReg.calculateAuthorReward[dataKey];

    if(!v) return ;
    //console.log("getCalculateAuthorReward", v);

    return v.value;
  };

  requestCalculateCuratorReward = (addr, docId, pageView, totalPageViewSquare) => {

    if(!this.isInitialized()){
      console.error("Metamask doesn't initialized");
      return;
    }

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }

    const ethAccount = this.drizzleState.accounts[0];
    const contract = this.drizzle.contracts.DocumentReg;

    const dataKey = contract.methods.calculateCuratorReward.cacheCall(addr, docId, pageView, totalPageViewSquare, {
      from: ethAccount
    });

    return dataKey;
  };

  getCalculateCuratorReward = (dataKey) => {

    if(!this.isInitialized()){
      console.error("Metamask doesn't initialized");
      return;
    }

    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }

    if(!dataKey) return;

    const ethAccount = this.drizzleState.accounts[0];
    const contract = this.drizzle.contracts.DocumentReg;

    const v = this.drizzleState.contracts.DocumentReg.calculateCuratorReward[dataKey];

    if(!v) return ;
    //console.log("getCalculateAuthorReward", v);

    return v.value;
  };

  requestAuthor3DayRewardOnDocument = (accountId, documentId) => {
    //contract getAuthor3DayRewardOnDocument

    if(!this.isInitialized()){
      console.error("Metamask doesn't initialized");
      return;
    }
/*
    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }
*/

    const ethAccount = this.getReaderAccount();//his.drizzleState.accounts[0];
    const contract = this.drizzle.contracts.DocumentReg;
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const blockchainTimestamp = this.getBlockchainTimestamp(yesterday);

    const dataKey = contract.methods.getAuthor3DayRewardOnDocument.cacheCall(accountId, this.fromAscii(documentId), blockchainTimestamp, {
      from: ethAccount
    });

    return dataKey;
  }

  getAuthor3DayRewardOnDocument = (dataKey) => {
    //contract getAuthor3DayRewardOnDocument
    if(!this.isInitialized()){
      console.error("Metamask doesn't initialized");
      return;
    }
/*
    if(!this.isAuthenticated()){
      console.error("The Metamask login is required.")
      return;
    }
*/
    if(!dataKey) return 0;
    const drizzleState = this.drizzle.store.getState();
    const ethAccount = this.getReaderAccount();//this.drizzleState.accounts[0];


    const v = this.drizzleState.contracts.DocumentReg.getAuthor3DayRewardOnDocument[dataKey];

    if(!v) return ;
    //console.log("getAuthor3DayRewardOnDocument", v);

    return v.value;
    //return v.value;
  }

  subscribe = (callback) => {
    this.callbackFuncs.push(callback);
    return callback;
  }

  unsubscribe = (callback) => {
    if(this.callbackFuncs.includes(callback)) {
      this.callbackFuncs.remove(callback);
    }
  }

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
