import React from "react";
import Tooltip from "../../../../components/modal/VoteDocument";

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

  handleRegistDocumentInBlockChain = () => {
    const { documentData, drizzleApis } = this.props;
    if (!documentData) return;
    const stackId = drizzleApis.registDocumentToSmartContract(documentData.documentId);
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
    const { documentData, drizzleApis } = this.props;
    let disabled = documentData.accountId === drizzleApis.getLoggedInAccount();
    if (drizzleApis.isExistDocument(this.props.dataKey) || disabled) return null;

    return (
      <Tooltip title="Register this document to blockchain" placement="bottom">
        <div className="register-btn"  onClick={this.handleRegistDocumentInBlockChain}>
          <i className="material-icons">add_box</i>
        </div>
      </Tooltip>
    );
  }
}

export default ContentViewBlockchainButton;
