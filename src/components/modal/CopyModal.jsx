import React from "react";
import { APP_PROPERTIES } from "properties/app.properties";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Tooltip from "@material-ui/core/Tooltip";


function Transition(props) {
  return <Slide direction="down" {...props} />;
}


class CopyModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      classicModal: false,
      url: "",
      copyText: "Copy"
    };
  }


  // state 제거
  clearState = () => {
    this.setState({
      classicModal: false,
      url: "",
      copyText: "Copy"
    });
  };


  // 모달 open 관리
  handleClickOpen = (modal) => {
    const { documentData, type } = this.props;
    const x = [];
    x[modal] = true;
    this.setState(x);
    this.setState({ url: (documentData.shortUrl || APP_PROPERTIES.domain().embed + (type === "onlyIcon" ? documentData.seoTitle : "")) });
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
    this.setState({ copyText: "Done" });
  };


  render() {
    const { classicModal, url, copyText } = this.state;
    const { type } = this.props;

    return (
      <span>
         <Tooltip title="Clip the URL of this document" placement="bottom">
           {type !== "onlyIcon" ?
             <div className="viewer-btn" onClick={() => this.handleClickOpen("classicModal")}>
               <i className="material-icons">share</i> Copy Link
             </div>
             :
             <div className="share-btn-wrapper">
             <i className="material-icons mr-3 share-btn" onClick={() => this.handleClickOpen("classicModal")}>share</i>
             </div>
           }
              </Tooltip>

        <Dialog
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
                <h3>Copy URL</h3>
              </DialogTitle>


              <DialogContent id="classic-modal-slide-description">
                <div className="position-relative mb-2 d-flex">
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
