import React from "react";
import { psString } from "../../../config/localization";
import common_view from "../../../common/common_view";
import common from "../../../common/common";

class DollarLearnMoreModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      classicModal: false,
      closeFlag: false
    };
  }


  // state 제거
  clearState = () =>
    this.setState({
      classicModal: false,
      closeFlag: false
    });


  getStarted = () => {
    this.props.close();
    this.handleClose();
  };


  // 모달 숨기기 클래스 추가
  setCloseFlag = () =>
    new Promise(resolve =>
      this.setState({ closeFlag: true }, () => resolve()));


  // 모달 open 관리
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
      .then(() => common.delay(200))
      .then(() => common_view.setBodyStyleUnlock())
      .then(() => this.handleClose(modal))
      .then(() => this.clearState());


  // 모달 close 관리
  handleClose = (modal) => {
    const x = [];
    x[modal] = false;
    this.setState(x);
    return true;
  };


  render() {
    const { classicModal, closeFlag } = this.state;

    return (
      <span>
        <span className="alert-banner-learn-more"
              onClick={() => this.handleClickOpen("classicModal")}>{psString("dollar-policy-learn-more")}</span>

        {classicModal &&
        <div className="custom-modal-container">
          <div className="custom-modal-wrapper"/>
          <div className={"custom-modal " + (closeFlag ? "custom-hide" : "")}>


            <div className="custom-modal-title">
              <i className="material-icons modal-close-btn"
                 onClick={() => this.handleClickClose("classicModal")}>close</i>
              <h3>{psString("dollar-learn-more-subj")}</h3>
            </div>


            <div className="custom-modal-content tal">
                {psString("dollar-learn-more-explain-1")}
                <br/><br/>
                {psString("dollar-learn-more-explain-2")}
                <br/><br/>
                {psString("dollar-learn-more-explain-3")}
            </div>

            <div className="custom-modal-footer">
              <div onClick={() => this.getStarted()} className="ok-btn">{psString("dollar-learn-more-btn")}</div>
            </div>
          </div>
        </div>}
      </span>
    );
  }
}

export default DollarLearnMoreModal;
