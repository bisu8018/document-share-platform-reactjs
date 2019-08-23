import React from "react";
import { psString } from "../../../config/localization";
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from "react-share";
import { APP_PROPERTIES } from "../../../properties/app.properties";
import common_view from "../../../common/common_view";
import common from "../../../common/common";

class PublishCompleteModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      copyBtnText: psString("publish-modal-complete-copy-url"),
      closeFlag: false
    };
  }


  // 종료 버튼 관리
  handleClose = () =>
    this.setCloseFlag()
      .then(() => common.delay(200))
      .then(() => this.props.completeModalClose());


  // 복사 버튼 관리
  handleCopyBtnClick = id =>
    common_view.clipboardCopy(id)
      .then(() => this.props.setAlertCode(2005))
      .then(() => this.setCopyBtnText());


  // 복사 버튼 텍스트 SET
  setCopyBtnText = () => this.setState({ copyBtnText: psString("publish-modal-complete-copied") });


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
    const { copyBtnText, closeFlag } = this.state;
    const { documentData } = this.props;

    let ogUrl = APP_PROPERTIES.domain().embed + documentData.seoTitle;

    return (
      <div className="custom-modal-container">
        <div className="custom-modal-wrapper"/>
        <div className={"custom-modal " + (closeFlag ? "custom-hide" : "")}>


          <div className="custom-modal-title">
            <i className="material-icons modal-close-btn" onClick={() => this.handleClose()}>close</i>
            <h3>{psString("publish-modal-complete-title")}</h3>
          </div>


          <div className="custom-modal-content">
            <div className="publish-modal-complete-subject mb-3">{psString("publish-modal-complete-subject")}</div>

            <div className="publish-modal-complete-sns mb-2">
              <LinkedinShareButton url={ogUrl} className="sns-share-icon">
                <div className="d-inline-block">
                  <img className="mr-2" src={require("assets/image/sns/ic-sns-linkedin-color.png")}
                       alt="facebook sns icon"/>
                  {psString("viewer-page-sns-linkedin")}
                </div>
              </LinkedinShareButton>
            </div>

            <div className="publish-modal-complete-sns mb-2">
              <FacebookShareButton url={ogUrl} className="sns-share-icon">
                <div className="d-inline-block">
                  <img className="mr-2" src={require("assets/image/sns/ic-sns-facebook-color.png")}
                       alt="facebook sns icon"/>
                  {psString("viewer-page-sns-fb")}
                </div>
              </FacebookShareButton>
            </div>

            <div className="publish-modal-complete-sns mb-2">
              <TwitterShareButton url={ogUrl} className="sns-share-icon">
                <div className="d-inline-block">
                  <img className="mr-2" src={require("assets/image/sns/ic-sns-twitter-color.png")}
                       alt="facebook sns icon"/>
                  {psString("viewer-page-sns-twitter")}
                </div>
              </TwitterShareButton>
            </div>

            <div className="publish-modal-complete-sns"
                 onClick={() => this.handleCopyBtnClick("publishModalCompleteCopyDummy")}>
              {copyBtnText}
              <input type="text" className="publish-modal-complete-copy-dummy" readOnly
                     id="publishModalCompleteCopyDummy" value={documentData.shortUrl}/>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default PublishCompleteModal;
