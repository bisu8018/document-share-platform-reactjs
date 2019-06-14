import React from "react";
import Common from "../../util/Common";
import DollarLearnMoreModal from "./DollarLearnMoreModal";

class DollarPolicyModal extends React.PureComponent {
  state = {
    dollarPolicyValue: false
  };

  checkDollarModal = () => {
    this.modalOn();
  };

  modalOn = () => {
  };

  modalClose = () => {
  };

  getStarted = () => {
    this.modalClose();
    Common.setCookie("dpv", true, 1000);
    this.setState({ dollarPolicyValue: true });
  };

  componentWillMount() {
    let _dollarPolicyValue = Common.getCookie("dpv");
    if (!_dollarPolicyValue) {
      Common.setCookie("dpv", false, 1000);
      this.setState({ dollarPolicyValue: false });
    } else if (_dollarPolicyValue === "true") {
      this.setState({ dollarPolicyValue: true });
    }
  }

  componentDidMount() {
    if (this.state.dollarPolicyValue === false) this.checkDollarModal();
  }

  render() {
    const { dollarPolicyValue } = this.state;
    if (dollarPolicyValue === true) return (<div/>);
    else return (

      <div className="alert-banner">
        <div className="alert-banner-wrapper container">
          <div className="alert-info-img-wrapper">
            <img src={require("assets/image/icon/i_info.png")} alt="info"/>
          </div>

          <div className="alert-banner-text">
            The dollar amount shown here is a test token and is only a reference value, not an actual amount.
            <span className="mr-3"/>
            <DollarLearnMoreModal close={() => {
              this.getStarted();
            }}/>
          </div>


          <i className="material-icons banner-close-btn" onClick={() => this.getStarted()}>close</i>

        </div>
        <div className="alert-banner-dummy"/>
      </div>

    );
  }
}

export default DollarPolicyModal;