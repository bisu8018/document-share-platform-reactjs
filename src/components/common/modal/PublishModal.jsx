import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { psString } from "../../../config/localization";
import MainRepository from "../../../redux/MainRepository";
import { FadingCircle } from "better-react-spinkit";
import common_view from "../../../common/common_view";
import common from "../../../common/common";

class PublishModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      classicModal: false,
      registerLoading: false,
      closeFlag: false
    };
  }


  // state 제거
  clearState = () =>
    Promise.resolve(this.setState({
      classicModal: false,
      registerLoading: false,
      closeFlag: false
    }));


  //블록체인 등록
  registerOnChain = () => {
    const { afterPublish, setAlertCode } = this.props;

    return new Promise((resolve, reject) => {
      this.getBalance().then(res => {
        if (res && res > 0) resolve(afterPublish());
        else reject(setAlertCode(2053));
      });
    });
  };


  // 잔액 GET
  getBalance = () => {
    const { getWeb3Apis, getMyInfo } = this.props;
    return new Promise((resolve) => getWeb3Apis.getBalance(getMyInfo.ethAccount, res => resolve(res)));
  };


  // 모달 숨기기 클래스 추가
  setCloseFlag = () =>
    new Promise(resolve =>
      this.setState({ closeFlag: true }, () => resolve()));


  // 모달 open 관리
  handleOpen = modal => {
    const x = [];
    x[modal] = true;
    this.setState(x);
    common_view.setBodyStyleLock();
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


  // 출판/등록 버튼 클릭 관리
  handleClickRegister = () => {
    this.setState({ registerLoading: true }, () => {

      // 문서 출판
      this.handlePublish()
      // 체인 등록 후처리
        .then(() => this.handleClickClose("classicModal"))
        // 체인 등록
        .then(() => this.registerOnChain());
    });
  };


  // 출판 버튼 클릭 관리
  handleClickPublish = () =>
    this.setState({ registerLoading: true },
      () => this.handlePublish()
      // 체인 등록 후처리
        .then(() => this.handleClickClose("classicModal"))
        // 퍼블리시 완료 모달 오픈
        .then(() => this.props.afterPublish()));


  // publish 관리
  handlePublish = () => MainRepository.Document.publishDocument({
    isPublic: true,
    documentId: this.props.documentData.documentId
  });


  render() {
    const { classicModal, registerLoading, closeFlag } = this.state;
    const { getDrizzle, getMyInfo, type, getIsMobile } = this.props;

    let drizzleFlag = getDrizzle && getDrizzle.getReaderAccount() === getMyInfo.ethAccount;

    return (
      <span>
         <Tooltip title={psString("tooltip-publish")} placement="bottom">
           {type === "tabItem" ?
             <div className={"claim-btn " + (getIsMobile ? " w-100" : "")}
                  onClick={() => this.handleOpen("classicModal")}>
               {psString("common-modal-publish")}
             </div>
             :
             <div className="viewer-btn mb-1" onClick={() => this.handleOpen("classicModal")}>
               <i className="material-icons mr-3">publish</i>
               {psString("common-modal-publish")}
             </div>
           }
         </Tooltip>

        {classicModal &&
        <div className="custom-modal-container">
          <div className="custom-modal-wrapper"/>
          <div className={"custom-modal " + (closeFlag ? "custom-hide" : "")}>


            <div className="custom-modal-title">
              <i className="material-icons modal-close-btn"
                 onClick={() => this.handleClickClose("classicModal")}>close</i>
              <h3>{psString("publish-modal-title")}</h3>
            </div>


            <div className="custom-modal-content">
              <div className="">{psString("publish-modal-desc-" + (!drizzleFlag ? "1" : "2"))}</div>
            </div>


            <div className="custom-modal-footer">
              <div onClick={() => this.handleClickClose("classicModal")} className="cancel-btn">
                {psString("common-modal-cancel")}</div>
              {drizzleFlag ?
                <div onClick={() => this.handleClickRegister()}
                     className={"ok-btn " + (registerLoading ? "btn-disabled" : "")}>
                  {registerLoading &&
                  <div className="loading-btn-wrapper"><FadingCircle color="#3681fe" size={17}/></div>}
                  {psString("publish-modal-confirm-btn")}
                </div>
                :
                <div onClick={() => this.handleClickPublish()}
                     className={"ok-btn " + (registerLoading ? "btn-disabled" : "")}>
                  {registerLoading &&
                  <div className="loading-btn-wrapper"><FadingCircle color="#3681fe" size={17}/></div>}
                  {psString("publish-modal-publish-btn")}
                </div>
              }
            </div>
          </div>
        </div>
        }
        </span>
    );
  }
}

export default PublishModal;
