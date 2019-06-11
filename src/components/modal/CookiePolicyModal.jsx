import React from "react";
import Common from "../../util/Common";

class CookiePolicyModal extends React.PureComponent {
  state = {
    cookiePolicyValue: false
  };

  checkCookieModal = () => {
    this.modalOn();
  };

  modalOn = () => {
  };

  modalClose = () => {
  };

  getStarted = () => {
    this.modalClose();
    Common.setCookie("cpv", true, 1000);
    this.setState({ cookiePolicyValue: true });
  };

  componentWillMount() {
    let _cookiePolicyValue = Common.getCookie("cpv");
    if (!_cookiePolicyValue) {
      Common.setCookie("cpv", false, 1000);
      this.setState({ cookiePolicyValue: false });
    } else if (_cookiePolicyValue === "true") {
      this.setState({ cookiePolicyValue: true });
    }
  }

  componentDidMount() {
    if (this.state.cookiePolicyValue === false) this.checkCookieModal();
  }

  render() {
    const { cookiePolicyValue } = this.state;
    if (cookiePolicyValue === true) return (<div/>);
    else return (

      <div className="privacy-banner">

        <div className="privacy-banner-wrapper container">
          <div className="privacy-banner-text">
            We use cookies to provide and improve our services. By using our site, you consent to our Cookies Policy.
          </div>
          {/*<div className="cookie-btn-dummy"/>*/}
          <div className="cookie-btn" onClick={this.getStarted.bind(this)} title="Accept cookies policy">Accept</div>

        </div>
        <div className="privacy-banner-dummy"/>
      </div>

    );
  }
}

export default CookiePolicyModal;