import React from "react";

import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { psString } from "../../config/localization";


function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class ApproveModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      classicModal: false,
    };
  }


  handleClickOpen = (modal) => {
    const x = [];
    x[modal] = true;
    this.setState(x);
    this.props.cancel();
  };

  handleApprove = () => {
    this.props.ok();
  };

  handleClose = (modal) => {
    const x = [];
    x[modal] = false;
    this.setState(x);
  };


  componentWillMount() {
    this.handleClickOpen("classicModal");
  }

  render() {
    const { classicModal } = this.state;

    return (
      <span>
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
                <h3>{psString("approve-title")}</h3>
              </DialogTitle>


              <DialogContent id="classic-modal-slide-description" className="overflow-hidden">
                 <div className="dialog-desc mb-3">
                  {psString("approve-explain-1")}
                 </div>
              </DialogContent>

             <DialogContent className="overflow-hidden">
                 <div className="dialog-desc mb-3">
                   {psString("approve-explain-2")}
                 </div>
              </DialogContent>

              <DialogActions className="modal-footer">
                <div onClick={() => this.handleClose()} className="cancel-btn">{psString("common-modal-cancel")}</div>
                <div onClick={() => this.handleApprove()} className="ok-btn"> {psString("common-modal-approve")}</div>
              </DialogActions>
            </Dialog>
      </span>
    );
  }
}

export default ApproveModal;
