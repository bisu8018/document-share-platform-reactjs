import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { NavigateBefore, NavigateNext, Face } from "@material-ui/icons";
import { Link } from 'react-router-dom';
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Badge from "components/Badge/Badge.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import * as restapi from 'apis/DocApi';
import DrizzleApis from 'apis/DrizzleApis';

const style = {

};

class ContentViewBlockchainButton extends React.Component {

  drizzleApis = new DrizzleApis(this.props.drizzle);
  state = {
    isExistInBlockChain: false,
    isExistDataKey: null
  }

  handleCheckDocumentInBlockChain = () => {
    const { document, classes } = this.props;
    if(!document) return;
    try{
      const dataKey = this.drizzleApis.isExistDocument(document.documentId);
      this.setState({isExistDataKey: dataKey});
    }catch(e){
      console.error("handleCheckDocumentInBlockChain error", e);
    }
  }

  handleRegistDocumentInBlockChain = () => {

    const { document, classes, drizzle } = this.props;

    if(!document) return;

    const drizzleState = drizzle.store.getState();

    const ethAccount = drizzleState.accounts[0];
    this.drizzleApis.registDocumentToSmartContract(document.documentId);

    this.handleCheckDocumentInBlockChain();
  }

  printTxStatus = () => {
    const { drizzle } = this.props;
    const drizzleState = drizzle.store.getState();
    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = drizzleState;

    if(transactions && transactionStack) {
      // get the transaction hash using our saved `stackId`
      const txHash = transactionStack[this.state.stackId];

      // if transaction hash does not exist, don't display anything
      if (!txHash) return null;
      console.log("getTxStatus", txHash, transactions, transactions[txHash].status, drizzleState, drizzle);
      // otherwise, return the transaction status
      const txStatus = transactions[txHash].status;
      const txReceipt = transactions[txHash].receipt;
      if(txReceipt){
        console.log("Transcation Complete", txReceipt);
        this.setState({stackId:null});
      }

      return `Transaction status: ${transactions[txHash].status}`;
    } else {
      console.log("transction is null");
    }

    return null;

  };


  componentWillMount() {
    const { document, classes, drizzle } = this.props;
    this.handleCheckDocumentInBlockChain();

    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {
      // every time the store updates, grab the state from drizzle
      if(!this.state.isExistDataKey) return;
      const drizzleState = drizzle.store.getState();
      // check to see if it's ready, if so, update local component state
      if(drizzleState.contracts.DocumentReg.contains[this.state.isExistDataKey]){
        this.unsubscribe();
        console.log("Document", document.documentId, "isExist in blockchain", drizzleState.contracts.DocumentReg.contains[this.state.isExistDataKey].value);
        this.setState({isExistInBlockChain: drizzleState.contracts.DocumentReg.contains[this.state.isExistDataKey].value});
      }

    });

  }

  compomentWillUnmount() {
    this.unsubscribe();
  }


  render() {
    const { document, classes } = this.props;

    return (
      <div>
        {/*<Button color="rose" size="sm" onClick={this.handleCheckDocumentInBlockChain} >Checking BlockChain</Button>*/}
        {!this.state.isExistInBlockChain?<Button color="rose" size="sm" onClick={this.handleRegistDocumentInBlockChain} >Regist to BlockChain</Button>:""}
      </div>
    );
  }
}

export default withStyles(style)(ContentViewBlockchainButton);
