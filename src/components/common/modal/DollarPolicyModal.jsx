import React from "react";
import { psString } from "../../../config/localization";
import common_view from "../../../common/common_view";
import { APP_PROPERTIES } from "../../../properties/app.properties";

class DollarPolicyModal extends React.PureComponent {
  state = {
    dollarPolicyValue: false
  };


  // 초기화
  init = () => {
    if (APP_PROPERTIES.ssr) return;

    let _dollarPolicyValue = common_view.getCookie("dpv");
    if (!_dollarPolicyValue) {
      common_view.setCookie("dpv", false, 1000);
      this.setState({ dollarPolicyValue: false });
    } else if (_dollarPolicyValue === "true") {
      this.setState({ dollarPolicyValue: true });
    }
  };


  // 모달 실행 시
  getStarted = () => {
    common_view.setCookie("dpv", true, 1000);
    this.setState({ dollarPolicyValue: true });
  };


  componentWillMount() {
    this.init();
  }


  render() {
    const { dollarPolicyValue } = this.state;
    const { setModal } = this.props;

    if (dollarPolicyValue === true) return (<div/>);
    else return (

      <div className="alert-banner">
        <div className="alert-banner-wrapper container">
          <div className="alert-info-img-wrapper">
            <img src={require("assets/image/icon/i_info.png")} alt="info"/>
          </div>

          <div className="alert-banner-text">
            {psString("dollar-policy-content")}
            <span className="mr-3"/>
            <span className="alert-banner-learn-more"
                  onClick={() => {
                    this.getStarted();
                    setModal("dollarLearnMore");
                  }}>{psString("dollar-policy-learn-more")}</span>
          </div>


          <i className="material-icons banner-close-btn" onClick={() => this.getStarted()}>close</i>

        </div>
        <div className="alert-banner-dummy"/>
      </div>

    );
  }
}

export default DollarPolicyModal;
