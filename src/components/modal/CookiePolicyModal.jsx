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

        <div className="privacy-banner" >
            <div className="tac">
              We use cookies to provide and improve our services. By using our site, you consent to our Cookies Policy.
              <div className="cookie-btn d-sm-inline-block mt-2 mt-sm-0 ml-sm-4" onClick={this.getStarted.bind(this)} title="Accept cookies policy">Accept</div>
            </div>
        </div>

    );
  }
}

export default CookiePolicyModal;