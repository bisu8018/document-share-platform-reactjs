import React from "react";

import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";


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
                <h3>Approve DECK</h3>
              </DialogTitle>


              <DialogContent id="classic-modal-slide-description" className="overflow-hidden">
                 <div className="dialog-desc mb-3">
                  To vote on a document using DECK, you must first approve the Polaris Share Contracts to move DECK on your behalf. You will not be able to vote on documents until approval has completed.
                 </div>
              </DialogContent>

             <DialogContent className="overflow-hidden">
                 <div className="dialog-desc mb-3">
                 After clicking "Approve", you will be asked to sign a transaction, followed by second transaction to complete your requested voting.
                 </div>
              </DialogContent>

              <DialogActions className="modal-footer">
                <div onClick={() => this.handleClose()} className="cancel-btn">Cancel</div>
                <div onClick={() => this.handleApprove()} className="ok-btn">Approve</div>
              </DialogActions>
            </Dialog>
      </span>
    );
  }
}

export default ApproveModal;
