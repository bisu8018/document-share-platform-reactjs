import React from "react";
import { APP_PROPERTIES } from "properties/app.properties";
import Tooltip from "@material-ui/core/Tooltip";
import { psString } from "../../../config/localization";
import common_view from "../../../common/common_view";
import common from "../../../common/common";

class CopyModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      classicModal: false,
      closeFlag: false,
      url: "",
      currentUrl: ""
    };
  }


  // state 제거
  clearState = () =>
    Promise.resolve(this.setState({
      classicModal: false,
      closeFlag: false,
      url: "",
      currentUrl: "",
      embed: ""
    }));


  // 임베트 태그 GET
  getEmbed = url =>
    "<iframe src=\"" +
    url
    + "\" title=\"embed\" width=\"640\" height=\"360\" frameBorder=\"0\" marginWidth=\"0\" marginHeight=\"0\" scrolling=\"no\" allowFullScreen/>";


  // URL 셋팅
  setUrl = () => {
    const { documentData, type } = this.props;
    let url = documentData.shortUrl || APP_PROPERTIES.domain().embed + (type === "onlyIcon" ? documentData.seoTitle : ""),
      embed = this.getEmbed(url);
    this.setState({ url: url, currentUrl: window.location.href, embed: embed });
  };


  // 모달 숨기기 클래스 추가
  setCloseFlag = () =>
    new Promise(resolve =>
      this.setState({ closeFlag: true }, () => resolve()));


  // 모달 open 관리
  handleClickOpen = (modal) => {
    const x = [];
    x[modal] = true;
    this.setState(x);
    this.setUrl();
    common_view.setBodyStyleLock();
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
    return Promise.resolve();
  };


  // 복사 관리
  handleCopy = id => {
    const { setAlertCode } = this.props;

    let copyUrl = document.getElementById(id);
    copyUrl.select();
    document.execCommand("copy");
    setAlertCode(2005);

    document.getElementById("icon-1").innerText = "file_copy";
    document.getElementById("icon-2").innerText = "file_copy";
    document.getElementById("icon-3").innerText = "file_copy";

    copyUrl.nextElementSibling.firstChild.textContent = "done";
  };


  render() {
    const { classicModal, url, currentUrl, embed, closeFlag } = this.state;
    const { type } = this.props;

    return (
      <span>
        {type !== "onlyIcon" ?
          <Tooltip title={psString("tooltip-copy")} placement="bottom">

            <div className="viewer-btn mb-1" onClick={() => this.handleClickOpen("classicModal")}>
              <i className="material-icons">share</i> {psString("share-modal-btn")}
            </div>
          </Tooltip>
          :
          <div className="option-table-btn"
               onClick={() => this.handleClickOpen("classicModal")}>
            <i className="material-icons">share</i>
            {psString("share-modal-btn")}
          </div>
        }

        {classicModal &&
        <div className="custom-modal-container">
          <div className="custom-modal-wrapper"/>
          <div className={"custom-modal " + (closeFlag ? "custom-hide" : "")}>
            <div className="custom-modal-title">
              <i className="material-icons modal-close-btn"
                 onClick={() => this.handleClickClose("classicModal")}>close</i>
              <h3>{psString("share-modal-title")}</h3>
            </div>


            <div className="custom-modal-content">
              <div className="share-modal-title">{psString("copy-short-url")}</div>
              <div className="position-relative mb-4 d-flex">
                <input type="text" value={url}
                       id="copyInput"
                       readOnly
                       className="custom-input"/>
                <div className="custom-input-copy-text ml-2" onClick={() => this.handleCopy("copyInput")}>
                  <i className="material-icons" id="icon-1">file_copy</i>
                </div>
              </div>

              <div className="share-modal-title">{psString("copy-embed-url")}</div>
              <div className="position-relative mb-5 d-flex">
                <input type="text" value={currentUrl}
                       id="copyEmbedUrlInput"
                       readOnly
                       className="custom-input"/>
                <div className="custom-input-copy-text ml-2" onClick={() => this.handleCopy("copyEmbedUrlInput")}>
                  <i className="material-icons" id="icon-2">file_copy</i>
                </div>
              </div>

              <div className="share-modal-title">Embed {"</>"}</div>
              <div className="position-relative mb-5 d-flex">
                  <textarea value={embed}
                            id="copyEmbedInput"
                            readOnly
                            className="custom-textarea"/>
                <div className="custom-input-copy-text ml-2 pt-0" onClick={() => this.handleCopy("copyEmbedInput")}>
                  <i className="material-icons" id="icon-3">file_copy</i>
                </div>
              </div>
            </div>
          </div>
        </div>
        }
      </span>
    );
  }
}

export default CopyModal;
