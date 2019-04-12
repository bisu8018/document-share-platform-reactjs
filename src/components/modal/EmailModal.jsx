import React from "react";
import "react-tagsinput/react-tagsinput.css";

import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Common from "../../util/Common";


function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class EmailModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      classicModal: false,
      email: "",
      emailError: ""
    };
  }

  clearState = () => {
    this.setState({
      classicModal: false,
      email: ""
    });
  };

  handleClickOpen = (modal) => {
    const x = [];
    x[modal] = true;
    this.setState(x);
  };

  handleClose = (modal) => {
    const { forceTracking } = this.props;
    const x = [];
    x[modal] = false;
    this.setState(x);
    forceTracking();
    this.clearState();
  };

  handleEmailChange = e => {
    this.setState({ email: e.target.value }, () => {
      this.validateEmail();
    });
  };

  handleSendBtn = () => {
    const { email } = this.state;
    const { handleTracking } = this.props;
    if(this.validateEmail()) {
      Common.setCookie("tracking_email", email);
      if(Common.getCookie("tracking_email")) handleTracking();
      this.handleClose();
    }
  };

  //이메일 유효성 체크
  validateEmail = () => {
    const { email } = this.state;
    let checkEmail = Common.checkEmailForm(email);
    this.setState({
      emailError:
        checkEmail ? "" : "Email address does not fit the form ."
    });
    console.log(checkEmail);
    return checkEmail;
  };

  componentWillMount() {
    this.handleClickOpen("classicModal");
  }

  render() {
    const { classicModal,emailError } = this.state;

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
                <i className="material-icons modal-close-btn" onClick={() => this.handleClose("classicModal")}>close</i>
                <h3>Send Email Address</h3>
              </DialogTitle>


              <DialogContent id="classic-modal-slide-description">
                 <div className="dialog-subject">Email</div>
                <input type="text" placeholder="Title of the uploading document" id="docTitle"
                       className={"custom-input " + (emailError.length > 0 ? "custom-input-warning" : "")}
                       onChange={(e) => this.handleEmailChange(e)}/>
                <span>{emailError}</span>
              </DialogContent>


              <DialogActions className="modal-footer">
                <div onClick={() => this.handleClose("classicModal")} className="cancel-btn">Cancel</div>
                <div onClick={() => this.handleSendBtn()} className="ok-btn">Send</div>
              </DialogActions>
            </Dialog>
      </span>
    );
  }
}

export default EmailModal;
