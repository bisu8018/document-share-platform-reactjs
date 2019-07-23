import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { psString } from "../../../../config/localization";

class ContentViewBlockchainButton extends React.Component {

  state = {
    msg: psString("b-explain-1")
  };

  handleRegisterDocumentInBlockChain = () => {
    const { documentData, getDrizzle, getMyInfo } = this.props;
    if (!documentData) return;
    if (!getMyInfo.ethAccount) {
      this.setState({ msg: psString("b-error-1") });
      return;
    }
    if (getMyInfo.ethAccount !== getDrizzle.getLoggedInAccount()) {
      this.setState({ msg: psString("b-error-2") });
      return;
    }

    this.setState({ msg: psString("b-pending") }, () => {
      getDrizzle.registerDocumentToSmartContract(documentData.documentId).then(res => {
        if (res === "success") {
          this.setState({ msg: psString("b-success-1") }, () => {
            document.location.reload();
          });
        } else{
          this.setState({ msg: psString("b-explain-1") });
        }
      });
    });

  };

  render() {
    const { getDrizzle, getIsDocumentExist } = this.props;
    const { msg } = this.state;

    if (getIsDocumentExist || !getDrizzle.isInitialized() || !getDrizzle.isAuthenticated()) return null;
    return (
      <span>
        <Tooltip title={msg} placement="bottom">
          <div className={"viewer-btn mb-1 " + (msg === psString("b-pending") ? "btn-disabled" : "")}
               disabled={msg === psString("b-pending")}
               onClick={() => this.handleRegisterDocumentInBlockChain()}>
            <i className="material-icons">add_box</i> {psString("register-btn")}
          </div>
        </Tooltip>
      </span>
    );
  }
}

export default ContentViewBlockchainButton;
