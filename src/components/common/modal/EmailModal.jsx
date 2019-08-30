import React from "react";
import Common from "../../../common/common";
import MainRepository from "../../../redux/MainRepository";
import TrackingApis from "../../../apis/TrackingApis";
import { psString } from "../../../config/localization";
import common_view from "../../../common/common_view";
import { FadingCircle } from "better-react-spinkit";

class EmailModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      classicModal: false,
      closeFlag: false,
      email: "",
      emailError: "",
      policyChecked: false,
      loading: false
    };
  }


  // state 초기화
  clearState = () => {
    this.setState({
      classicModal: false,
      closeFlag: false,
      email: "",
      loading: false
    });
  };


  //이메일 유효성 체크
  validateEmail = () => {
    const { email } = this.state;
    let checkEmail = Common.checkEmailForm(email);
    this.setState({ emailError: checkEmail ? "" : psString("email-modal-error-1") });
    return checkEmail;
  };


  //체크박스 유효성 체크
  validateCheckBox = () => {
    const { policyChecked } = this.state;
    const termsCheckbox = document.getElementById("termsCheckbox").nextElementSibling.firstChild;

    if (policyChecked) termsCheckbox.style.border = "1px solid #3681fe";
    else termsCheckbox.style.border = "1px solid #f92121";

    return policyChecked;
  };


  // 메일 세션 저장
  setSessionInfo = data => this.props.setTempEmail(data.email);


  // 모달 숨기기 클래스 추가
  setCloseFlag = () =>
    new Promise(resolve =>
      this.setState({ closeFlag: true }, () => resolve()));


  // 모달 오픈 관리
  handleClickOpen = modal => {
    const x = [];
    x[modal] = true;
    this.setState(x);
    common_view.setBodyStyleLock();
    return Promise.resolve(true);
  };


  // 모달 취소버튼 클릭 관리
  handleClickClose = modal =>
    this.setCloseFlag()
      .then(() => Common.delay(200))
      .then(() => common_view.setBodyStyleUnlock())
      .then(() => this.handleClose(modal))
      .then(() => this.props.useTracking())
      .then(() => this.clearState());


  // 강제입력 시 모달 종료 관리
  handleBack = modal =>
    this.setCloseFlag()
      .then(() => Common.delay(200))
      .then(() => common_view.setBodyStyleUnlock())
      .then(() => this.handleClose(modal))
      .then(() => this.props.forceTracking())
      .then(() => this.clearState());


  // 모달 닫기 관리
  handleClose = modal => {
    const x = [];
    x[modal] = false;
    this.setState(x);
  };


  // 메일 입력 체크
  handleEmailChange = e =>
    this.setState({ email: e.target.value }, () => {
      this.validateEmail();
    });


  // 보내기 버튼 클릭 시
  handleSendBtn = async () => {
    const { email } = this.state;
    const { handleTracking, documentId } = this.props;

    this.setState({loading: true});

    if (this.validateEmail() && this.validateCheckBox()) {
      const trackingInfo = await TrackingApis.setTrackingInfo().then(res => res);

      let data = {
        "cid": trackingInfo.cid,
        "sid": trackingInfo.sid,
        "email": email,
        "documentId": documentId
      };

      await MainRepository.Tracking.postTrackingConfirm(data).then(() => {
        this.setSessionInfo(data);
        handleTracking();
        this.setState({loading: false});
        this.handleClickClose();
      });
    }
  };


  // 체크박스 관리
  handleCheckbox = (e) => {
    this.setState({ policyChecked: e.target.checked }, () => {
      this.validateCheckBox();
    });
  };


  componentWillMount() {
    this.handleClickOpen("classicModal");
  }


  render() {
    const { classicModal, emailError, closeFlag, loading } = this.state;
    const { documentData } = this.props;

    return (
      <span>
          {classicModal &&
          <div className="custom-modal-container">
            <div className="custom-modal-wrapper"/>
            <div className={"custom-modal " + (closeFlag ? "custom-hide" : "")}>


              <div className="custom-modal-title">
                <h3>{documentData.forceTracking === true ? psString("email-modal-subj-1") : psString("email-modal-subj-2")}</h3>
              </div>

              <div className="custom-modal-content overflow-hidden">
                <div className="dialog-subject mb-3">{psString("email-modal-explain-1")}</div>
                <input type="text" placeholder="Email" autoComplete="off"
                       className={"custom-input " + (emailError.length > 0 ? "custom-input-warning" : "")}
                       onChange={(e) => this.handleEmailChange(e)}/>
                <span>{emailError}</span>
              </div>

              <div className="custom-modal-content overflow-hidden mb-n3">
                <input type="checkbox" id="termsCheckbox" onClick={(e) => this.handleCheckbox(e)}/>
                <label htmlFor="termsCheckbox">
                  <span><i className="material-icons">done</i></span>
                  {psString("email-modal-explain-2")}
                  <a className="checkbox-policy-link ml-1" target="_blank" href={"/legal/policy.html"}
                     rel="noopener noreferrer">{psString("email-modal-explain-3")}</a>
                </label>
              </div>

              <div className="custom-modal-footer">
                {documentData.forceTracking === true ?
                  <div onClick={() => this.handleBack("classicModal")}
                       className="cancel-btn">{psString("email-modal-btn-cancel-2")}</div>
                  :
                  <div onClick={() => this.handleClickClose("classicModal")}
                       className="cancel-btn">{psString("email-modal-btn-cancel-1")}</div>
                }
                <div onClick={() => this.handleSendBtn()} className="ok-btn">
                  {loading &&
                  <div className="loading-btn-wrapper"><FadingCircle color="#3681fe" size={17}/></div>}
                  {psString("email-modal-btn-ok")}
                </div>
              </div>
            </div>
          </div>
          }
      </span>
    );
  }
}

export default EmailModal;
