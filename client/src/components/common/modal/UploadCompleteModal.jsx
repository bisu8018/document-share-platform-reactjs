import React from "react";
import history from "apis/history/history";
import { psString } from "../../../config/localization";
import common_view from "../../../common/common_view";
import common from "../../../common/common";


class UploadCompleteModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      closeFlag: false
    };
  }


  // 모달 숨기기 클래스 추가
  setCloseFlag = () => new Promise(resolve =>
    this.setState({ closeFlag: true }, () => resolve()));


  // 모달 취소버튼 클릭 관리
  handleClickClose = () =>
    this.setCloseFlag()
      .then(() => common.delay(200))
      .then(() => common_view.setBodyStyleUnlock())
      .then(() => this.props.setModal(null));


  // 마이페이지에서 모달 종료 관리
  handleCloseOnMyPage = () => {
    this.handleClickClose();
    document.location.reload();
  };


  // 링크 이동 관리
  handleLinkBtn = () => {
    this.handleClickClose();
    let identifier = this.props.getModalData.identifier;
    history.push("/@" + identifier);
  };


  render() {
    const { closeFlag } = this.state;
    const { getModalData } = this.props;

    return (
      <div className="custom-modal-container">
        <div className="custom-modal-wrapper"/>
        <div className={"custom-modal " + (closeFlag ? "custom-hide" : "")}>


          <div className="custom-modal-title">
            <i className="material-icons modal-close-btn"
               onClick={() => this.handleClickClose("classicModalSub")}>close</i>
            <h3>{psString("upload-doc-subj-2")}</h3>
          </div>

          <div className="custom-modal-content tal">
            {getModalData.privateDocumentCount >= 5 ?
              <div>{psString("upload-doc-desc-3")}</div> :
              <div>{psString("upload-doc-desc-2") + psString("upload-doc-desc-4-a") + getModalData.privateDocumentCount + psString("upload-doc-desc-4-b")}</div>
            }
          </div>
          {getModalData.identifier === common_view.getPath().substring(1) ?
            <div className="custom-modal-footer">
              <div onClick={() => this.handleCloseOnMyPage()}
                   className="ok-btn">{psString("common-modal-confirm")}</div>
            </div> :
            <div className="custom-modal-footer">
              <div onClick={() => this.handleClickClose()} className="ok-btn">{psString("common-modal-confirm")}</div>
              <div onClick={() => this.handleLinkBtn()}
                   className="ok-btn ml-2">{psString("private-doc-modal-btn")}</div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default UploadCompleteModal;
