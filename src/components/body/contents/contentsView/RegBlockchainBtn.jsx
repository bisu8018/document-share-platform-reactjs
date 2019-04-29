import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import MainRepository from "../../../../redux/MainRepository";

class ContentViewBlockchainButton extends React.Component {

  state = {
    msg: "Register this document to blockchain."
  };

  handleRegisterDocumentInBlockChain = () => {
    const { documentData, getDrizzle, getMyInfo } = this.props;
    if (!documentData) return;
    if (!getMyInfo.ethAccount) {
      this.setState({ msg: "Please log in to the Meta Mask." });
      return;
    }
    if (getMyInfo.ethAccount !== getDrizzle.getLoggedInAccount()) {
      this.setState({ msg: "Please log in with the correct account." });
      return;
    }

    this.setState({ msg: "Pending" }, () => {
      getDrizzle.registerDocumentToSmartContract(documentData.documentId).then(res => {
        if (res === "success") {
          this.setState({ msg: "Successfully registered " }, () => {
            document.location.reload();
          });
        } else{
          this.setState({ msg: "Register this document to blockchain." });
        }
      });
    });

  };

  render() {
    const { documentData, getDrizzle, getIsDocumentExist } = this.props;
    const { msg } = this.state;
    let idFromDoc = documentData.accountId;
    let idFromAuth = MainRepository.Account.getMyInfo();
    let sub = idFromAuth ? idFromAuth.sub : null;

    if (getIsDocumentExist || idFromDoc !== sub || !getDrizzle.isInitialized() || !getDrizzle.isAuthenticated()) return null;
    return (
      <span>
        <Tooltip title={msg} placement="bottom">
          <div className={"register-btn " + (msg === "Pending" ? "btn-disabled" : "")}
               disabled={msg === "Pending"}
               onClick={() => this.handleRegisterDocumentInBlockChain()}>
            <i className="material-icons">add_box</i>
          </div>
        </Tooltip>
      </span>
    );
  }
}

export default ContentViewBlockchainButton;
