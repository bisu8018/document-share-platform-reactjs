import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { psString } from "../../../../config/localization";

class ContentViewBlockchainButton extends React.Component {

  state = {
    msg: psString("b-explain-1")
  };


  // 문서 체인 등록 관리
  handleRegDoc = () => {
    const { documentData, getDrizzle, getMyInfo, afterRegistered, setAlertCode } = this.props;

    if (!documentData)
      return;
    if (!getDrizzle || !getDrizzle.isInitialized())
      return setAlertCode(2037);
    if (!getDrizzle.isAuthenticated())
      return setAlertCode(2036);
    if (!getMyInfo.ethAccount)
      return this.setState({ msg: psString("b-error-1") });
    if (getMyInfo.ethAccount !== getDrizzle.getLoggedInAccount())
      return this.setState({ msg: psString("b-error-2") });


    this.setState({ msg: psString("b-pending") }, () => {
      getDrizzle.registerDocumentToSmartContract(documentData.documentId).then(res => {
        if (res === "success")
          this.setState({ msg: psString("b-success-1") }, () => afterRegistered());
        else
          this.setState({ msg: psString("b-explain-1") });
      });
    });
  };


  render() {
    const { documentData, type, getIsMobile } = this.props;
    const { msg } = this.state;

    if (documentData.isRegistry)
      return null;

    return (
      <span>
        <Tooltip title={msg} placement="bottom">
            {type === "tabItem" ?
              <div
                className={"claim-btn " + (getIsMobile ? " w-100 " : "") + (msg === psString("b-pending") ? "btn-disabled" : "")}
                id="RegBlockchainBtnTab"
                onClick={() => this.handleRegDoc()}>
                {psString("register-btn")}
              </div>
              :
              <div className={"viewer-btn mb-1 " + (msg === psString("b-pending") ? "btn-disabled" : "")}
                   disabled={msg === psString("b-pending")}
                   id="RegBlockchainBtn"
                   onClick={() => this.handleRegDoc()}>
                <i className="material-icons">add_box</i> {psString("register-btn")}
              </div>
            }
        </Tooltip>
      </span>
    );
  }
}


export default ContentViewBlockchainButton;
