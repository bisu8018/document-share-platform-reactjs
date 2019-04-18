import { Drizzle, generateStore } from "drizzle";
import DocumentReg from "apis/contracts-alpha/DocumentRegistry.json";
import Deck from "apis/contracts-alpha/Deck.json";
import BountyOne from "apis/contracts-alpha/BountyOne.json";
import Curator from "apis/contracts-alpha/Curator.json";
import Creator from "apis/contracts-alpha/Creator.json";
import RewardPool from "apis/contracts-alpha/RewardPool.json";

const defaultAccountId = "0x7069Ba7ec699e5446cc27058DeF50dE2224796AE";

export default class DrizzleApis {
  callbackFuncs = [];
  options = { contracts: [DocumentReg, Deck, BountyOne, Curator, Creator, RewardPool] };    // 드리즐 컨트랙 설정
  drizzleStore = generateStore(this.options);   // 드리즐 스토어 셋팅

  constructor(callback) {
    try {
      this.drizzle = new Drizzle(this.options, this.drizzleStore);
      this.unsubscribe = this.drizzle.store.subscribe(() => {
        this.drizzleState = this.drizzle.store.getState();    // 스토어 업데이트 시, 드리즐 state 가져옴
        if (callback) callback(this, this.drizzle, this.drizzleState);   //준비 완료 시, 컴포넌트 상태 업데이트
        if (this.drizzleState.drizzleStatus.initialized) {
          for (const idx in this.callbackFuncs) {
            const callbackFunc = this.callbackFuncs[idx];
            if (callbackFunc) {
              callbackFunc(this.drizzle, this.drizzleState);
            }
          }
        }
      });
    } catch (e) {
      console.error("DrizzleApis initialize fail", e);
    }
  }

  subscribe = (callback) => {
    this.callbackFuncs.push(callback);
    return callback;
  };


  unsubscribe = (callback) => {
    if (this.callbackFuncs.includes(callback)) {
      this.callbackFuncs.remove(callback);
    }
  };

  //드리즐 초기화 진행
  isInitialized = () => {
    if (!this.drizzleState) return;
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


  fromAscii = (str) => {
    return this.drizzle.web3.utils.fromAscii(str);
  };

  // wei => eth 변환
  fromWei = (str) => {
    return this.drizzle.web3.utils.fromWei(str, "ether");
  };

  toBigNumber = (str) => {
    const v = this.drizzle.web3.utils.toWei(str, "ether");
    return v;
  };

  // 바운티 stackId 반환
  bounty = () => {
    if (!this.isAuthenticated()) return;
    const ethAccount = this.drizzleState.accounts[0];
    const BountyOne = this.drizzle.contracts.BountyOne;
    if (!BountyOne) {
      console.error("Bounty Contract is invaild");
      return;
    }
    const stackId = BountyOne.methods["claim"].cacheSend({
      from: ethAccount
    });
    return stackId;
  };

  //투표, Approve 절차 진행
  approve = (deposit) => {
    if (!this.isInitialized()) {
      console.error("Metamask doesn't initialized");
      return;
    }
    if (!this.isAuthenticated()) {
      console.error("The Metamask login is required.");
      return;
    }
    if (deposit <= 0) {
      console.log("Deposit must be greater than zero.");
      return;
    }
    const ethAccount = this.drizzleState.accounts[0];
    const Deck = this.drizzle.contracts.Deck;
    if (!DocumentReg) {
      console.error("DocumentReg Contract is invaild");
      return;
    }
    const bigNumberDeposit = this.toBigNumber(deposit);
    const stackId = Deck.methods["approve"].cacheSend(DocumentReg.address, bigNumberDeposit, {
      from: ethAccount
    });
    console.log("approve stackId", stackId);
    return stackId;
  };

  // 문서 투표
  voteOnDocument = (documentId, deposit) => {
    if (!this.isInitialized()) {
      console.error("Metamask doesn't initialized");
      return;
    }
    if (!this.isAuthenticated()) {
      console.error("The Metamask login is required.");
      return;
    }
    if (!documentId) {
      console.error("documentId is nothing");
      return;
    }
    if (deposit <= 0) {
      console.error("Deposit must be greater than zero.");
      return;
    }
    const ethAccount = this.drizzleState.accounts[0];
    if (!ethAccount) {
      console.error("Metamast Account is invaild");
      return;
    }
    const contract = this.drizzle.contracts.Curator;
    const bigNumberDeposit = this.toBigNumber(deposit);
    console.log("vote on document id", documentId, "deposit", deposit, bigNumberDeposit, "contract address", contract.address);
    const stackId = contract.methods["addVote"].cacheSend(this.fromAscii(documentId), bigNumberDeposit, {
      from: ethAccount
    });
    console.log("voteOnDocument stackId", stackId);
    // save the `stackId` for later reference
    return stackId;
  };

  // 블록체인에 문서 등록
  registerDocumentToSmartContract = (documentId) => {
    if (!documentId) {
      console.error("documentId is nothing");
      return;
    }
    if (!this.isAuthenticated()) {
      console.error("The Metamask login is required.");
      return;
    }
    const drizzleState = this.drizzle.store.getState();
    const ethAccount = drizzleState.accounts[0];
    const contract = this.drizzle.contracts.Creator;
    const stackId = contract.methods["register"].cacheSend(this.fromAscii(documentId), {
      from: ethAccount
    });
    // save the `stackId` for later reference
    return stackId;
  };

  // 문서 Claim
  claimReward = (documentId) => {
    if (!this.isAuthenticated()) {
      console.error("The Metamask login is required.");
      return;
    }
    const ethAccount = this.drizzleState.accounts[0];
    const contract = this.drizzle.contracts.RewardPool;
    console.log("claimAuthorReward", ethAccount, "Profile account", documentId, this.fromAscii(documentId));
    const stackId = contract.methods.claim.cacheSend(this.fromAscii(documentId), ethAccount,{
      from: ethAccount
    });
    return stackId;
  };
}
