import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import MainRepository from "../../../../redux/MainRepository";

class ContentViewBlockchainButton extends React.Component {

  state = {
    stackId: null,
    reload: false
  };

  componentDidMount() {
    const { drizzleApis } = this.props;
    this.unsubscribe = drizzleApis.subscribe((drizzle, drizzleState) => {
      this.printTxStatus(drizzle, drizzleState);
    });
  }

  componentWillUnmount() {
    const { drizzleApis } = this.props;
    drizzleApis.unsubscribe(this.unsubscribe);
  }

  handleRegisterDocumentInBlockChain = () => {
    const { documentData, drizzleApis } = this.props;
    if (!documentData) return;
    const stackId = drizzleApis.registerDocumentToSmartContract(documentData.documentId);
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
    const { documentData, drizzleApis, dataKey } = this.props;
    let idFromDoc = documentData.accountId;
    let idFromAuth = MainRepository.Account.getMyInfo();
    let sub = idFromAuth ? idFromAuth.sub : null;
    let isExistDocument = drizzleApis.isExistDocument(dataKey);
    if (isExistDocument || idFromDoc !== sub || !drizzleApis.isInitialized()|| !drizzleApis.isAuthenticated()) return null;
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
