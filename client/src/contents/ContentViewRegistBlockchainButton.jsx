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
    isExistInBlockChain: false,
    stackId: null,
    reload: false
  }

  checkDocumentInBlockChain = () => {
    const { document, classes, drizzle, drizzleState} = this.props;

    if(!document) return;

    if(!drizzleState) return;

    try{
      const ethAccount = drizzleState.accounts[0];
      const dataKey = this.drizzleApis.isExistDocument(document.documentId, ethAccount);
      this.setState({isExistDataKey: dataKey});
      console.log("checkDocumentInBlockChain dataKey", dataKey);
    }catch(e){
      console.error("checkDocumentInBlockChain error", e);
    }
  }

  isExistDocument = () => {
    const { drizzle, drizzleState } = this.props;

    if(!drizzleState) return false;

    if(drizzleState.contracts.DocumentReg.contains[this.state.isExistDataKey]){
      console.log("isExistDocument", drizzleState.contracts.DocumentReg.contains[this.state.isExistDataKey].value);
      const isExistInBlockChain = drizzleState.contracts.DocumentReg.contains[this.state.isExistDataKey].value
      //this.setState({isExistInBlockChain});
      return isExistInBlockChain;
//      this.setState({isExistInBlockChain: isExistDocument});
    }
    return false;
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
      this.setState({reload:true});
    }


    console.log("printTxStatus", txState, txReceipt, transactions[txHash]);
  };

  componentWillMount() {
    const { document, classes, drizzle, drizzleState} = this.props;
    console.log("ContentViewRegistBlockchainButton componentWillMount()", drizzleState);
  }

  componentDidMount() {
    const { document, classes, drizzle, drizzleState} = this.props;
    console.log("ContentViewRegistBlockchainButton componentDidMount()", drizzleState);
    //const drizzleState = drizzle.store.getState();
    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {
      // every time the store updates, grab the state from drizzle
      //const drizzleState = drizzle.store.getState();
      // check to see if it's ready, if so, update local component state
      if (drizzleState) {
        console.log("drizzleStatus.initialized", drizzleState);
        //this.setState({drizzleState});
        this.printTxStatus();

      }

    });
  }

  compomentDidUnmount() {
      this.unsubscribe();
  }


  render() {
    const { document, classes, drizzleState } = this.props;

    if(!drizzleState) return null;

    if(!this.state.isExistDataKey){
      this.checkDocumentInBlockChain();
    }

    if(this.isExistDocument()) return null;

    console.log("ContentViewRegistBlockchainButton render()", drizzleState);
    return (
      <div>
        {/*<Button color="rose" size="sm" onClick={this.handleCheckDocumentInBlockChain} >Checking BlockChain</Button>*/}
        <Button color="rose" size="sm" onClick={this.handleRegistDocumentInBlockChain} >Regist to BlockChain</Button>
      </div>
    );
  }
}

export default withStyles(style)(ContentViewBlockchainButton);
