import React from "react";
import { psString } from "../../../config/localization";
import common_view from "../../../common/common_view";
import { APP_PROPERTIES } from "../../../properties/app.properties";

class CookiePolicyModal extends React.PureComponent {
  state = {
    cookiePolicyValue: false
  };


  // 초기화
  init = () => {
    if(APP_PROPERTIES.ssr) return;

    let _cookiePolicyValue = common_view.getCookie("cpv");
    if (!_cookiePolicyValue) {
      common_view.setCookie("cpv", false, 1000);
      this.setState({ cookiePolicyValue: false });
    } else if (_cookiePolicyValue === "true") {
      this.setState({ cookiePolicyValue: true });
    }
  };


  // 모달 실행 시
  getStarted = () => {
    common_view.setCookie("cpv", true, 1000);
    this.setState({ cookiePolicyValue: true });
  };


  componentWillMount() {
    this.init();
  }


  render() {
    const { cookiePolicyValue } = this.state;
    if (cookiePolicyValue === true) return (<div/>);
    else return (

      <div className="privacy-banner">

        <div className="privacy-banner-wrapper container">
          <div className="privacy-banner-text">{psString("cookie-policy-content")}</div>

          <div className="cookie-btn" onClick={this.getStarted.bind(this)}>Accept</div>

        </div>
        <div className="privacy-banner-dummy"/>
      </div>

    );
  }
}

export default CookiePolicyModal;
