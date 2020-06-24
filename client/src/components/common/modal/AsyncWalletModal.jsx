import React from "react";
import { psString } from "../../../config/localization";
import common_view from "../../../common/common_view";
import common from "../../../common/common";
import MainRepository from "../../../redux/MainRepository";
import { FadingCircle } from "better-react-spinkit";

class AsyncWalletModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      account: "",
      closeFlag: false,
      accountError: "",
      loading: false
    };
  }


  // 모달 숨기기 클래스 추가
  setCloseFlag = () =>
    new Promise(resolve =>
      this.setState({ closeFlag: true }, () => resolve()));


  // 계좌 입력 캐치
  onChangeAccount = e =>
    this.setState({ account: e.target.value }, () => this.validateAccount());


  // 계좌 입력값 유효성 체크
  validateAccount = () => {
    const { account } = this.state;

    return new Promise((resolve) => {
      let errMsg = "";

      if (account === "") errMsg = psString("async-modal-err-1");
      else if (!common.checkWalletAccount(account)) errMsg = psString("async-modal-err-2");

      this.setState({ accountError: errMsg },
        () => resolve(errMsg));
    });
  };


  // 지갑 연동 api POST
  asyncAccount = () => {
    const { account } = this.state;

    this.setState({ loading: true });

    return MainRepository.Account.syncEthereum(account)
      .then(() => {
        this.setState({ loading: false });
        void this.handleClose();
        window.location.reload();
      }).catch(() => this.setState({ loading: false })
      );
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
    let v = await this.validateAccount();

    if (v === "") return this.asyncAccount();
  };


  componentDidMount(): void {
    common_view.setBodyStyleLock();
  }


  componentWillUnmount(): void {
    common_view.setBodyStyleUnlock();
  }

  render() {
    const { closeFlag, accountError, loading } = this.state;

    return (
      <div className="custom-modal-container">
        <div className="custom-modal-wrapper"/>
        <div className={"custom-modal " + (closeFlag ? "custom-hide" : "")}>


          <div className="custom-modal-title">
            <i className="material-icons modal-close-btn" onClick={() => this.handleClose()}>close</i>
            <h3>{psString("async-modal-title")}</h3>
          </div>

          <div className="custom-modal-content">
            <div className="withdraw-modal-subject mt-3">{psString("async-modal-subj-1")}</div>
            <div className="deckInput">
              <input type="text" placeholder="0x07Ab267B6F70940f66EAf519b4a7c050496480D3" autoComplete="off" id="async"
                     className={"custom-input " + (accountError.length > 0 ? "custom-input-warning" : "")}
                     onChange={(e) => this.onChangeAccount(e)}
                     onKeyDown={(e) => this.handleKeyDown(e)}/>
              <span>{accountError}</span>
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

export default AsyncWalletModal;
