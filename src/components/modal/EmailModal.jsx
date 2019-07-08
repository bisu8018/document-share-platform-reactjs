import React from "react";

import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Common from "../../config/common";
import MainRepository from "../../redux/MainRepository";
import TrackingApis from "../../apis/TrackingApis";
import { psString } from "../../config/localization";


function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class EmailModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      classicModal: false,
      email: "",
      emailError: "",
      policyChecked: false
    };
  }

  clearState = () => {
    this.setState({
      classicModal: false,
      email: ""
    });
  };

  //이메일 유효성 체크
  validateEmail = () => {
    const { email } = this.state;
    let checkEmail = Common.checkEmailForm(email);
    this.setState({
      emailError:
        checkEmail ? "" : psString("email-modal-error-1")
    });
    return checkEmail;
  };

  //체크박스 유효성 체크
  validateCheckBox = () => {
    const { policyChecked } = this.state;
    const termsCheckbox = document.getElementById("termsCheckbox").nextElementSibling.firstChild;
    if (policyChecked) {
      termsCheckbox.style.border = "1px solid #7fc241";
    } else {
      termsCheckbox.style.border = "1px solid #f92121";
    }

    return policyChecked;
  };

  setSessionInfo = (data) => {
    const { setTempEmail } = this.props;
    setTempEmail(data.email);
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

  handleSendBtn = async () => {
    const { email } = this.state;
    const { handleTracking, documentId } = this.props;

    if (this.validateEmail() && this.validateCheckBox()) {
      const trackingInfo = TrackingApis.setTrackingInfo();

      let data = {
        "cid": trackingInfo.cid,
        "sid": trackingInfo.sid,
        "email": email,
        "documentId": documentId
      };

      await MainRepository.Tracking.postTrackingConfirm(data).then(() => {
        this.setSessionInfo(data);
        handleTracking();
        this.handleClose();
      });
    }
  };

  handleCheckbox = (e) => {
    this.setState({ policyChecked: e.target.checked }, () => {
      this.validateCheckBox();
    });
  };

  componentWillMount() {
    this.handleClickOpen("classicModal");
  }

  render() {
    const { classicModal, emailError } = this.state;

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
                <h3>{psString("email-modal-subj")}</h3>
              </DialogTitle>


              <DialogContent id="classic-modal-slide-description" className="overflow-hidden">
                 <div className="dialog-subject mb-3">{psString("email-modal-explain-1")}</div>
                <input type="text" placeholder="Email" autoComplete="off"
                       className={"custom-input " + (emailError.length > 0 ? "custom-input-warning" : "")}
                       onChange={(e) => this.handleEmailChange(e)}/>
                <span>{emailError}</span>
              </DialogContent>

              <DialogContent id="classic-modal-slide-policy" className="overflow-hidden mb-n3">
                <input type="checkbox" id="termsCheckbox" onClick={(e) => this.handleCheckbox(e)}/>
                <label htmlFor="termsCheckbox">
                  <span><i className="material-icons">done</i></span>
                  {psString("email-modal-explain-2")}
                    <a className="checkbox-policy-link" target="_blank" href={"/legal/policy.html"}
                       rel="noopener noreferrer">{psString("email-modal-explain-3")}</a>
                </label>
              </DialogContent>

              <DialogActions className="modal-footer">
                <div onClick={() => this.handleSendBtn()} className="ok-btn">{psString("Sign up")}</div>
              </DialogActions>
            </Dialog>
      </span>
    );
  }
}

export default EmailModal;
