import { Drizzle, generateStore } from "drizzle";
import { store } from "../index";
import MainRepository from "../redux/MainRepository";
import { setAction } from "../redux/reducer/main";

let DocumentRegistry, Deck, BountyOne, Curator, Creator, RewardPool;

if (process.env.NODE_ENV_SUB === "production") {
  /*알파용 컨트랙*/
  DocumentRegistry = require("apis/contracts-alpha/DocumentRegistry.json");
  Deck = require("apis/contracts-alpha/Deck.json");
  BountyOne = require("apis/contracts-alpha/BountyOne.json");
  Curator = require("apis/contracts-alpha/Curator.json");
  Creator = require("apis/contracts-alpha/Creator.json");
  RewardPool = require("apis/contracts-alpha/RewardPool.json");
} else {
  /*개발계용 컨트랙*/
  DocumentRegistry = require("apis/contracts-dev/DocumentRegistry.json");
  Deck = require("apis/contracts-dev/Deck.json");
  BountyOne = require("apis/contracts-dev/BountyOne.json");
  Curator = require("apis/contracts-dev/Curator.json");
  Creator = require("apis/contracts-dev/Creator.json");
  RewardPool = require("apis/contracts-dev/RewardPool.json");
}


const defaultAccountId = "0x7069Ba7ec699e5446cc27058DeF50dE2224796AE";


export default class DrizzleApis {
  options = {
    contracts: [DocumentRegistry, Deck, BountyOne, Curator, Creator, RewardPool],  // 드리즐 컨트랙 설정,
    polls: {
      accounts: 10000
    }
  };
  drizzleStore = generateStore(this.options);   // 드리즐 스토어 셋팅

  constructor() {
    try {
      this.drizzle = new Drizzle(this.options, this.drizzleStore);
      this.unsubscribe = this.drizzle.store.subscribe(() => {
        this.drizzleState = this.drizzle.store.getState();    // 스토어 업데이트 시, 드리즐 state 가져옴

        let myInfo = store.getState().main.myInfo;    // redux store GET
        let ethAccount = this.drizzleState.accounts[0];

        /*console.log("drizzleState",this.drizzleState);
        console.log("store",store);
        console.log("myInfo", myInfo);*/

        if (this.drizzleState.web3.networkId && this.drizzleState.web3.networkId !== 4)
          store.dispatch(setAction.alertCode(2052));

        // Alert Show
        if (this.drizzleState.drizzleStatus.initialized && MainRepository.Account.isAuthenticated() && myInfo.email.length > 0) {    //myInfo - drizzle 이더리움 계정 비교

          if (!myInfo.ethAccount) {   // myInfo에 이더리움 계정 없을때
            MainRepository.Account.syncEthereum(ethAccount, () => {
              myInfo.ethAccount = ethAccount;   // ethAccont 업데이트
              store.dispatch(setAction.myInfo(myInfo));  // redux data SET
            });
          } else if (myInfo.ethAccount && myInfo.ethAccount !== ethAccount) {   // myInfo - drizzle 이더리움 계정 다를때
            /*console.log("1",myInfo.ethAccount);
            console.log("2",ethAccount);*/
            store.dispatch(setAction.alertCode(2051));  // Alert Show
          }
        }
      });
    } catch (e) {
      console.error("DrizzleApis initialize fail", e);
    }
  }

  //드리즐 초기화 체크
  isInitialized = () => {
    if (!this.drizzleState) return false;
    return this.drizzleState.drizzleStatus.initialized;
  };

  //드리즐 로그인 체크
  isAuthenticated = () => {
    if (!this.drizzle) return false;
    if (!this.drizzleState) return false;
    if (this.drizzleState.accounts && this.drizzleState.accounts[0]) return this.isInitialized() && true;
    return true;
  };

  //로그인된 계정 정보 GET
  getLoggedInAccount = () => {
    if (!this.isAuthenticated()) return false;
    return this.drizzleState.accounts[0];
  };

  //계정 정보 GET
  getReaderAccount = () => {
    if (this.isAuthenticated()) return this.getLoggedInAccount();
    return defaultAccountId;
  };


