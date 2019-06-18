import Web3 from "web3";

/*알파용 컨트랙*/
/*import DocumentRegistry from "apis/contracts-alpha/DocumentRegistry.json";
import Deck from "apis/contracts-alpha/Deck.json";
import BountyOne from "apis/contracts-alpha/BountyOne.json";
import Curator from "apis/contracts-alpha/Curator.json";
import Creator from "apis/contracts-alpha/Creator.json";
import RewardPool from "apis/contracts-alpha/RewardPool.json";*/

/*개발계용 컨트랙*/
import DocumentRegistry from "apis/contracts-dev/DocumentRegistry.json";
import Deck from "apis/contracts-dev/Deck.json";
import BountyOne from "apis/contracts-dev/BountyOne.json";
import Curator from "apis/contracts-dev/Curator.json";
import Creator from "apis/contracts-dev/Creator.json";
import RewardPool from "apis/contracts-dev/RewardPool.json";

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

  // metamask 계정 인증
  getApproved = (address) => {
    return this.Deck.methods.allowance(address, Deck.networks[this.network].address).call({
      from: address
    });
  };

  // N일 동안 보상액 GET
  getNDaysRewards = (documentId: string, days: number) => {
    return new Promise((resolve, reject) => {
      this.Creator.methods.recentEarnings(this.asciiToHex(documentId), days).call()
        .then(res => {
          resolve(res || 0);
        }).catch(e => {
        console.error(e);
        reject(e);
      });
    });
  };

  // Profile 페이지, Author N일 총 보상액 GET
  getAuthorTotalRewards = (documentList: [], days: number) => {
    return new Promise((resolve, reject) => {
      if (documentList.length > 0) {
        let getReward = (i) => {
          this.Creator.methods.recentEarnings(this.asciiToHex(documentList[i].documentId), days).call().then(res => {
            if (i === documentList.length - 1) resolve(res);
          }).catch(e => {
            reject(e);
          });
        };
        for (let i = 0; i < documentList.length; ++i) {
          getReward(i);
        }
      }
    });
  };

  // Profile 페이지, Curator N일 총 보상액 GET
  getCuratorTotalRewards = (documentList: [], days: number, callback, error) => {
    if (documentList.length > 0) {
      let totalRewards = 0;
      let getReward = (i) => {
        this.Curator.methods.recentEarnings(defaultAccountId, this.asciiToHex(documentList[i].documentId), days).call({ from: defaultAccountId }).then(res => {
          totalRewards += res || 0;
          if (i === documentList.length - 1) callback(totalRewards);
        }).catch(e => {
          return error(e);
        });
      };

      for (let i = 0; i < documentList.length; ++i) {
        getReward(i);
      }
    }
  };

  //특정 유져 잔액 조회
  getBalance = (address: string, callback, error) => {
    this.Deck.methods.balanceOf(address).call({ from: address })
      .then(res => {
        callback(res);
      }).catch(e => {
      return error(e);
    });
  };

  //Author Reward pool GET
  // percent : 70%   (2019-04-17)
  getCreatorDailyRewardPool(callback, error) {
    let CreatorPercent = 70;
    let createTime = Date.now();

    this.RewardPool.methods.getDailyRewardPool(CreatorPercent, createTime).call().then(res => {
      callback(res);
    }).catch(e => {
      return error(e);
    });
  };

  //Curator Reward pool GET
  //Reward pool GET
  // percent : 30%   (2019-04-17)
  getCuratorDailyRewardPool(callback, error) {
    let CuratorPercent = 30;
    let createTime = Date.now();
    this.RewardPool.methods.getDailyRewardPool(CuratorPercent, createTime).call().then(res => {
      callback(res || 0);
    }).catch(e => {
      return error(e);
    });
  };

  // 문서 블록체인 등록 여부 확인
  isDocumentExist = (documentId: string, callback, error) => {
    this.DocumentRegistry.methods.contains(this.asciiToHex(documentId)).call()
      .then(res => {
        callback(res);
      }).catch(e => {
      return error(e);
    });
  };
  //Bounty 가능량 GET
  getBountyAvailable = (address: string) => {
    return this.BountyOne.methods.available().call({
      from: address
    });
  };

  //확정된 Creator 리워드 GET
  getDetermineCreatorReward = (documentId: string, address: string) => {
    return new Promise((resolve, reject) => {
      this.Creator.methods.determine(this.asciiToHex(documentId)).call({ from: address }).then(res => {
        resolve(res);
      });
    });
  };

  //확정된 Curator 리워드 GET
  getDetermineCuratorReward = (documentId: string, curatorId: string) => {
    return new Promise((resolve, reject) => {
      this.Curator.methods.determine(this.asciiToHex(documentId)).call({ from: curatorId }).then(res => {
        resolve(res);
      });
    });
  };

  //특정 문서의 유효한 유져 투표 수 GET
  getUserActiveVotes = (address: string, documentId: string) => {
    return this.Curator.methods.getUserActiveVotes(address, this.asciiToHex(documentId)).call();
  };

  //특정 문서의 유효한 모든 투표 수 GET
  getActiveVotes = (documentId: string) => {
    return this.Curator.methods.getActiveVotes(this.asciiToHex(documentId)).call();
  };

  //투표 전, Allowance 값 GET
  getAllowance = (address: string) => {
    return new Promise((resolve, reject) => {
      this.Deck.methods.allowance(address, this.RewardPool.address).call({ from: address }).then(res => {
        resolve(res);
      });
    });
  };

  // 큐레이터 문서 GET
  getCuratorDocuments = (address: string) => {
    return new Promise((resolve, reject) => {
      this.Curator.methods.getDocuments(address).call().then(res => {
        resolve(res);
      });
    });
  };

}