import {BigNumber} from 'bignumber.js';
import Web3 from 'web3';
import DocumentRegJsonString from '../contracts-rinkeby/DocumentReg.json';
const defaultAccountId = "0x7069Ba7ec699e5446cc27058DeF50dE2224796AE";

const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/43132d938aaa4d96a453fd1c708b7f6c"));
const jsonFile = "../contracts-rinkeby/DocumentReg.json";
//const parsed= fs.readFileSync(jsonFile);
/*
const abis = parsed.abi;

//contract abi is the array that you can get from the ethereum wallet or etherscan
const contractABI = abis;
const contractAddress = parsed.networks["4"].address;//"0xf84cffd9aab0c98ea4df989193a0419dfa00b07e";
//creating contract object
const DocumentReg = new web3.eth.Contract(abis, contractAddress, {
  from: defaultAccountId
});
*/
export default class Web3Apis {

  constructor(){
    this.abis = DocumentRegJsonString.abi;
    this.address = DocumentRegJsonString.networks["4"].address;
    this.DocumentReg = new web3.eth.Contract(this.abis, this.address, {
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

    if(isNaN(deck)) {
      return 0;
    }

    const c = 0.005;


    const d = new BigNumber("1e+18")
    const bn = new BigNumber(deck);
    const dollar = bn.dividedBy(d).multipliedBy(c);
    const result = Math.round(dollar.toNumber() * 100) / 100;
    //120,000,000,000,000,000,000
    //console.log("toDollar", str, bn, dollar, result);

    return result;
  }



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
    //contract calculateCuratorReward

    console.log(curatorId, documentId, viewCount, totalViewCount);

    const promise = this.DocumentReg.methods.calculateCuratorReward(curatorId, this.asciiToHex(documentId), viewCount, totalViewCount).call({
      from: defaultAccountId
    });

    return promise;
  }

  getCuratorDepositOnDocument = (curatorId, documentId) => {
    //function getCuratorDepositOnDocument(bytes32 _docId, uint _dateMillis) public view returns (uint)
    const today = new Date();

    const blockchainTimestamp = this.getBlockchainTimestamp(today);
    console.log("getCuratorDepositOnDocument", curatorId, documentId, blockchainTimestamp);
    return this.DocumentReg.methods.getCuratorDepositOnDocument(this.asciiToHex(documentId), blockchainTimestamp).call({from: curatorId});
  };
}
