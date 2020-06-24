import React from "react";
import Tooltip from "@material-ui/core/Tooltip/index";
import MainRepository from "../../../redux/MainRepository";
import Common from "../../../common/common";
import CuratorUserActiveVoteContainer from "../../../container/common/UserActiveVoteContainer";
import CuratorActiveVoteContainer from "../../../container/common/ActiveVoteContainer";
import { psString } from "../../../config/localization";
import common_view from "../../../common/common_view";


class VoteDocumentModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      closeFlag: false,
      loading: false,
      deposit: 0,
      balance: -1,
      classicModal: false,
      deckError: "",
      msg: psString("vote-modal-tooltip-1")
    };
  }


  // Deck 예금 값 입력 캐치
  onChangeDeposit = e => this.setState({ deposit: e.target.value }, () => this.validateDeposit());


  //예금 값 유효성 체크
  validateDeposit = () => {
    const { deposit, balance } = this.state;
    return new Promise((resolve) => {
      let errMsg = "";
      if (deposit <= 0) errMsg = psString("vote-modal-err-1");
      else if (deposit > Number(Common.toDeck(balance).toFixed(2))) errMsg = psString("vote-modal-err-2");

      this.setState({ deckError: errMsg },
        () => resolve(errMsg));
    });
  };


  //모달 종료시, 값 clear
  clearVoteInfo = () => {

    document.getElementById("deposit").value = null;

    this.setState({
      vote: { stackId: -1, done: false, complete: false, receipt: null },
      deposit: 0,
      balance: -1,
      deckError: "",
      closeFlag: false
    });

    return Promise.resolve();
  };


  // 투표 Confirm 버튼 클릭
  onClickVote = async () => {
    const { balance } = this.state;
    if (balance <= 0) return;
    let v = await this.validateDeposit();

    if (v === "") return this.onVoteDocument();
  };


  // 투표 POST
  onVoteDocument = () => {
    const { documentData } = this.props;
    const { deposit } = this.state;

    this.setState({ loading: true });
    console.log(documentData);
    let data = {
      documentId: documentData.documentId,
      amount: deposit
    };

    MainRepository.Wallet.voteDocument(data)
      .then(res => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };


  // 모달 숨기기 클래스 추가
  setCloseFlag = () => new Promise(resolve =>
    this.setState({ closeFlag: true }, () => resolve())
  );


  //모달 오픈
  handleClickOpen = modal => {
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
  handleKeyDown = e => {
    if (e.keyCode === 13) return this.onClickVote();
  };


  // 로그인
  handleLogin = () => MainRepository.Account.login();


  // 밸런스 정보 GET
  handleBalance = () => {
    const { getMyInfo } = this.props;
    const { balance } = this.state;

    if (balance >= 0) return false;

    return MainRepository.Wallet.getWalletBalance({ userId: getMyInfo.sub }).then(res => res.wei);

  };


  componentWillUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void {
    const { getMyInfo } = this.props;
    const { balance } = this.state;

    if (balance >= 0) return false;

    MainRepository.Wallet.getWalletBalance({ userId: getMyInfo.sub })
      .then(res => {
          this.setState(
            {
              balance: res.wei
            }
          );
        }
      );
  }


  render() {
    const { documentData } = this.props;
    const { deckError, balance, closeFlag, classicModal } = this.state;

    this.handleBalance();

    let btnText, statusFlag;

    btnText = psString("common-modal-confirm");
    statusFlag = false;


    if (!MainRepository.Account.isAuthenticated()) return false;

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
                                                  deposit={this.state.deposit}/>
                </li>
                <li>
                  <strong>{psString("vote-modal-total")} : </strong>
                  <CuratorActiveVoteContainer documentData={documentData}
                                              deposit={this.state.deposit}/>
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

            </div>
          </div>
        </div>
        }
      </span>
    );
  }
}

export default VoteDocumentModal;
