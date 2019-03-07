import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Tooltip from "@material-ui/core/Tooltip";
import Slide from "@material-ui/core/Slide";

import CustomInput from "components/custom/CustomInput.jsx";
import MainRepository from "../../redux/MainRepository";
import CuratorDepositOnUserDocument from "../body/profile/CuratorDepositOnUserDocument";
import CuratorDepositOnDocument from "../body/profile/CuratorDepositOnDocument";


const style = {
  modalCloseButton: {
    float: "right"
  }
};

const VOTE_STATE = { "START": 1, "APPROVE": 2, "VOTE": 3, "DONE": 4, "COMPLETE": 5, "ERROR": 6 };

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class VoteDocument extends React.Component {

  state = {
    buttonText: "Vote",
    voteState: VOTE_STATE.START,
    approve: { stackId: -1, done: false, voteOpening: false, receipt: null },
    vote: { stackId: -1, done: false, complete: false, receipt: null },
    deposit: 0,
    classicModal: false,
    stackId: null,
    totalBalanceDataKey: null
  };

  shouldComponentUpdate(nextProps, nextState) {
    this.handleRequestBalance();
    return true;
  }

  _onChangeDeposit = (e) => {
    this.setState({ deposit: e.target.value });
  };

  _clearVoteInfo = () => {

    this.setState({
      approve: { stackId: -1, done: false, voteOpening: false, receipt: null },
      vote: { stackId: -1, done: false, complete: false, receipt: null },
      deposit: 0

    });
    document.getElementById("deposit").value = null;
  };

  _sendVoteInfo = (transactionResult) => {
    const { document, drizzleApis, auth } = this.props;

    const ethAccount = drizzleApis.getLoggedInAccount();
    const curatorId = auth.getEmail();//drizzleApis.getLoggedInAccount();//drizzleState.accounts[0];
    const voteAmount = drizzleApis.fromWei(this.state.deposit);

    MainRepository.Document.sendVoteInfo(ethAccount, curatorId, voteAmount, document, transactionResult, () => {
    }, () => {
    });

  };

  /*  _onClickSendVoteInfo=()=> {
      this._sendVoteInfo();
    };*/

  _onClickVote = () => {
    //this.subscribeDrizzle();
    //console.log("subscribeDrizzle start");
    this._sendVoteInfo();
    this._handleApprove();

    if (this.state.buttonText === "Vote") {
      this.handleClose("classicModal");
    }
    //this._handleVoteOnDocument();

    //console.log("handleApprove start");
  };

  _handleApprove = () => {

    const { document, drizzleApis } = this.props;
    const deposit = this.state.deposit;

    if (!document) return;
    if (!drizzleApis.isAuthenticated()) return;
    if (deposit <= 0) {
      alert("Deposit must be greater than zero.");
      return;
    }

    drizzleApis.subscribe((drizzle, drizzleState) => {
      /*  if (this.state.approve.stackId) {
          this._getTransactionStatus(this.state.approve.stackId, drizzleState);
        }*/

      if (!this.state.approve.done && this.checkApproveTransaction(this.state.approve.stackId, drizzleState)) {
        //console.log("start vote");
        const stackId = drizzleApis.voteOnDocument(document.documentId, deposit);
        this.setState({ vote: { stackId: stackId } });
      }

      if (this.state.approve.done && this.checkVoteTransaction(this.state.vote.stackId, drizzleState)) {
        this.setState({ buttonText: "Vote" });
        this._clearVoteInfo();
      }

    });

    const stackId = drizzleApis.approve(deposit);
    this.setState({ approve: { stackId: stackId } });

  };

  /* _getTransactionStatus = (stackId, drizzleState) => {
     const { transactionStack } = drizzleState;
     const txHash = transactionStack[stackId];

     if (!txHash)
       return;

     const txState = transactions[txHash].status;
     const txReceipt = transactions[txHash].receipt;
     const confirmations = transactions[txHash].confirmations;

     console.log(txState, txReceipt, confirmations);
   };*/

  checkApproveTransaction = (stackId, drizzleState) => {
    let resultBoolean = false;
    //console.log("checkApproveTransaction", stackId, drizzleState, this.state.approve);

    if (this.state.approve.done) return;

    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = drizzleState;

    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[stackId];

    // if transaction hash does not exist, don't display anything
    if (!txHash) return;

    const txState = transactions[txHash].status;
    const txReceipt = transactions[txHash].receipt;
    //const confirmations = transactions[txHash].confirmations;

    this.setState({ buttonText: "Approval " + txState });

    if (txState === "success") {
      this.setState({
        approve: { done: true, receipt: txReceipt }
      });
      resultBoolean = true;
    } else if (txState === "error") {
      this.setState({
        approve: { done: true, error: "error" }
      });
    }

    //console.log("getTxApproveStatus", txState, txReceipt, transactions[txHash]);
    // otherwise, return the transaction status
    //return `Transaction status: ${transactions[txHash].status}`;

    return resultBoolean;
  };

  /*  _handleVoteOnDocument = () => {

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
            this._sendVoteInfo();
            this._clearVoteInfo();
          }
        } else {
          console.error("drizzleState does not initialized");
        }
      });
    };*/

  checkVoteTransaction = (stackId, drizzleState) => {
    let returnBoolean = false;
    if (this.state.vote.done) return;

    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = drizzleState;
    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.vote.stackId];

    // if transaction hash does not exist, don't display anything
    if (!txHash) return;

    const txState = transactions[txHash].status;
    const txReceipt = transactions[txHash].receipt;

    this.setState({ buttonText: "Voting " + txState });

    if (txState === "success") {
      this.setState({
        vote: { done: true, complete: true, receipt: txReceipt }
      });
      returnBoolean = true;
      this.refresh();
    } else if (txState === "error") {
      this.setState({
        vote: { done: true, error: "error", complete: false }
      });
    }
    return returnBoolean;
  };


  clearForm = () => {
    document.getElementById("deposit").value = null;
  };


  handleClickOpen = (modal) => {
    //const { drizzleApis } = this.props;
    //const account = drizzleApis.getLoggedInAccount();
    const x = [];
    x[modal] = true;
    this.setState(x);
  };


  handleClose = (modal) => {
    const x = [];
    x[modal] = false;
    this.setState(x);
    this.clearForm();
  };


  handleRequestBalance = () => {
    const { drizzleApis } = this.props;
    if (this.state.totalBalanceDataKey) return;

    const loggedInAccount = this.props.drizzleApis.getLoggedInAccount();
    const dataKey = drizzleApis.requestTotalBalance(loggedInAccount);
    if (dataKey) {
      this.setState({ totalBalanceDataKey: dataKey });
      //setInterval(this.printBalance, 3000);
    }
  };


  printBalance = () => {
    const { drizzleApis } = this.props;
    //console.log("printBalance", this.state.totalBalanceDataKey);
    if (this.state.totalBalanceDataKey) {
      let balance = drizzleApis.getTotalBalance(this.state.totalBalanceDataKey);
      //console.log("Print Balance on data key", this.state.totalBalanceDataKey, balance);
      return balance;
    }
    return 0;
  };


  refresh = () => {
    document.location.reload();
  };


  render() {
    const { classes, drizzleApis, dataKey, ...rest  } = this.props;
    const loggedInAccount = this.props.drizzleApis.getLoggedInAccount();
    const balanceOf = (this.printBalance() * 1).toFixed(2);
    if (!drizzleApis.isExistDocument(dataKey))  return null;

    return (
      <span>
              <div className="vote-btn" title="Vote on this document"
                   onClick={() => this.handleClickOpen("classicModal")}>
                  <i className="material-icons">how_to_vote</i>
              </div>


            <Dialog
              fullWidth={this.state.fullWidth}
              open={this.state.classicModal}
              TransitionComponent={Transition}
              keepMounted
              aria-labelledby="classic-modal-slide-title"
              aria-describedby="classic-modal-slide-description">


              <DialogTitle
                id="classic-modal-slide-title"
                disableTypography
                className={classes.modalHeader}>
                <i className="material-icons modal-close-btn" onClick={() => this.handleClose("classicModal")}>close</i>
                <h3 className={classes.modalTitle}>Vote on document</h3>
              </DialogTitle>


              <DialogContent id="classic-modal-slide-description" className={classes.modalBody}>
              <h4>1. Total amount of tokens voted</h4>
              <ul className="voteList">
                <li><strong>You : </strong><CuratorDepositOnUserDocument document={this.props.document}
                                                                         drizzleApis={drizzleApis}
                                                                         deposit={this.state.deposit} {...rest}
                                                                         loggedInAccount={loggedInAccount}/></li>
                <li><strong>Total : </strong><CuratorDepositOnDocument document={this.props.document}
                                                                       drizzleApis={drizzleApis}
                                                                       deposit={this.state.deposit} {...rest}
                                                                       loggedInAccount={loggedInAccount}/></li>
              </ul>

          <h4>2. Amount of available tokens</h4>
          <ul className="voteList">
              <li><Tooltip title={this.props.drizzleApis.deckToDollar(balanceOf)}
                           placement="bottom"><span>{balanceOf + " DECK"}</span></Tooltip></li>
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
                  onChange: this._onChangeDeposit
                }}

              />
          </div>
              <p className="notiTxt mt-4">Note: The token used for voting can be withdrawn after 3 days.</p>
              </DialogContent>


              <DialogActions className="modal-footer">
                <div onClick={() => this.handleClose("classicModal")} className="cancel-btn">Cancel</div>
                <div onClick={() => this.onUploadDoc()} className="ok-btn">Commit</div>
              </DialogActions>
              <div className="progress-modal" id="progressModal">
                <div className="progress-modal-second">
                  <span className="progress-percent">{this.state.percentage}%</span>
                  <img src={require("assets/image/common/g_progress_circle.gif")} alt="progress circle"/>
                </div>
              </div>
            </Dialog>
      </span>
    );
  }
}

export default withStyles(style)(VoteDocument);
