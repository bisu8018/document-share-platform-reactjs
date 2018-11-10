import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Close } from "@material-ui/icons";
import { Link } from 'react-router-dom';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from '@material-ui/core/Tooltip';
import Slide from "@material-ui/core/Slide";
import Button from "components/CustomButtons/Button.jsx";
import Badge from "components/Badge/Badge.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import * as restapi from 'apis/DocApi';
import DrizzleApis from 'apis/DrizzleApis';
import CuratorDepositOnUserDocument from 'profile/CuratorDepositOnUserDocument';
import CuratorDepositOnDocument from 'profile/CuratorDepositOnDocument2';

const style = {
  modalCloseButton: {
    float: "right"
  }
};
const VOTE_STATE = {"START":1, "APPROVE": 2, "VOTE": 3, "DONE": 4, "COMPLETE": 5, "ERROR": 6};

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class voteOnDocument extends React.Component {

  state = {
    buttonText: "Vote",
    voteState: VOTE_STATE.START,
    approve: {stackId: -1, done: false, voteOpening: false, receipt: null},
    vote: {stackId:-1, done: false, complete: false, receipt: null},
    deposit: 0,
    classicModal: false,
    stackId: null,
    totalBalanceDataKey: null
  }

  onChangeDeposit = (e) => {
    this.setState({deposit:e.target.value});
  }

  clearVoteInfo = () => {

    this.setState({
      approve: {stackId: -1, done: false, voteOpening: false, receipt: null},
      vote: {stackId:-1, done: false, complete: false, receipt: null},
      deposit: 0

    });
    document.getElementById("deposit").value = null;
  }

  sendVoteInfo = (transactionResult) => {
    const { document, drizzleApis } = this.props;

    const ethAccount = drizzleApis.getLoggedInAccount();
    const curatorId = drizzleApis.getLoggedInAccount();//drizzleState.accounts[0];
    const voteAmount = drizzleApis.fromWei(this.state.deposit);

    restapi.sendVoteInfo(ethAccount, curatorId, voteAmount, document, transactionResult);

  }

  onClickSendVoteInfo=()=> {
    this.sendVoteInfo();
  }

  onClickVote = () => {
    //this.subscribeDrizzle();
    //console.log("subscribeDrizzle start");
    this.handleApprove();
    this.handleClose("classicModal");
    //this.handleVoteOnDocument();

    //console.log("handleApprove start");
  }

  handleApprove = () => {

    const { document, drizzleApis } = this.props;

    if(!document) return;

    if (!drizzleApis.isAuthenticated()) return;

    const deposit = this.state.deposit;

    if(deposit<=0){
      alert("Deposit must be greater than zero.");
      return;
    }

    drizzleApis.subscribe((drizzle, drizzleState) => {
      if(this.state.approve.stackId){
        this.getTransactionStatus(this.state.approve.stackId, drizzleState);
      } else {

      }

      if(this.state.voteState == VOTE_STATE.APPROVE);

      if(!this.state.approve.done && this.checkApproveTransaction(this.state.approve.stackId, drizzleState)) {
        //console.log("start vote");
        const stackId = drizzleApis.voteOnDocument(document.documentId, deposit);
        this.setState({vote:{stackId: stackId}});
      }

      if(this.state.approve.done && this.checkVoteTransaction(this.state.vote.stackId, drizzleState)){
        this.setState({buttonText: "Vote"});
        this.sendVoteInfo();
        this.clearVoteInfo();
      }

    });

    const stackId = drizzleApis.approve(deposit);
    this.setState({approve:{stackId:stackId}});

  }

  getTransactionStatus = (stackId, drizzleState) => {
    const { transactions, transactionStack } = drizzleState;

    const txHash = transactionStack[stackId];

    // if transaction hash does not exist, don't display anything
    if(!txHash) return;

    const txState = transactions[txHash].status;
    const txReceipt = transactions[txHash].receipt;
    const confirmations = transactions[txHash].confirmations;

    //console.log(txState, txReceipt, confirmations);

  }

  checkApproveTransaction = (stackId, drizzleState) => {
    let resultBoolean = false;
    //console.log("checkApproveTransaction", stackId, drizzleState, this.state.approve);
    if(this.state.approve.done) return;

    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = drizzleState;
    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[stackId];

    // if transaction hash does not exist, don't display anything
    if(!txHash) return;

    const txState = transactions[txHash].status;
    const txReceipt = transactions[txHash].receipt;
    const confirmations = transactions[txHash].confirmations;

    this.setState({buttonText: "Approve " + txState});

    if(txState=="success") {
      this.setState({
        approve: {done: true, receipt: txReceipt}
      });
      resultBoolean = true;
    } else if(txState=="error") {
      this.setState({
        approve: {done: true, error:"error"}
      });
    }

    //console.log("getTxApproveStatus", txState, txReceipt, transactions[txHash]);
    // otherwise, return the transaction status
    //return `Transaction status: ${transactions[txHash].status}`;

    return resultBoolean;
  };

  handleVoteOnDocument = () => {

    const { document, drizzle } = this.props;

    if(!document) return;

    const deposit = this.state.deposit;

    if(deposit<=0){
      alert("Deposit must be greater than zero.");
      return;
    }

    this.setState({
      approve: {voteOpening: true}
    });

    this.unsubscribeVote = drizzle.store.subscribe(() => {
      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();
      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.checkTxVoteStatus();

        if(this.state.vote.done){
          this.unsubscribeVote();
          this.sendVoteInfo();
          this.clearVoteInfo();
        }
      } else {
        console.error("drizzleState does not initialized");
      }
    });
  }

  checkVoteTransaction = (stackId, drizzleState) => {
    let returnBoolean = false;
    if(this.state.vote.done) return;

    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = drizzleState;
    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.vote.stackId];

    // if transaction hash does not exist, don't display anything
    if(!txHash) return;

    const txState = transactions[txHash].status;
    const txReceipt = transactions[txHash].receipt;

    this.setState({buttonText: "Voting " + txState});

    if(txState=="success"){
      this.setState({
        vote: {done: true, complete: true, receipt: txReceipt}
      });

      returnBoolean = true;
      this.refresh();
      
    } else if(txState=="error"){
      this.setState({
        vote: {done: true, error:"error", complete:false}
      });
    }

    //console.log("getTxVoteStatus", txState, txReceipt);
    return returnBoolean;
  }

  clearForm = () => {
    document.getElementById("deposit").value=null;
  }

  handleClickOpen = (modal) => {

    const { drizzleApis} = this.props;
    const account = drizzleApis.getLoggedInAccount();
    var x = [];
    x[modal] = true;
    this.setState(x);
  }
  handleClose = (modal) => {
    var x = [];
    x[modal] = false;
    this.setState(x);
    this.clearForm();
  }
  handleClosePopover = (state) => {
    this.setState({
      [state]: false
    });
  }
  handleClickButton = (state) => {
    this.setState({
      [state]: true
    });
  }

  handleRequestBalance = () => {
    const {drizzleApis, accountId} = this.props;
    if(this.state.totalBalanceDataKey) return;

    const loggedInAccount = this.props.drizzleApis.getLoggedInAccount();
    const dataKey = drizzleApis.requestTotalBalance(loggedInAccount);
    if(dataKey){
      //console.log("handleRequestBalance", dataKey);
      this.setState({totalBalanceDataKey: dataKey});
      //setInterval(this.printBalance, 3000);

      //const balance = drizzleApis.getTotalBalance(dataKey);
      //console.log("balance", balance);
    }
  }

  printBalance = () => {
    const {drizzleApis} = this.props;
    //console.log("printBalance", this.state.totalBalanceDataKey);
    if(this.state.totalBalanceDataKey) {
      const balance = drizzleApis.getTotalBalance(this.state.totalBalanceDataKey);
      //console.log("Print Balance on data key", this.state.totalBalanceDataKey, balance);
      return balance;
    }
    return "-";
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.handleRequestBalance();
    return true;
  }

  refresh = () => {
    document.location.reload();
  };

  render() {
    const { classes, ...other } = this.props;
    const loggedInAccount = this.props.drizzleApis.getLoggedInAccount();
    const balanceOf = this.printBalance();

    if (!this.props.drizzleApis.isAuthenticated()) {
      return null;
    }

    return (
      <span>
        <Button color="rose" size="sm" onClick={() => this.handleClickOpen("classicModal")}>{this.state.buttonText}</Button>
        <Dialog
          classes={{
            root: classes.center,
            paper: classes.modal
          }}
          open={this.state.classicModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleClose("classicModal")}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description">
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={classes.modalHeader}>
            <IconButton
              className={classes.modalCloseButton}
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => this.handleClose("classicModal")}>
              <Close className={classes.modalClose} />
            </IconButton>
            <h4 className={classes.modalTitle}>Vote on the document</h4>
          </DialogTitle>
          <DialogContent
            id="classic-modal-slide-description"
            className={classes.modalBody}>

          <h4>1. Total amount of tokens voted</h4>
          <ul className="voteList">
              <li><strong>You : </strong><CuratorDepositOnUserDocument document={this.props.document} deposit={this.state.deposit} {...other} loggedInAccount={loggedInAccount} /></li>
              <li><strong>Total : </strong><CuratorDepositOnDocument document={this.props.document} deposit={this.state.deposit} {...other} loggedInAccount={loggedInAccount} /></li>
          </ul>

          <h4>2. Amount of available tokens</h4>
          <ul className="voteList">
              <li><strong></strong><Tooltip title={balanceOf + " DECK"} placement="bottom"><span>${this.props.drizzleApis.deckToDollar(balanceOf)}</span></Tooltip></li>
          </ul>

          <h4>3. Enter the number of votes to commit</h4>
          <div className="deckInput">
              <CustomInput
                labelText="DECK"
                error
                id="deposit"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  type: "text",
                  onChange: this.onChangeDeposit
                }}

              />
          </div>

          <p className="notiTxt">Note: The token used for voting can be withdrawn after 3 days.</p>

          </DialogContent>
          <DialogActions className={classes.modalFooter}>
            <Button onClick={() => this.onClickVote()} color="rose"  size="sm">Commit</Button>
            <Button onClick={() => this.handleClose("classicModal")} size="sm">Cancel</Button>
          </DialogActions>
        </Dialog>
      </span>
    );
  }
}

export default withStyles(style)(voteOnDocument);
