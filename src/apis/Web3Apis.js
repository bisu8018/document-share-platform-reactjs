import Web3 from "web3";
import Creator from "./contracts-alpha/Creator.json";
import DocumentRegistry from "./contracts-alpha/DocumentRegistry.json";
import Deck from "./contracts-alpha/Deck.json";
import RewardPool from "./contracts-alpha/RewardPool.json";
import Curator from "./contracts-alpha/Curator.json";
import BountyOne from "./contracts-alpha/BountyOne.json";
import Common from "../util/Common";

let defaultAccountId = "0x7069Ba7ec699e5446cc27058DeF50dE2224796AE";
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/43132d938aaa4d96a453fd1c708b7f6c"));


export default class Web3Apis {

  constructor() {
    this.network = "4";

    this.Creator = new web3.eth.Contract(Creator.abi, Creator.networks[this.network].address, {
      from: defaultAccountId
    });

    this.DocumentRegistry = new web3.eth.Contract(DocumentRegistry.abi, DocumentRegistry.networks[this.network].address, {
      from: defaultAccountId
    });

    this.Deck = new web3.eth.Contract(Deck.abi, Deck.networks[this.network].address, {
      from: defaultAccountId
    });

    this.RewardPool = new web3.eth.Contract(RewardPool.abi, RewardPool.networks[this.network].address, {
      from: defaultAccountId
    });

    this.Curator = new web3.eth.Contract(Curator.abi, Curator.networks[this.network].address, {
      from: defaultAccountId
    });

    this.BountyOne = new web3.eth.Contract(BountyOne.abi, BountyOne.networks[this.network].address, {
      from: defaultAccountId
    });
  };

  //bytes32로 변환
  asciiToHex = (val: string) => {
    //deprecated fromAscii
    return web3.utils.asciiToHex(val);
  };

  // wei => eth 변환
  fromWei = (str) => {
    return web3.utils.fromWei(str, "ether");
  };

  // MM계정 인증
  getApproved = (address) => {
    return this.Deck.methods.allowance(address, Deck.networks[this.network].address).call({
      from: address
    });
  };

  // N일 동안 보상액 GET
  getNDaysRewards = (documentId: string, days: number) => {
    this.Creator.methods.recentEarnings(this.asciiToHex(documentId), days).call()
      .then(res => {
        return res;
      }).catch(e => {
      console.error(e);
      return Promise.reject(e);
    });
  };

  // Profile 페이지, Author N일 총 보상액 GET
  getAuthorTotalRewards = (documentList: [], days: number, callback) => {
    if (documentList.length > 0) {
      let totalRewards = 0;
      let getReward = (i) => {
        this.Creator.methods.recentEarnings(this.asciiToHex(documentList[i].documentId), days).call().then(res => {
          totalRewards += res || 0;
          if (i === documentList.length - 1) callback(totalRewards);
        }).catch(e => {
          console.error(e);
          return Promise.reject(e);
        });
      };
      for (let i = 0; i < documentList.length; ++i) {
        getReward(i);
      }
    }
  };

  // Profile 페이지, Curator N일 총 보상액 GET
  getCuratorTotalRewards = (documentList: [], days: number, callback) => {
    if (documentList.length > 0) {
      let totalRewards = 0;
      let getReward = (i) => {
        this.Curator.methods.recentEarnings(defaultAccountId, this.asciiToHex(documentList[i].documentId), days).call({ from: defaultAccountId }).then(res => {
          totalRewards += res || 0;
          if (i === documentList.length - 1) callback(totalRewards);
        }).catch(e => {
          console.error(e);
          return Promise.reject(e);
        });
      };

      for (let i = 0; i < documentList.length; ++i) {
        getReward(i);
      }
    }
  };

  //특정 유져 잔액 조회
  getBalance = (address: string, callback) => {
    this.Deck.methods.balanceOf(address).call({ from: address })
      .then(res => {
        callback(Common.toDeck(res));
      }).catch(e => {
      console.error(e);
      return Promise.reject(e);
    });
  };

  //Author Reward pool GET
  // percent : 70%   (2019-04-17)
  getAuthorDailyRewardPool(callback) {
    let CreatorPercent = 70;
    let createTime = Date.now();
    this.RewardPool.methods.getDailyRewardPool(CreatorPercent, createTime).call().then(res => {
      callback(res || 0);
    }).catch(e => {
      console.error(e);
      return Promise.reject(e);
    });
  };

  //Curator Reward pool GET
  //Reward pool GET
  // percent : 30%   (2019-04-17)
  getCuratorDailyRewardPool(callback) {
    let CuratorPercent = 30;
    let createTime = Date.now();
    this.RewardPool.methods.getDailyRewardPool(CuratorPercent, createTime).call().then(res => {
      callback(res || 0);
    }).catch(e => {
      console.error(e);
      return Promise.reject(e);
    });
  };

  // 문서 블록체인 등록 여부 확인
  isDocumentExist = (documentId: string, callback) => {
    this.DocumentRegistry.methods.contains(this.asciiToHex(documentId)).call()
      .then(res => {
        callback(res);
      }).catch(e => {
      console.error(e);
      return Promise.reject(e);
    });
  };
  //Bounty 가능량 GET
  getBountyAvailable = (address: string) => {
    return this.BountyOne.methods.available().call({
      from: address
    });
  };

  //확정된 Author 리워드 GET
  getDetermineAuthorReward = (address: string, documentId: string) => {
    if (!documentId) {
      throw new Error("documentId is invaild!!!", documentId);
    }
    return this.Creator.methods.determine(this.asciiToHex(documentId)).call({ from: address });
  };

  //확정된 Curator 리워드 GET
  getDetermineCuratorReward = (documentId: string, curatorId: string) => {
    return this.Curator.methods.determine(this.asciiToHex(documentId)).call({ from: curatorId });
  };

  //특정 문서의 유효한 유져 투표 수 GET
  getUserActiveVotes = (address: string, documentId: string) => {
    return this.Curator.methods.getUserActiveVotes(address, this.asciiToHex(documentId)).call();
  };

  //특정 문서의 유효한 모든 투표 수 GET
  getActiveVotes = (documentId: string) => {
    return this.Curator.methods.getActiveVotes(this.asciiToHex(documentId)).call();
  };


}