  fromAscii = (str: string) => {
    return this.drizzle.web3.utils.fromAscii(str);
  };

  // wei => eth 변환
  fromWei = (str: string) => {
    return this.drizzle.web3.utils.fromWei(str, "ether");
  };

  toBigNumber = (str: string) => {
    return this.drizzle.web3.utils.toWei(str, "ether");
  };

  // 바운티 stackId 반환
  bounty = () => {
    if (!this.isAuthenticated()) return;
    const ethAccount = this.drizzleState.accounts[0];
    const BountyOne = this.drizzle.contracts.BountyOne;
    if (!BountyOne) {
      console.error("Bounty Contract is invalid");
      return;
    }
    return BountyOne.methods["claim"].cacheSend({
      from: ethAccount
    });
  };

  //트랜잭션 상태값 수신
  getTransactionStatus = (stackId) => {
    return new Promise((resolve, reject) => {
      let status, transactions, transactionStack;
      // 1초마다 트랜잭션 확인
      this.txInterval = setInterval(() => {
        transactions = this.drizzleState.transactions;
        transactionStack = this.drizzleState.transactionStack;

        if (Object.keys(transactions).length === stackId + 1) status = transactions[transactionStack[stackId]].status;
        else if (Object.keys(transactions).length === stackId + 2) status = "error";

        if (status === "success" || status === "error") {
          clearInterval(this.txInterval);
          resolve(status);
        }
      }, 1000);
    });
  };

  //투표, Approve 절차 진행
  approve = async () => {
    const Deck = this.drizzle.contracts.Deck;
    const RewardPool = this.drizzle.contracts.RewardPool;
    let temp = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
    let ethAccount = this.drizzleState.accounts[0];
    let stackId = Deck.methods["approve"].cacheSend(RewardPool.address, temp, { from: ethAccount });
    return await this.getTransactionStatus(stackId);
  };

  // 문서 투표
  voteOnDocument = async (documentId: string, deposit: string) => {
    let ethAccount = this.drizzleState.accounts[0];
    const Curator = this.drizzle.contracts.Curator;
    let bigNumberDeposit = this.toBigNumber(deposit);
    return await this.getTransactionStatus(Curator.methods["addVote"].cacheSend(this.fromAscii(documentId), bigNumberDeposit, { from: ethAccount }));
  };

  // 블록체인에 문서 등록
  registerDocumentToSmartContract = async (documentId: string) => {
    if (!documentId) {
      console.error("documentId is nothing");
      return;
    }
    if (!this.isAuthenticated()) {
      console.error("The Metamask login is required.");
      return;
    }
    let drizzleState = this.drizzle.store.getState();
    let ethAccount = drizzleState.accounts[0];
    const Creator = this.drizzle.contracts.Creator;
    // save the `stackId` for later reference
    const stackId = Creator.methods["register"].cacheSend(this.fromAscii(documentId), {
      from: ethAccount
    });
    return await this.getTransactionStatus(stackId);
  };

  // 문서 Claim
  creatorClaimReward = (documentId: string, ethAccount: string) => {
    return new Promise((resolve) => {
        const Creator = this.drizzle.contracts.Creator;
        const RewardPool = this.drizzle.contracts.RewardPool;
        // console.log("claimAuthorReward", ethAccount, "Profile account", documentId, this.fromAscii(documentId));
        const stackId = RewardPool.methods["claim"].cacheSend(this.fromAscii(documentId), Creator.address, { from: ethAccount });

        resolve(this.getTransactionStatus(stackId));
      }
    );
  };

  // 문서 Claim
  curatorClaimReward = (documentId: string, ethAccount: string) => {
    return new Promise((resolve) => {
        const Curator = this.drizzle.contracts.Curator;
        const RewardPool = this.drizzle.contracts.RewardPool;
        //console.log("claimAuthorReward", ethAccount, "Profile account", documentId, this.fromAscii(documentId));
        const stackId = RewardPool.methods["claim"].cacheSend(this.fromAscii(documentId), Curator.address, { from: ethAccount });

        resolve(this.getTransactionStatus(stackId));
      }
    );
  };
}
