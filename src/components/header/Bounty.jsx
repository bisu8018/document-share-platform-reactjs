import React from "react";

import Slide from "@material-ui/core/Slide";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import MainRepository from "../../redux/MainRepository";


function Transition(props) {
  return <Slide direction="down" {...props} />;
}


class Bounty extends React.Component {
  state = {
    available: 0,
    isAuthenticated: false,
    classicModal: false,
  };


  handleClose = (modal) => {
    const x = [];
    x[modal] = false;
    this.setState(x);
  };


  handleClickOpen = (modal) => {
    if (!MainRepository.Account.isAuthenticated()) {
      MainRepository.Account.login(true);
      return "Loading";
    } else {
      const x = [];
      x[modal] = true;
      this.setState(x);
    }
  };


  handleClickAgree = () => {
    const { getDrizzle } = this.props;
    this.handleClose("classicModal");
    getDrizzle.bounty();
  };


  componentDidUpdate = () => {
    const { getDrizzle, getWeb3Apis, getMyInfo } = this.props;
    if(!getDrizzle || !getWeb3Apis || !getMyInfo) return false;
    let isAuthenticated = getDrizzle.isAuthenticated();
    if (isAuthenticated && !this.state.isAuthenticated) {
      getWeb3Apis.getBountyAvailable(getMyInfo.ethAccount).then((data) => {
        this.setState({ isAuthenticated: true });
        this.setState({ available: data });
      }).catch((err) => {
        console.error(err);
      });
    } else if (!isAuthenticated && this.state.isAuthenticated) {
      this.setState({ isAuthenticated: false });
    }
  };


  render = () => {
    const { classes } = this.props;

      return (
        <span>
             <div className="bounty-btn" onClick={() => this.handleClickOpen("classicModal")}>
                 GET<br/>FREE DECK !!
            </div>


            <Dialog
              className="modal-width"
              fullWidth={this.state.fullWidth}
              open={this.state.classicModal}
              TransitionComponent={Transition}
              keepMounted
              aria-labelledby="classic-modal-slide-title"
              aria-describedby="classic-modal-slide-description">

                <DialogTitle
                  id="classic-modal-slide-title"
                  disableTypography
                  className="">
                  <i className="material-icons modal-close-btn" onClick={() => this.handleClose("classicModal")}>close</i>
                  <h3 className="">Do you need DECK?</h3>
                </DialogTitle>


                <DialogContent id="classic-modal-slide-description" className="">
                  <div className="dialog-subject">New users can get 5000 DECK for free. (Gas fee is required)</div>
                  <div className="dialog-subject">You can vote for good docs with DECK and get rewarded.</div>
                </DialogContent>


                <DialogActions className="modal-footer">
                  <div onClick={() => this.handleClose("classicModal")} className="cancel-btn">Cancel</div>
                  <div onClick={() => this.handleClickAgree()} className="ok-btn">Upload</div>
                </DialogActions>

            </Dialog>
        </span>

      );
  };
}

export default Bounty;
