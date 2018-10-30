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
    isExistDataKey: null,
    stackId: null
  }

  handleCheckDocumentInBlockChain = () => {
    const { document, classes, drizzle, drizzleState } = this.props;

    if(!document) return;

    if(!drizzleState) return;

    if(this.state.isExistDataKey) return;

    try{
      const ethAccount = drizzleState.accounts[0];
      const dataKey = this.drizzleApis.isExistDocument(document.documentId, ethAccount);
      this.setState({isExistDataKey: dataKey});
      console.log("handleCheckDocumentInBlockChain dataKey", dataKey);
    }catch(e){
      console.error("handleCheckDocumentInBlockChain error", e);
    }
  }

  isExistDocument = () => {
    const { drizzle, drizzleState } = this.props;

    if(!drizzleState) return;

    if(drizzleState.contracts.DocumentReg.contains[this.state.isExistDataKey]){
      console.log("isExistDocument", drizzleState.contracts.DocumentReg.contains[this.state.isExistDataKey].value);
      return drizzleState.contracts.DocumentReg.contains[this.state.isExistDataKey].value;
//      this.setState({isExistInBlockChain: isExistDocument});
    }

  }

  handleRegistDocumentInBlockChain = () => {

    const { document, classes, drizzle, drizzleState } = this.props;

    if(!document) return;

    const ethAccount = drizzleState.accounts[0];
    const stackId = this.drizzleApis.registDocumentToSmartContract(document.documentId);
    this.setState({stackId: stackId});

  }

  isDrizzleInitialized = () => {
    const { drizzle, drizzleState } = this.props;

    console.log("isDrizzleInitialized", drizzle && drizzleState.drizzleStatus.initialized);
    return drizzle && drizzleState.drizzleStatus.initialized;

  }

  printTxStatus = () => {
    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = this.props.drizzleState;
    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.stackId];
    console.log(this.state);
    // if transaction hash does not exist, don't display anything
    if(!txHash) return;

    const txState = transactions[txHash].status;
    const txReceipt = transactions[txHash].receipt;
    const confirmations = transactions[txHash].confirmations;

    if(txReceipt){
      this.handleCheckDocumentInBlockChain();
    }

    console.log("printTxStatus", txState, txReceipt, transactions[txHash]);
  };


  componentDidMount() {
    const { document, classes, drizzle, drizzleState } = this.props;

    if(!drizzleState) return;

    this.handleCheckDocumentInBlockChain();

    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {

      // every time the store updates, grab the state from drizzle
      //const drizzleState = drizzle.store.getState();
      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.printTxStatus();

      }

    });
  }

  compomentDidUnmount() {
    if(this.unsubscribe){
        this.unsubscribe();
    }

  }


  render() {
    const { document, classes } = this.props;

    if(this.isExistDocument()) return null;

    return (
      <div>
        {/*<Button color="rose" size="sm" onClick={this.handleCheckDocumentInBlockChain} >Checking BlockChain</Button>*/}
        <Button color="rose" size="sm" onClick={this.handleRegistDocumentInBlockChain} >Regist to BlockChain</Button>
      </div>
    );
  }
}

export default withStyles(style)(ContentViewBlockchainButton);
