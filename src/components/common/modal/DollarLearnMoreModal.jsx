import React from "react";
import { psString } from "../../../config/localization";
import common_view from "../../../common/common_view";
import common from "../../../common/common";

class DollarLearnMoreModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      closeFlag: false
    };
  }


  // 모달 숨기기 클래스 추가
  setCloseFlag = () => new Promise(resolve =>
    this.setState({ closeFlag: true }, () => resolve()));


  // 모달 취소버튼 클릭 관리
  handleClickClose = () =>
    this.setCloseFlag()
      .then(() => common.delay(200))
      .then(() => common_view.setBodyStyleUnlock())
      .then(() => this.props.setModal(null));


  render() {
    const { closeFlag } = this.state;

    return (
      <span>
        <div className="custom-modal-container">
          <div className="custom-modal-wrapper"/>
          <div className={"custom-modal " + (closeFlag ? "custom-hide" : "")}>


            <div className="custom-modal-title">
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
              <div onClick={() => this.handleClickClose()} className="ok-btn">{psString("dollar-learn-more-btn")}</div>
            </div>
          </div>
        </div>
      </span>
    );
  }
}

export default DollarLearnMoreModal;
