import React from "react";
import history from "apis/history/history";
import { psString } from "../../../config/localization";
import MainRepository from "../../../redux/MainRepository";
import common_view from "../../../common/common_view";
import common from "../../../common/common";


class PrivateDocumentCountModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      classicModal: false,
      closeFlag: false,
      username: null
    };
  }


  // state 제거
  clearState = () =>
    this.setState({
      classicModal: false,
      closeFlag: false
    });


  // 모달 숨기기 클래스 추가
  setCloseFlag = () =>
    new Promise(resolve =>
      this.setState({ closeFlag: true }, () => resolve()));


  // 모달 open 버튼 클릭 관리
  handleClickOpen = (modal) => {
    const { getMyInfo } = this.props;

    let username = getMyInfo.username;
    let _username = username ? username : getMyInfo.ethAccount;
    this.setState({ username: _username }, () => {
      this.handleOpen(modal).then(() => common_view.setBodyStyleLock());
    });
  };


  // 모달 open 관리
  handleOpen = modal => {
    if (!MainRepository.Account.isAuthenticated()) return Promise.reject(MainRepository.Account.login());

    const x = [];
    x[modal] = true;
    this.setState(x);
    return Promise.resolve(true);
  };


  // 모달 취소버튼 클릭 관리
  handleClickClose = modal =>
    this.setCloseFlag()
      .then(() => common.delay(200))
      .then(() => common_view.setBodyStyleUnlock())
      .then(() => this.handleClose(modal))
      .then(() => this.clearState());


  // 모달 close 관리
  handleClose = modal => {
    const x = [];
    x[modal] = false;
    this.setState(x);
  };


  // 링크 이동 관리
  handleLinkBtn = modal => {
    this.handleClickClose(modal);
    history.push("/@" + this.props.getMyInfo.username);
  };


  render() {
    const { classicModal, username, closeFlag } = this.state;
    const { type } = this.props;

    return (
      <span>
         <div className="upload-btn d-none d-sm-flex" id="uploadBtn"
              onClick={() => this.handleClickOpen("classicModal")}>
          {psString("common-modal-upload")}
        </div>
        <div className="mobile-upload-btn d-sm-none d-inline-block"
             onClick={() => this.handleClickOpen("classicModal")}/>


        {type && type === "menu" &&
        <span className="d-inline-block d-sm-none"
              onClick={() => this.handleClickOpen("classicModal")}>{psString("common-modal-upload")}</span>
        }


        {classicModal &&
        <div className="custom-modal-container">
          <div className="custom-modal-wrapper"/>
          <div className={"custom-modal " + (closeFlag ? "custom-hide" : "")}>


            <div className="custom-modal-title">
              <i className="material-icons modal-close-btn"
                 onClick={() => this.handleClickClose("classicModalSub")}>close</i>
              <h3>{psString("private-doc-modal-subj")}</h3>
            </div>

            <div className="custom-modal-content">
              <div className="">{psString("private-doc-modal-desc")}</div>
            </div>

            <div className="custom-modal-footer">
              <div onClick={() => this.handleClickClose()} className="ok-btn">{psString("common-modal-confirm")}</div>
              {username !== common_view.getPath() &&
              <div onClick={() => this.handleLinkBtn()} className="ok-btn">{psString("private-doc-modal-btn")}</div>
              }
            </div>
          </div>
        </div>
        }
        </span>
    );
  }
}

export default PrivateDocumentCountModal;
