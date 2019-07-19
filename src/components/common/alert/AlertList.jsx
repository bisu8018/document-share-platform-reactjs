import React from "react";
import AlertContainer from "../../../container/common/alert/AlertContainer";

class AlertList extends React.Component {
  state = {
    container: []
  };


  // alert 배열 push
  pushAlert = (serial, code) => {
    return (
      <AlertContainer code={code} close={() => this.handleClose(serial)} idx={serial}/>
    );
  };


  // 랜더링 준비작업
  readyRender = () => {
    const { container } = this.state;

    let conLength = container.length;

    if (conLength === 3) {
      const tempContainer = container;
      tempContainer.shift();
      this.setState({
        container: tempContainer
      }, () => {
        this.setContainer();
      });
    } else {
      this.setContainer();
    }
  };


  // 컨테이너 셋팅 작업
  setContainer = () => {
    const { container } = this.state;
    const { getAlertCode, setAlertCode } = this.props;

    let serial = container.length + getAlertCode;

    const tempContainer = container;
    tempContainer.push({
      html: this.pushAlert(serial, getAlertCode),
      code: getAlertCode,
      serial: container.length + getAlertCode
    });
    this.setState({ container: tempContainer }, () => {
      setAlertCode(null);
    });
  };


  // 닫기 버튼 관리
  handleClose = (serial) => {
    const { container } = this.state;

    for (let i = 0; i < container.length; ++i) {
      if (container[i].serial === serial) {
        const tempContainer = container;
        tempContainer.splice(i, 1);

        this.setState({
          container: tempContainer
        });
        break;
      }
    }
  };


  // 렌더링 관리
  handelRender = () => {
    const { container } = this.state;
    const { getAlertCode } = this.props;

    let conLength = container.length;

    if (getAlertCode) {
      if (conLength === 0 || (conLength > 0 && container[conLength - 1].code !== getAlertCode)) {
        this.readyRender();
      }
    }
  };


  render() {
    const { container } = this.state;
    const { getAlertCode } = this.props;

    this.handelRender();

    return (
      <div className="alert-list-wrapper">
        <span className="d-none">{getAlertCode}</span>
        {container.map((arr, idx) => (
          <span key={idx}>
            {arr.html}
          </span>
        ))}
      </div>
    );
  }
}

export default AlertList;
