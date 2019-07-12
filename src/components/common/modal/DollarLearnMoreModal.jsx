import React from "react";

import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { psString } from "../../../config/localization";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class DollarLearnMoreModal extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      classicModal: false
    };
  }

  clearState = () => {
    this.setState({
      classicModal: false
    });
  };


  getStarted = () => {
    this.props.close();
    this.handleClose();
  };


  handleClickOpen = (modal) => {
    const x = [];
    x[modal] = true;
    this.setState(x);
  };

  handleClose = (modal) => {
    const x = [];
    x[modal] = false;
    this.setState(x);
    this.clearState();
  };

  render() {
    const { classicModal } = this.state;

    return (
      <span>
             <span className="alert-banner-learn-more" onClick={() => this.handleClickOpen("classicModal")}>{psString("dollar-policy-learn-more")}</span>

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
                    <div className="dialog-title">{psString('dollar-learn-more-subj')}</div>
              </DialogTitle>


              <DialogContent id="classic-modal-slide-description" className="overflow-hidden">
                 <div className="dialog-desc">
                   {psString('dollar-learn-more-explain-1')}
                   <br/><br/>
                   {psString('dollar-learn-more-explain-2')}
                   <br/><br/>
                   {psString('dollar-learn-more-explain-3')}
                 </div>
              </DialogContent>

              <DialogActions className="modal-footer">
                <div onClick={() => this.getStarted()} className="ok-btn">{psString('dollar-learn-more-btn')}</div>
              </DialogActions>
            </Dialog>
      </span>
    );
  }
}

export default DollarLearnMoreModal;
