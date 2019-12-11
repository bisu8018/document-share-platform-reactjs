import React from "react";
import { psString } from "../../../config/localization";
import common_view from "../../../common/common_view";
import common from "../../../common/common";
import { APP_PROPERTIES } from "../../../properties/app.properties";

class DepositModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      copyBtnText: psString("common-modal-copy"),
      closeFlag: false
    };
  }


  // 종료 버튼 관리
  handleClose = () =>
    this.setCloseFlag()
      .then(() => common.delay(200))
      .then(() => this.props.setModal(null));


  // 복사 버튼 관리
  handleCopyBtnClick = id =>
    common_view.clipboardCopy(id)
      .then(() => this.props.setAlertCode(2005))
      .then(() => this.setCopyBtnText());


  // 복사 버튼 텍스트 SET
  setCopyBtnText = () => this.setState({ copyBtnText: psString("deposit-modal-copied") });


  // 모달 숨기기 클래스 추가
  setCloseFlag = () =>
    new Promise(resolve =>
      this.setState({ closeFlag: true }, () => resolve()));


  componentDidMount(): void {
    common_view.setBodyStyleLock();
  }


  componentWillUnmount(): void {
    common_view.setBodyStyleUnlock();
  }


  render() {
    const { closeFlag, copyBtnText } = this.state;

    return (
      <div className="custom-modal-container">
        <div className="custom-modal-wrapper"/>
        <div className={"custom-modal " + (closeFlag ? "custom-hide" : "")}>


          <div className="custom-modal-title">
            <i className="material-icons modal-close-btn" onClick={() => this.handleClose()}>close</i>
            <h3>{psString("deposit-modal-title")}</h3>
          </div>


          <div className="custom-modal-content" >
            <div className="qr-image-wrapper">
              <img src={APP_PROPERTIES.domain().static + "/image/common/qr-foundation.svg"} alt="Foundation Account"/>
            </div>
            <div className="qr-code p-0 p-sm-4 pt-5 pt-sm-0">
              0x07Ab267B6F70940f66EAf519b4a7c050496480D3
            </div>
            <input type="text" className="deposit-modal-copy-dummy" readOnly
                   id="depositModalCompleteCopyDummy" value="0x07Ab267B6F70940f66EAf519b4a7c050496480D3"/>
          </div>

          <div className="custom-modal-footer">
            <div onClick={() => this.handleCopyBtnClick("depositModalCompleteCopyDummy")}
                 className="ok-btn">
              {copyBtnText}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DepositModal;
