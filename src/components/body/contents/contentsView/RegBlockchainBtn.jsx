import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import MainRepository from "../../../../redux/MainRepository";

class ContentViewBlockchainButton extends React.Component {

  state = {
    stackId: null,
    reload: false
  };

  componentDidMount() {
    const { getDrizzle } = this.props;
    this.unsubscribe = getDrizzle.subscribe((drizzle, drizzleState) => {
      this.printTxStatus(drizzle, drizzleState);
    });
  }

  componentWillUnmount() {
    const { getDrizzle } = this.props;
    getDrizzle.unsubscribe(this.unsubscribe);
  }

  handleRegisterDocumentInBlockChain = () => {
    const { documentData, getDrizzle } = this.props;
    if (!documentData) return;
    const stackId = getDrizzle.registerDocumentToSmartContract(documentData.documentId);
    this.setState({ stackId: stackId });
  };


  printTxStatus = (drizzle, drizzleState) => {
    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = drizzleState;
    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.stackId];
    // if transaction hash does not exist, don't display anything
    if (!txHash) return;

    const txState = transactions[txHash].status;
    const txReceipt = transactions[txHash].receipt;
    console.log("printTxStatus", txState, txReceipt, transactions[txHash]);
  };


  render() {
    const { documentData, getDrizzle, getIsDocumentExist } = this.props;
    let idFromDoc = documentData.accountId;
    let idFromAuth = MainRepository.Account.getMyInfo();
    let sub = idFromAuth ? idFromAuth.sub : null;

    if (getIsDocumentExist || idFromDoc !== sub || !getDrizzle.isInitialized()|| !getDrizzle.isAuthenticated()) return null;
    return (
      <span>
        <Tooltip title="Register this document to blockchain" placement="bottom">
          <div className="register-btn"  onClick={this.handleRegisterDocumentInBlockChain}>
            <i className="material-icons">add_box</i>
          </div>
        </Tooltip>
      </span>
    );
  }
}

export default ContentViewBlockchainButton;
