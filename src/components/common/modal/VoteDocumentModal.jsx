import React from "react";
import Tooltip from "@material-ui/core/Tooltip/index";
import MainRepository from "../../../redux/MainRepository";
import Common from "../../../common/common";
import CuratorUserActiveVoteContainer from "../../../container/common/UserActiveVoteContainer";
import CuratorActiveVoteContainer from "../../../container/common/ActiveVoteContainer";
import ApproveModal from "./ApproveModal";
import { psString } from "../../../config/localization";
import common_view from "../../../common/common_view";


class VoteDocumentModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      closeFlag: false,
      voteStatus: "INIT",   //  INIT(initialize) -> ALLOWANCE -> APPROVE -> VOTE -> COMPLETE
      approve: null,    // 승인 모달 출력 유무
      deposit: 0,
      balance: -1,
      classicModal: false,
      deckError: "",
      msg: psString("vote-modal-tooltip-1")
    };
  }


  // 승인 모달 approve 클릭 시
  okApprove = () => {
    if (this.state.approve !== true) this.setState({ approve: true });
  };


  // Deck 예금 값 입력 캐치
  onChangeDeposit = e =>
    this.setState({ deposit: e.target.value }, () => {
      this.validateDeposit();
    });


  //예금 값 유효성 체크
  validateDeposit = () => {
    const { deposit, balance } = this.state;
    return new Promise((resolve) => {
      let errMsg = "";
      if (deposit <= 0) errMsg = psString("vote-modal-err-1");
      else if (deposit > Number(Common.toDeck(balance).toFixed(2))) errMsg = psString("vote-modal-err-2");

      this.setState({ deckError: errMsg }, () => {
        resolve(errMsg);
      });
    });
  };


  //모달 종료시, 값 clear
  clearVoteInfo = () => {
    const { voteStatus } = this.state;
    if (voteStatus !== "INIT" && voteStatus !== "COMPLETE") return;

    document.getElementById("deposit").value = null;

    this.setState({
      voteStatus: "INIT",
      approve: null,
      vote: { stackId: -1, done: false, complete: false, receipt: null },
      deposit: 0,
      balance: -1,
      deckError: "",
      closeFlag: false,
    });

    return Promise.resolve();
  };


  // 투표 Confirm 버튼 클릭
  onClickVote = async () => {
    const { voteStatus, balance } = this.state;
    if (voteStatus !== "INIT" || balance <= 0) return;
    let v = await this.validateDeposit();

    if (v === "") this.handleProcess();
  };


  // 모달 숨기기 클래스 추가
  setCloseFlag = () =>
    new Promise(resolve =>
      this.setState({ closeFlag: true }, () => resolve()));


  // [Step 1] : Allowance GET
  handleAllowance = async () => {
    const { getWeb3Apis, getMyInfo } = this.props;
    const { deposit, approve } = this.state;

    let ethAccount = getMyInfo.ethAccount;
    let allowance = await getWeb3Apis.getAllowance(ethAccount).then((res) => {
      this.setState({ voteStatus: "ALLOWANCE" }, () => {
        this.handleClickClose("classicModal");
      });
      return res;
    });

    return new Promise((resolve, reject) => {
      if (Number(deposit) > Number(allowance) && approve === null) {
        // 승인 모달 출력
        this.setState({ approve: false }, () => {
          this.setInterval = setInterval(() => {

            // 승인 모달 승인/취소 대기
            if (this.state.approve === null || this.state.approve === true) {
              clearInterval(this.setInterval);
              resolve(false);
            }
          }, 500);
        });
      } else {
        resolve(Number(deposit) <= Number(allowance));
      }
    });
  };


  // [Step 2] : Approve 체크
  handleApprove = async () => {
    const { getDrizzle } = this.props;
    const { deposit } = this.state;

    return new Promise((resolve, reject) => {
      getDrizzle.approve(String(deposit)).then((res) => {
        this.setState({ voteStatus: "APPROVE" });
        if (res === "success")
          resolve(res);
        else
          this.handleFailed();
      });
    });
  };


  // [Step 3] : Vote 진행
  handleVote = async () => {
    const { documentData, getDrizzle } = this.props;
    const { deposit } = this.state;

    await getDrizzle.voteOnDocument(documentData.documentId, (String(deposit))).then((res) => {
      this.setState({ voteStatus: "VOTE" });
      if (res === "success")
        document.location.reload(); //this.setState({ voteStatus: "COMPLETE" });
      else
        this.handleFailed();
    });
  };


  //투표 프로세스 진행
  handleProcess = async () => {
    const { documentData, getDrizzle } = this.props;

    if (!documentData || !getDrizzle.isAuthenticated()) return;
    let allowance, approve;

    allowance = await this.handleAllowance();    // 1단계 : Allowance GET 및 검증 (투표액 > 허용액 : 2단계로, 투표액 <= 허용액 : 3단계로)

    if (allowance === false) {
      approve = await this.handleApprove();    // 2단계 : Approve 진행
      if (approve === "success")
        this.handleVote();

    } else if (allowance === true)
      this.handleVote();   // 3단계 : Vote 진행
  };


  handleFailed = () => {
    const { setAlertCode } = this.props;

    this.setState({ voteStatus: "INIT", deposit: 0 }, () => {
      document.getElementById("deposit").value = null;
    });
    setAlertCode(2034);
  };

  //모달 오픈
  handleClickOpen = modal => {
    const { getDrizzle, getMyInfo } = this.props;
    if (getDrizzle && !getDrizzle.isAuthenticated()) return null;
    if (!getMyInfo.ethAccount) {
      this.setState({ msg: "Please log in to the Meta Mask." });
      return;
    }
    if (getMyInfo.ethAccount !== getDrizzle.getLoggedInAccount()) {
      this.setState({ msg: psString("b-error-1") });
      return;
    }

    this.setState({ msg: psString("vote-modal-tooltip-1") }, () => {
      const x = [];
      x[modal] = true;
      this.setState(x);
      common_view.setBodyStyleLock();
    });
  };


  // 모달 취소버튼 클릭 관리
  handleClickClose = modal =>
    this.setCloseFlag()
      .then(() => Common.delay(200))
      .then(() => common_view.setBodyStyleUnlock())
      .then(() => this.clearVoteInfo())
      .then(() => this.handleClose(modal));



  // 모달 종료
  handleClose = modal => {
    const x = [];
    x[modal] = false;
    this.setState(x);
    return Promise.resolve();
  };


  // 키 다운 관리
  handleKeyDown = (e) => {
    if (e.keyCode === 13) this.onClickVote();
  };


  // 로그인
  handleLogin = () => {
    MainRepository.Account.login();
  };


  // 밸런스 정보 GET
  handleBalance = () => {
    const { getWeb3Apis, getDrizzle, getMyInfo, documentData } = this.props;
    const { balance } = this.state;

    let address = getMyInfo.ethAccount;

    if (getDrizzle && (!getDrizzle.isInitialized() || !documentData.isRegistry)) return false;
    if (!address || balance >= 0) return false;

    let ethAccount = getMyInfo.ethAccount;

    if (ethAccount) {
      getWeb3Apis.getBalance(ethAccount, res => {
        return res;
      });
    }
  };


  componentWillUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void {
    const { getWeb3Apis, getMyInfo } = this.props;
    const { balance } = this.state;
    let address = getMyInfo.ethAccount;
    if (!address || balance >= 0) return false;
    getWeb3Apis.getBalance(getMyInfo.ethAccount, res => {
      this.setState({ balance: res });
    });
  }

  render() {
    const { documentData, getDrizzle, getMyInfo } = this.props;
    const { deckError, balance, voteStatus, approve, closeFlag, classicModal } = this.state;

    this.handleBalance();
    if (getDrizzle && (!getDrizzle.isInitialized() || !documentData.isRegistry)) return <div/>;

    let btnText, statusFlag;

    if (voteStatus === "INIT" || voteStatus === "COMPLETE") {
      btnText = psString("common-modal-confirm");
      statusFlag = false;
    } else {
      btnText = psString("b-pending");
      statusFlag = true;
    }

    if (!MainRepository.Account.isAuthenticated() || !(getDrizzle && getMyInfo.ethAccount && documentData.isRegistry)) return false;

    return (
      <span>
        <Tooltip title={psString("vote-modal-tooltip-1")} placement="bottom">
          <div className="viewer-btn mb-1" onClick={() => this.handleClickOpen("classicModal")}>
            <i className="material-icons">how_to_vote</i> {psString("vote-modal-btn")}
          </div>
        </Tooltip>

        {classicModal &&
        <div className="custom-modal-container">
          <div className="custom-modal-wrapper"/>
          <div className={"custom-modal " + (closeFlag ? "custom-hide" : "")}>


            <div className="custom-modal-title">
              <i className="material-icons modal-close-btn"
                 onClick={() => this.handleClickClose("classicModal")}>close</i>
              <h3 className="vote-modal-title">{psString("vote-modal-title")}</h3>
            </div>


            <div className="custom-modal-content">
              <div className="vote-modal-subject">{psString("vote-modal-subj-1")}</div>
              <ul className="voteList">
                <li>
                  <strong>{psString("vote-modal-you")} : </strong>
                  <CuratorUserActiveVoteContainer documentData={documentData}
                                                  deposit={this.state.deposit}
                                                  loggedInAccount={getMyInfo.ethAccount}/>
                </li>
                <li>
                  <strong>{psString("vote-modal-total")} : </strong>
                  <CuratorActiveVoteContainer documentData={documentData}
                                              deposit={this.state.deposit}
                                              loggedInAccount={getMyInfo.ethAccount}/>
                </li>
              </ul>


              <div className="vote-modal-subject">{psString("vote-modal-subj-2")}</div>
              <ul className="voteList">
                <li>
                  <span className="color-main-color font-weight-bold">{Common.toDeck(balance).toFixed(2)}</span> DECK
                  ($ <span
                  className="color-main-color"> {Common.toDollar(balance).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </span>)
                </li>
              </ul>


              <div className="vote-modal-subject">{psString("vote-modal-subj-3")}</div>
              <div className="deckInput">
                <input type="number" placeholder="DECK" autoComplete="off" id="deposit"
                       className={"custom-input " + (deckError.length > 0 ? "custom-input-warning" : "")}
                       onChange={(e) => this.onChangeDeposit(e)}
                       onKeyDown={(e) => this.handleKeyDown(e)}/>
                <span>{deckError}</span>
              </div>

              <p className="noteTxt mt-2">{psString("vote-modal-note")}</p>
            </div>


            <div className="custom-modal-footer">
              <div onClick={() => this.handleClickClose("classicModal")}
                   className="cancel-btn">{psString("common-modal-cancel")}</div>
              <div onClick={() => this.onClickVote()}
                   className={"ok-btn " + (statusFlag || balance <= 0 ? "btn-disabled" : "")}>{btnText}</div>
              <div className="d-none">{voteStatus}</div>
            </div>
          </div>
        </div>
        }

        {approve === false &&
        <ApproveModal ok={() => this.okApprove()} cancel={() => this.handleClickClose()}/>
        }
      </span>
    );
  }
}

export default VoteDocumentModal;
