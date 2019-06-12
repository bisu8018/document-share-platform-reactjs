import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog/index";
import DialogTitle from "@material-ui/core/DialogTitle/index";
import DialogContent from "@material-ui/core/DialogContent/index";
import DialogActions from "@material-ui/core/DialogActions/index";
import Tooltip from "@material-ui/core/Tooltip/index";
import Slide from "@material-ui/core/Slide/index";

import MainRepository from "../../redux/MainRepository";
import Common from "../../util/Common";
import CuratorUserActiveVoteContainer from "../../container/common/UserActiveVoteContainer";
import CuratorActiveVoteContainer from "../../container/common/ActiveVoteContainer";
import ApproveModal from "./ApproveModal";

const style = {
  modalCloseButton: {
    float: "right"
  }
};

function Transition(props) {
  return <Slide direction="down" {...props} />;
}


class VoteDocumentModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      voteStatus: "INIT",   //  INIT(initialize) -> ALLOWANCE -> APPROVE -> VOTE -> COMPLETE
      approve: null,    // 승인 모달 출력 유무
      deposit: 0,
      balance: 0,
      classicModal: false,
      deckError: "",
      msg: "Vote on this document"
    };
  }


  // 승인 모달 approve 클릭 시
  okApprove = () => {
    if (this.state.approve !== true) this.setState({ approve: true });
  };


  // Deck 예금 값 입력 캐치
  onChangeDeposit = e => {
    this.setState({ deposit: e.target.value }, () => {
      this.validateDeposit();
    });
  };


  //예금 값 유효성 체크
  validateDeposit = () => {
    const { deposit, balance } = this.state;
    return new Promise((resolve) => {
      let errMsg = "";
      if (deposit <= 0) errMsg = "Deposit must be greater than zero .";
      else if (deposit > Number(Common.toDeck(balance).toFixed(2))) errMsg = "Deposit must be less than balance .";

      this.setState({ deckError: errMsg }, () => {
        resolve(errMsg);
      });
    });
  };


  //모달 종료시, 값 clear
  clearVoteInfo = () => {
    const { voteStatus } = this.state;
    if (voteStatus !== "INIT" && voteStatus !== "COMPLETE") return;

    this.setState({
      voteStatus: "INIT",
      approve: null,
      vote: { stackId: -1, done: false, complete: false, receipt: null },
      deposit: 0,
      balance: 0,
      classicModal: false,
      deckError: ""
    });
    document.getElementById("deposit").value = null;
  };


  // 투표 Confirm 버튼 클릭
  onClickVote = async () => {
    const { voteStatus, balance } = this.state;
    if (voteStatus !== "INIT" || balance <= 0) return;
    let v = await this.validateDeposit();

    if (v === "") this.handleProcess();
  };


  // [Step 1] : Allowance GET
  handleAllowance = async () => {
    const { getWeb3Apis, getMyInfo } = this.props;
    const { deposit, approve } = this.state;

    let ethAccount = getMyInfo.ethAccount;
    let allowance = await getWeb3Apis.getAllowance(ethAccount).then((res) => {
      this.setState({ voteStatus: "ALLOWANCE" }, () => {
        this.handleClose("classicModal");
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

    await getDrizzle.approve(String(deposit)).then((res) => {
      this.setState({ voteStatus: "APPROVE" });
      if (res === "success") return res;
      else this.handleFailed();
    });
  };


  // [Step 3] : Vote 진행
  handleVote = async () => {
    const { documentData, getDrizzle } = this.props;
    const { deposit } = this.state;

    await getDrizzle.voteOnDocument(documentData.documentId, (String(deposit))).then((res) => {
      this.setState({ voteStatus: "VOTE" });
      if (res === "success") document.location.reload();//this.setState({ voteStatus: "COMPLETE" });
      else this.handleFailed();
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
      if (approve === "success") this.handleVote();

    } else if (allowance === true) this.handleVote();   // 3단계 : Vote 진행
  };


  handleFailed = () => {
    const { setAlertCode } = this.props;

    this.setState({ voteStatus: "INIT", deposit: 0 }, () => {
      document.getElementById("deposit").value = null;
    });
    setAlertCode(2034);
  };

  //모달 오픈
  handleClickOpen = (modal) => {
    const { getDrizzle, getMyInfo } = this.props;
    if (getDrizzle && !getDrizzle.isAuthenticated()) return null;
    if (!getMyInfo.ethAccount) {
      this.setState({ msg: "Please log in to the Meta Mask." });
      return;
    }
    if (getMyInfo.ethAccount !== getDrizzle.getLoggedInAccount()) {
      this.setState({ msg: "Please log in with the correct account." });
      return;
    }

    this.setState({ msg: "Vote on this document" }, () => {
      const x = [];
      x[modal] = true;
      this.setState(x);
    });
  };

  // 모달 종료
  handleClose = (modal) => {
    const x = [];
    x[modal] = false;
    this.clearVoteInfo();
    this.setState(x);
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
    const { getWeb3Apis, getMyInfo } = this.props;
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
    if (!address || balance > 0) return false;
    getWeb3Apis.getBalance(getMyInfo.ethAccount, res => {
      this.setState({ balance: res });
    });
  }


  render() {
    const { documentData, getDrizzle, getIsDocumentExist, getMyInfo } = this.props;
    const { deckError, balance, voteStatus, approve } = this.state;

    this.handleBalance();
    let isLogin = MainRepository.Account.isAuthenticated();
    if (getDrizzle && (!getDrizzle.isInitialized() || !getIsDocumentExist)) return <div/>;

    let btnText, statusFlag;

    if (voteStatus === "INIT" || voteStatus === "COMPLETE") {
      btnText = "Confirm";
      statusFlag = false;
    } else {
      btnText = "Pending";
      statusFlag = true;
    }

    if (!isLogin) {
      return (
        <Tooltip title="Please, login" placement="bottom">
          <div className="viewer-btn" onClick={this.handleLogin.bind(this)}>
            <i className="material-icons">how_to_vote</i> Vote
          </div>
        </Tooltip>
      );
    }

    return (
      <span>
        {(!getDrizzle || !getDrizzle.isAuthenticated()) &&
        <Tooltip title="Please, work with MetaMask" placement="bottom">
          <div className="viewer-btn">
            <i className="material-icons">how_to_vote</i> Vote
          </div>
        </Tooltip>
        }

        {getDrizzle && getIsDocumentExist &&
        <Tooltip title="Vote on this document" placement="bottom">
          <div className="viewer-btn" onClick={() => this.handleClickOpen("classicModal")}>
            <i className="material-icons">how_to_vote</i> Vote
          </div>
        </Tooltip>
        }

        {getDrizzle && getMyInfo.ethAccount &&
        <Dialog
          fullWidth={this.state.fullWidth}
          open={this.state.classicModal}
          TransitionComponent={Transition}
          keepMounted
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description">


          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography>
            <i className="material-icons modal-close-btn" onClick={() => this.handleClose("classicModal")}>close</i>
            <div className="vote-modal-title">Vote on document</div>
          </DialogTitle>


          <DialogContent id="classic-modal-slide-description">
            <div className="vote-modal-subject">1. Total amount of tokens voted</div>
            <ul className="voteList">
              <li>
                <strong>You : </strong>
                <CuratorUserActiveVoteContainer documentData={documentData}
                                                deposit={this.state.deposit}
                                                loggedInAccount={getMyInfo.ethAccount}/>
              </li>
              <li>
                <strong>Total : </strong>
                <CuratorActiveVoteContainer documentData={documentData}
                                            deposit={this.state.deposit}
                                            loggedInAccount={getMyInfo.ethAccount}/>
              </li>
            </ul>


            <div className="vote-modal-subject">2. Amount of available tokens</div>
            <ul className="voteList">
              <li>
                <span className="color-main-color font-weight-bold">{Common.toDeck(balance).toFixed(2)}</span> DECK
                ($ <span className="color-main-color"> {Common.toDollar(balance)} </span>)
              </li>
            </ul>


            <div className="vote-modal-subject">3. Enter the number of votes to commit</div>
            <div className="deckInput">
              <input type="number" placeholder="DECK" autoComplete="off" id="deposit"
                     className={"custom-input " + (deckError.length > 0 ? "custom-input-warning" : "")}
                     onChange={(e) => this.onChangeDeposit(e)}
                     onKeyDown={(e) => this.handleKeyDown(e)}/>
              <span>{deckError}</span>
            </div>

            <p className="noteTxt mt-2">Note: The token used for voting can be withdrawn after 3 days.</p>
          </DialogContent>


          <DialogActions className="modal-footer">
            <div onClick={() => this.handleClose("classicModal")} className="cancel-btn">Cancel</div>
            <div onClick={() => this.onClickVote()}
                 className={"ok-btn " + (statusFlag || balance <= 0 ? "btn-disabled" : "")}>{btnText}</div>
            <div className="d-none">{voteStatus}</div>
          </DialogActions>
        </Dialog>
        }

        {approve === false &&
        <ApproveModal ok={() => this.okApprove()} cancel={() => this.handleClose()}/>
        }
      </span>
    );
  }
}

export default withStyles(style)(VoteDocumentModal);
