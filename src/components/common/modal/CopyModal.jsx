import React from "react";
import { APP_PROPERTIES } from "properties/app.properties";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Tooltip from "@material-ui/core/Tooltip";
import { psString } from "../../../config/localization";


const Transition = props => <Slide direction="down" {...props} />;

class CopyModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      classicModal: false,
      url: "",
      currentUrl: ""
    };
  }


  // state 제거
  clearState = () => {
    this.setState({
      classicModal: false,
      url: "",
      currentUrl: "",
      embed: ""
    });
  };


  // 임베트 태그 GET
  getEmbed = (url) => {
    return "<iframe src=\"" +
      url
      + "\" title=\"embed\" width=\"640\" height=\"360\" frameBorder=\"0\" marginWidth=\"0\" marginHeight=\"0\" scrolling=\"no\" allowFullScreen/>";
  };


  // URL 셋팅
  setUrl = () => {
    const { documentData, type } = this.props;
    let url = documentData.shortUrl || APP_PROPERTIES.domain().embed + (type === "onlyIcon" ? documentData.seoTitle : ""),
      embed = this.getEmbed(url);
    this.setState({ url: url, currentUrl: window.location.href, embed: embed });
  };


  // 모달 open 관리
  handleClickOpen = (modal) => {
    const x = [];
    x[modal] = true;
    this.setState(x);
    this.setUrl();
  };


  // 모달 close 관리
  handleClose = (modal) => {
    const x = [];
    x[modal] = false;
    this.setState(x);
    this.clearState();
  };


  // 복사 관리
  handleCopy = (id) => {
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
    const { classicModal, url, currentUrl, embed } = this.state;
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
               onClick={() => this.handleClickOpen("classicModal")}>{psString("share-modal-btn")}</div>
        }


        <Dialog
          className="modal-width"
          fullWidth={true}
          open={classicModal}
          TransitionComponent={Transition}
          keepMounted
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description">


              <DialogTitle
                id="classic-modal-slide-title"
                disableTypography>
                <i className="material-icons modal-close-btn" onClick={() => this.handleClose("classicModal")}>close</i>
                <h3>{psString("share-modal-title")}</h3>
              </DialogTitle>


              <DialogContent id="classic-modal-slide-description">
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
              </DialogContent>
            </Dialog>
      </span>
    );
  }
}

export default CopyModal;
