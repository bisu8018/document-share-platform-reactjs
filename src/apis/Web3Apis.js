import {BigNumber} from 'bignumber.js';
import Web3 from 'web3';
import DocumentReg from 'apis/contracts-rinkeby/DocumentReg.json';
import Deck from 'apis/contracts-rinkeby/Deck.json';
import Bounty from 'apis/contracts-rinkeby/BountyOne.json';
const defaultAccountId = "0x7069Ba7ec699e5446cc27058DeF50dE2224796AE";

const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/43132d938aaa4d96a453fd1c708b7f6c"));

export default class Web3Apis {

  constructor(){
    
    this.network = "4";
    this.DocumentReg = new web3.eth.Contract(DocumentReg.abi, DocumentReg.networks[this.network].address, {
      from: defaultAccountId
    });

    this.Deck = new web3.eth.Contract(Deck.abi, Deck.networks[this.network].address, {
      from: defaultAccountId
    });

    this.Bounty = new web3.eth.Contract(Bounty.abi, Bounty.networks[this.network].address, {
      from: defaultAccountId
    });
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
  asciiToHex = (str) => {
    //deprecated fromAscii
    return web3.utils.asciiToHex(str);
  }

  fromWei = (str) => {

    return web3.utils.fromWei(str, "ether");
  }

  toDollar = (deck) => {

    const c = 0.005;


    const d = new BigNumber("1e+18")
    const bn = new BigNumber(deck);
    const dollar = bn.dividedBy(d).multipliedBy(c);
    const result = Math.round(dollar.toNumber() * 100) / 100;
    //120,000,000,000,000,000,000
    //console.log("toDollar", str, bn, dollar, result);

    return result;
  }

  toDeck = (smalldeck) => {
    //console.log(smalldeck);

    const d = new BigNumber("1e+18")
    const bn = new BigNumber(smalldeck);
    const deck = bn.dividedBy(d);
    const result = Math.round(deck.toNumber() * 100) / 100;
    //120,000,000,000,000,000,000
    //console.log("toDeck", bn, deck, deck.toNumber(), result);

    return result;
  }

  getBountyAvailable = (address) => {

    return this.Bounty.methods.available().call({
      from: address
    });

  };

  getApproved = (address) => {

    return this.Deck.methods.allowance(address, Deck.networks[this.network].address).call({
      from: address
    });

  };

  getBalance = (address) => {
    try{
      return this.Deck.methods.balanceOf(address).call({
        from: address
      });
    } catch(e){
      console.error(e);
      return Promise.reject(e);
    }
    

  };

  getCalculateAuthorReward = (address, viewCount, totalViewCount) => {

    return this.DocumentReg.methods.calculateAuthorReward(viewCount, totalViewCount).call({
      from: address
    });

  };

  getAuthor3DayRewardOnDocument = (accountId, documentId) => {
    //contract getAuthor3DayRewardOnDocument

    //console.log(accountId, documentId);
    const today = new Date();
    //const yesterday = today.setDate(today.getDate() - 1);

    const blockchainTimestamp = this.getBlockchainTimestamp(today);
    //return DocumentReg.methods.getCuratorDepositOnDocument(this.asciiToHex(documentId), blockchainTimestamp).call({from: myAddress});
    const promise = this.DocumentReg.methods.getAuthor3DayRewardOnDocument(accountId, this.asciiToHex(documentId), blockchainTimestamp).call({
      from: defaultAccountId
    });

    return promise;
  }

  calculateCuratorReward = (curatorId, documentId, viewCount, totalViewCount) => {
    //contract calculateCuratorReward(address _addr, bytes32 _docId, uint _pv, uint _tpvs)

    //console.log("calculateCuratorReward", curatorId, documentId, viewCount, totalViewCount);

    return this.DocumentReg.methods.calculateCuratorReward(curatorId, this.asciiToHex(documentId), viewCount, totalViewCount).call({
      from: curatorId
    });

  }

  getCuratorDepositOnDocument = (curatorId, documentId) => {
    //function getCuratorDepositOnDocument(bytes32 _docId, uint _dateMillis) public view returns (uint)
    const today = new Date();

    const blockchainTimestamp = this.getBlockchainTimestamp(today);
    //console.log("getCuratorDepositOnDocument", curatorId, documentId, blockchainTimestamp);
    return this.DocumentReg.methods.getCuratorDepositOnDocument(this.asciiToHex(documentId), blockchainTimestamp).call({from: curatorId});
  };

  getCuratorDepositOnUserDocument = (curatorId, documentId) => {
    //function getCuratorDepositOnUserDocument(address, bytes32 _docId, uint _dateMillis) public view returns (uint)
    const today = new Date();

    const blockchainTimestamp = this.getBlockchainTimestamp(today);
    //console.log("getCuratorDepositOnUserDocument", curatorId, documentId, blockchainTimestamp);
    return this.DocumentReg.methods.getCuratorDepositOnUserDocument(curatorId, this.asciiToHex(documentId), blockchainTimestamp).call({from: curatorId});
  };


  getDetermineAuthorReward = (authorAddress, documentId) => {

    //console.log("determineAuthorToken", documentId, authorAddress);
    if(!documentId){
      throw new Error("documentId is invaild!!!", documentId);
    }

    return this.DocumentReg.methods.determineAuthorReward(authorAddress, this.asciiToHex(documentId)).call({from: authorAddress});
  };

  getDetermineCuratorReward = (documentId, curatorId) => {
    //function determineCuratorReward(bytes32 _docId) public view returns (uint)

    return this.DocumentReg.methods.determineCuratorReward(this.asciiToHex(documentId)).call({from: curatorId});
  }

  getCurator3DayRewardOnUserDocument = (curator, documentId, blockchainTimestamp) => {
      //function getCurator3DayRewardOnUserDocument(address _addr, bytes32 _docId, uint _dateMillis) public view returns (uint)
      if(!curator){
        throw new Error("curator is invaild!!!", curator);
      }
      if(!documentId){
        throw new Error("documentId is invaild!!!", documentId);
      }
      return this.DocumentReg.methods.getCurator3DayRewardOnUserDocument(curator, this.asciiToHex(documentId), blockchainTimestamp).call({from: curator});
  }

}
