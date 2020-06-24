import React from "react";
import { psString } from "../../../config/localization";
import common_view from "../../../common/common_view";
import common from "../../../common/common";
import MainRepository from "../../../redux/MainRepository";
import log from "../../../config/log";
import { FadingCircle } from "better-react-spinkit";
import BalanceOfContainer from "../../../container/common/BalanceOfContainer";

class WithdrawModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      balance: -1,
      amount: 0,
      closeFlag: false,
      deckError: "",
      loading: false
    };
  }

  // 잔액 조회
  getBalance = () => {
    const { getMyInfo } = this.props;
    const { balance } = this.state;

    if (balance >= 0) return false;

    MainRepository.Wallet.getWalletBalance({ userId: getMyInfo.sub })
      .then(res =>
        this.setState({ balance: res.wei }, () => log.CreatorSummary.getBalance()));
    return true;
  };


  // 모달 숨기기 클래스 추가
  setCloseFlag = () =>
    new Promise(resolve =>
      this.setState({ closeFlag: true }, () => resolve()));


  // Deck 출금 값 입력 캐치
  onChangeAmount = e => this.setState({ amount: e.target.value }, () => this.validateWithdraw());


  // 출금 값 유효성 체크
  validateWithdraw = () => {
    const { amount, balance } = this.state;

    return new Promise((resolve) => {
      let errMsg = "";
      if (amount <= 0) errMsg = psString("withdraw-modal-err-1");
      else if (amount > Number(common.toDeck(balance).toFixed(2))) errMsg = psString("withdraw-modal-err-2");

      this.setState({ deckError: errMsg },
        () => resolve(errMsg));
    });
  };


  // 출금 api POST
  walletWithdraw = () => {
    const { amount } = this.state;
    MainRepository.Wallet.walletWithdraw({ amount: Number(amount), toAddress: "0x60D1a46018c84ece3D8fbf39a7aFf9Cde9cA5044" }).then(res => {
      this.setState({ loading: false });
      return this.handleClose();
    });
  };


  // 키 다운 관리
  handleKeyDown = e => {
    if (e.keyCode === 13) return this.onClickVote();
  };


  // 종료 버튼 관리
  handleClose = () =>
    this.setCloseFlag()
      .then(() => common.delay(200))
      .then(() => this.props.setModal(null));


  // 확이 버튼 관리
  handleConfirm = async () => {
    const { balance } = this.state;
    if (balance <= 0) return;
    this.setState({ loading: true });
    let v = await this.validateWithdraw();

    if (v === "") return this.walletWithdraw();
  };


  componentWillMount(): void {
    this.getBalance();
  }


  componentDidMount(): void {
    common_view.setBodyStyleLock();
  }


  componentWillUnmount(): void {
    common_view.setBodyStyleUnlock();
  }


  render() {
    const { closeFlag, balance, deckError, loading } = this.state;

    return (
      <div className="custom-modal-container">
        <div className="custom-modal-wrapper"/>
        <div className={"custom-modal " + (closeFlag ? "custom-hide" : "")}>


          <div className="custom-modal-title">
            <i className="material-icons modal-close-btn" onClick={() => this.handleClose()}>close</i>
            <h3>{psString("withdraw-modal-title")}</h3>
          </div>

          <div className="custom-modal-content">
            <div className="withdraw-modal-subject">{psString("withdraw-modal-subj-1")}</div>
            <div className="withdraw-modal-amount">
              {balance < 0 ?
                <FadingCircle color="#3681fe" size={17}/> :
                <BalanceOfContainer balance={balance}/>}
            </div>
            <div className="withdraw-modal-subject mt-3">{psString("withdraw-modal-subj-2")}</div>
            <div className="deckInput">
              <input type="number" placeholder="DECK" autoComplete="off" id="withdraw"
                     className={"custom-input " + (deckError.length > 0 ? "custom-input-warning" : "")}
                     onChange={(e) => this.onChangeAmount(e)}
                     onKeyDown={(e) => this.handleKeyDown(e)}/>
              <span>{deckError}</span>
            </div>
          </div>

          <div className="custom-modal-footer">
            <div onClick={() => this.handleClose()} className="cancel-btn">
              {psString("common-modal-cancel")}</div>
            <div onClick={() => this.handleConfirm()}
                 className={"ok-btn " + (loading ? "btn-disabled" : "")}>
              {loading &&
              <div className="loading-btn-wrapper"><FadingCircle color="#3681fe" size={17}/></div>}
              {psString("common-modal-confirm")}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WithdrawModal;
