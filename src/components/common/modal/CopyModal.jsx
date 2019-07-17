import React from "react";
import { APP_PROPERTIES } from "properties/app.properties";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Tooltip from "@material-ui/core/Tooltip";
import { psString } from "../../../config/localization";


function Transition(props) {
  return <Slide direction="down" {...props} />;
}


class CopyModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      classicModal: false,
      url: "",
      currentUrl: "",
      copyText: psString("common-modal-copy"),
      copyEmbedText: psString("common-modal-copy")
    };
  }


  // state 제거
  clearState = () => {
    this.setState({
      classicModal: false,
      url: "",
      currentUrl: "",
      embed: "",
      copyText: psString("common-modal-copy"),
      copyEmbedText: psString("common-modal-copy")
    });
  };


  getEmbed = (url) => {
    return "<iframe src=\"" +
      url
      + "\" title=\"embed\" width=\"640\" height=\"360\" frameBorder=\"0\" marginWidth=\"0\" marginHeight=\"0\" scrolling=\"no\" allowFullScreen/>";
  };

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
  handleCopy = () => {
    let copyUrl = document.getElementById("copyInput");
    copyUrl.select();
    document.execCommand("copy");
    this.setState({ copyText: psString("common-modal-done") });
  };


  // 임베드 태그 복사 관리
  handleEmbedCopy = () => {
    let copyUrl = document.getElementById("copyEmbedInput");
    copyUrl.select();
    document.execCommand("copy");
    this.setState({ copyEmbedText: psString("common-modal-done") });
  };


  // 임베드 링크 복사 관리
  handleEmbedUrlCopy = () => {
    let copyUrl = document.getElementById("copyEmbedUrlInput");
    copyUrl.select();
    document.execCommand("copy");
    this.setState({ copyEmbedText: psString("common-modal-done") });
  };


  render() {
    const { classicModal, url, currentUrl, copyText, embed } = this.state;
    const { type } = this.props;

    return (
      <span>
         <Tooltip title={psString("tooltip-copy")} placement="bottom">
           {type !== "onlyIcon" ?
             <div className="viewer-btn mb-1" onClick={() => this.handleClickOpen("classicModal")}>
               <i className="material-icons">share</i> {psString("share-modal-btn")}
             </div>
             :
             <div className="share-btn-wrapper">
               <i className="material-icons mr-3 share-btn"
                  onClick={() => this.handleClickOpen("classicModal")}>share</i>
             </div>
           }
              </Tooltip>

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
                <div className="share-modal-title">Embed {"</>"}</div>
                 <div className="position-relative mb-5 d-flex">
                  <textarea value={embed}
                            id="copyEmbedInput"
                            readOnly
                            className="custom-textarea"/>
                  <div className="custom-input-copy-text ml-2 pt-0"
                       onClick={() => this.handleEmbedCopy()}>{copyText}</div>
                </div>

                <div className="share-modal-title">{psString("copy-embed-url")}</div>
                <div className="position-relative mb-5 d-flex">
                  <input type="text" value={currentUrl}
                         id="copyEmbedUrlInput"
                         readOnly
                         className="custom-input"/>
                  <div className="custom-input-copy-text ml-2" onClick={() => this.handleEmbedUrlCopy()}>{copyText}</div>
                </div>

                <div className="share-modal-title">{psString("copy-short-url")}</div>
                <div className="position-relative mb-4 d-flex">
                  <input type="text" value={url}
                         id="copyInput"
                         readOnly
                         className="custom-input"/>
                  <div className="custom-input-copy-text ml-2" onClick={() => this.handleCopy()}>{copyText}</div>
                </div>
              </DialogContent>
            </Dialog>
      </span>
    );
  }
}

export default CopyModal;
