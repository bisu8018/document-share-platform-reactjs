import React from "react";
import Common from "../../common/Common";

class GuideModal extends React.PureComponent {
  state = {
    guidedValue: false
  };

  checkGuideModal = () => {
    this.modalOn();
  };

  modalOn = () => {
    document.getElementsByTagName("HEADER")[0].firstChild.style.position = "inherit";
    document.getElementsByTagName("BODY")[0].style.overflow = "hidden";
    document.getElementById("container").style.marginTop = "25px";
    document.getElementById("header__main-nav").style.position = "inherit !important";
    document.getElementById("uploadBtn").style.zIndex = "4";
    document.getElementById("uploadBtn").style.pointerEvents = "none";
    document.getElementById("tagsMenuSearchContainer").style.zIndex = "4";
    document.getElementById("tagsMenuSearchContainer").style.pointerEvents = "none";
  };

  modalClose = () => {
    document.getElementsByTagName("HEADER")[0].firstChild.style.position = "fixed";
    document.getElementsByTagName("BODY")[0].style.overflow = "auto";
    document.getElementById("container").style.marginTop = "85px";
    document.getElementById("header__main-nav").style.position = "block";
    document.getElementById("uploadBtn").style.zIndex = "1";
    document.getElementById("uploadBtn").style.pointerEvents = "auto";
    document.getElementById("tagsMenuSearchContainer").style.zIndex = "1";
    document.getElementById("tagsMenuSearchContainer").style.pointerEvents = "auto";
  };

  getStarted = () => {
    this.modalClose();
    Common.setCookie("guidedValue", true, 1000);
    this.setState({ guidedValue: true });
  };

  componentWillMount() {
    let _guidedValue = Common.getCookie("guidedValue");
    if (!_guidedValue) {
      Common.setCookie("guidedValue", false, 1000);
      this.setState({ guidedValue: false });
    } else if (_guidedValue === "true") {
      this.setState({ guidedValue: true });
    }
  }

  componentDidMount() {
    if (this.state.guidedValue === false) this.checkGuideModal();
  }

  render() {
    const { guidedValue } = this.state;
    if (guidedValue === true) return (<div/>);
    else return (
      <div className="guide-page-wrapper d-none d-sm-block">
        <div className="arrow-image arrow-to-upload"/>
        <div className="guide-upload-text">This is a button that makes you to upload documents!</div>
        <div className="col-10 col-lg-3 arrow-to-search-wrapper">
          <div className="arrow-image arrow-to-search-tag">
            <span className="guide-search-tag-text">This is a search box that help you to search for document through tags!</span>
          </div>
        </div>
        <div className="start-btn-wrapper">
          <div className="start-btn" onClick={this.getStarted.bind(this)}>Get Started</div>
        </div>
      </div>

    );
  }
}

export default GuideModal;