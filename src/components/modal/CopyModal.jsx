import React from "react";
import "react-tagsinput/react-tagsinput.css";

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

  clearState = () => {
    this.setState({
      classicModal: false,
      url: "",
      copyText: "Copy"
    });
  };

  handleClickOpen = (modal) => {
    const x = [];
    x[modal] = true;
    this.setState(x);
    this.setState({url : window.location.href});
  };

  handleClose = (modal) => {
    const x = [];
    x[modal] = false;
    this.setState(x);
    this.clearState();
  };

  handleCopy = () => {
    let copyUrl = document.getElementById("copyInput");
    copyUrl.select();
    document.execCommand("copy");
    this.setState({copyText : "Done"})
  };

  render() {
    const { classicModal, url, copyText } = this.state;

    return (
      <span>
         <Tooltip title="Clip the URL of this document" placement="bottom">
                <div className="share-btn" onClick={() => this.handleClickOpen("classicModal")}>
                  <i className="material-icons">share</i>
                </div>
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
                <div className="position-relative mb-2">
                  <input type="text" value={url}
                         id="copyInput"
                         readOnly
                         className="custom-input"/>
                         <span className="custom-input-copy-text" onClick={() => this.handleCopy()}>{copyText}</span>
                </div>
              </DialogContent>
            </Dialog>
      </span>
    );
  }
}

export default CopyModal;
