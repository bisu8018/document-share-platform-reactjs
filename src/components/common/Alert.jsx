import React from "react";

class Alert extends React.PureComponent {

  state = {
    status: "",    //error, warning, success,
    msg: ""
  };

  handleClose = () => {
    const { setAlertCode } = this.props;
    setAlertCode(null);
  };

  componentWillMount() {
    const { code } = this.props;
    let msg = "";
    let status = "";
    switch (code) {

      //클라이언트 단 상태코드

      // 시스템 메세지 2000~

      //지갑 메세지 2050~
      case 2051 :
        status = "warning";
        msg = "Log in with the correct account.";
        break;

      case 2052 :
        status = "warning";
        msg = "Connect with the correct network.";
        break;

      default :
        break;
    }

    this.setState({ status: status, msg: msg }, () => {
        this.setInterval = setInterval(() => {
          this.handleClose();
          clearInterval(this.setInterval);
        }, 7000);
      }
    );
  }

  render() {
    const { msg, status } = this.state;
    let alertStatus = "alert-" + status;
    return (

      <div className={"alert " + alertStatus}>
        <span className="mr-2">
          <i className="material-icons">{status === "success" ? "check" : status}</i>
        </span>
        <span>{msg}</span>
        <span className="ml-4">
          <i className="material-icons alert-close" title="close" onClick={() => this.handleClose()}>close</i>
        </span>
      </div>

    );
  }
}

export default Alert;