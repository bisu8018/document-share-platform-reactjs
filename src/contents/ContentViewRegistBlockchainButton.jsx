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

  state = {
    isExistDataKey: null,
    stackId: null,
    reload: false
  }

  checkDocumentInBlockChain = () => {
    const { document, classes, drizzleApis} = this.props;
    if(!drizzleApis.isInitialized() || !drizzleApis.isAuthenticated()) return;

    if(this.state.isExistDataKey) return;

    if(!document) return;

    try{
      console.log(document);
      const dataKey = drizzleApis.requestIsExistDocument(document.documentId);
      this.setState({isExistDataKey: dataKey});
      console.log("checkDocumentInBlockChain dataKey", dataKey);
    }catch(e){
      console.error("checkDocumentInBlockChain error", e);
    }
  }

  isExistDocument = () => {
    const { drizzleApis } = this.props;

    if(this.state.isExistDataKey) {
      return drizzleApis.isExistDocument(this.state.isExistDataKey);
    }


  }

  handleRegistDocumentInBlockChain = () => {

    const { document, classes, drizzleApis } = this.props;

    if(!document) return;

    const stackId = drizzleApis.registDocumentToSmartContract(document.documentId);
    this.setState({stackId: stackId});

  }

  printTxStatus = (drizzle, drizzleState) => {
    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = drizzleState;
    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.stackId];
    // if transaction hash does not exist, don't display anything
    if(!txHash) return;

    const txState = transactions[txHash].status;
    const txReceipt = transactions[txHash].receipt;
    const confirmations = transactions[txHash].confirmations;


    console.log("printTxStatus", txState, txReceipt, transactions[txHash]);
  };


  componentDidMount() {
    const { document, classes, drizzleApis} = this.props;
    //const drizzleState = drizzle.store.getState();
    // subscribe to changes in the store
    this.unsubscribe = drizzleApis.subscribe((drizzle, drizzleState) => {
      // every time the store updates, grab the state from drizzle
      //const drizzleState = drizzle.store.getState();
      // check to see if it's ready, if so, update local component state

        //console.log("ContentViewRegistBlockchainButton drizzle initialized", drizzleState);

        this.printTxStatus(drizzle, drizzleState);


    });
  }

  compomentDidUnmount() {
    const { drizzleApis} = this.props;
    drizzleApis.unsubscribe(this.unsubscribe);


  }

  shouldComponentUpdate(nextProps, nextState) {
    const { drizzleApis} = this.props;
    //console.log("shoudComponentUpdate drizzleApis.isAuthenticated()", drizzleApis.isAuthenticated());
    if(drizzleApis.isInitialized()&& drizzleApis.isAuthenticated()){
      this.checkDocumentInBlockChain();
    }

    return true;
  }

  render() {
    const { document, classes, drizzleApis } = this.props;

    if(!drizzleApis.isAuthenticated()) return null;

    const disabled = document.accountId == drizzleApis.getLoggedInAccount()?false:true;
    if(!this.isExistDocument() && !disabled) {
      return (
        <div>
          {/*<Button color="rose" size="sm" onClick={this.handleCheckDocumentInBlockChain} >Checking BlockChain</Button>*/}
          <Button color="rose" size="sm" onClick={this.handleRegistDocumentInBlockChain} disabled={disabled} >Register to BlockChain</Button>
        </div>
      );
    }
    return null;
  }
}

export default withStyles(style)(ContentViewBlockchainButton);
