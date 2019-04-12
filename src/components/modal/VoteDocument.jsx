import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog/index";
import DialogTitle from "@material-ui/core/DialogTitle/index";
import DialogContent from "@material-ui/core/DialogContent/index";
import DialogActions from "@material-ui/core/DialogActions/index";
import Tooltip from "@material-ui/core/Tooltip/index";
import Slide from "@material-ui/core/Slide/index";

import CustomInput from "../common/CustomInput.jsx";
import MainRepository from "../../redux/MainRepository";
import CuratorDepositOnUserDocument from "../body/profile/curator/CuratorDepositOnUserDocument";
import CuratorDepositOnDocument from "../body/profile/curator/CuratorDepositOnDocument";


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

  onChangeDeposit = (e) => {
    this.setState({ deposit: e.target.value });
  };

  clearVoteInfo = () => {
    this.setState({
      approve: { stackId: -1, done: false, voteOpening: false, receipt: null },
      vote: { stackId: -1, done: false, complete: false, receipt: null },
      deposit: 0
    });
    document.getElementById("deposit").value = null;
  };

  sendVoteInfo = (transactionResult) => {
    const { documentData, drizzleApis } = this.props;
    let ethAccount = drizzleApis.getLoggedInAccount();
    let curatorId = MainRepository.Account.getMyEmail();
    let voteAmount = drizzleApis.fromWei(this.state.deposit);
    MainRepository.Document.sendVoteInfo(ethAccount, curatorId, voteAmount, documentData, transactionResult, () => {
    }, () => {
    });
  };

  onClickVote = () => {
    this.sendVoteInfo();
    this.handleApprove();

    if (this.state.buttonText === "Vote") {
      this.handleClose("classicModal");
    }
  };

  handleApprove = () => {

    const { documentData, drizzleApis } = this.props;
    const deposit = this.state.deposit;

    if (!documentData) return;
    if (!drizzleApis.isAuthenticated()) return;
    if (deposit <= 0) {
      console.error("Deposit must be greater than zero.");
      return;
    }

    drizzleApis.subscribe((drizzle, drizzleState) => {
      if (!this.state.approve.done && this.checkApproveTransaction(this.state.approve.stackId, drizzleState)) {
        const stackId = drizzleApis.voteOnDocument(documentData.documentId, deposit);
        this.setState({ vote: { stackId: stackId } });
      }

      if (this.state.approve.done && this.checkVoteTransaction(this.state.vote.stackId, drizzleState)) {
        this.setState({ buttonText: "Vote" });
        this.clearVoteInfo();
      }

    });

    const stackId = drizzleApis.approve(deposit);
    this.setState({ approve: { stackId: stackId } });

  };

  checkApproveTransaction = (stackId, drizzleState) => {
    let resultBoolean = false;

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
    return resultBoolean;
  };

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


  handleClickOpen = (modal, drizzleApis) => {
    if (drizzleApis && !drizzleApis.isAuthenticated()) return null;

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

  handleLogin = () => {
    MainRepository.Account.login();
  };


  printBalance = () => {
    const { drizzleApis } = this.props;
    if (this.state.totalBalanceDataKey) {
      let balance = drizzleApis.getTotalBalance(this.state.totalBalanceDataKey);
      return balance;
    }
    return 0;
  };


  refresh = () => {
    document.location.reload();
  };

  shouldComponentUpdate = () => {
    const { drizzleApis } = this.props;
    if (!drizzleApis) return false;
    this.handleRequestBalance();
    return true;
  };

  render() {
    const { documentData, dataKey, drizzleApis } = this.props;
    let balanceOf = (this.printBalance() * 1).toFixed(2);
    let isLogin = MainRepository.Account.isAuthenticated();
    if (drizzleApis && (!drizzleApis.isInitialized() || !drizzleApis.isExistDocument(dataKey))) {
      return (
        <div/>
      );
    }
    if (!isLogin) {
      return (
        <Tooltip title="Please, login" placement="bottom">
          <div className="vote-btn" onClick={this.handleLogin.bind(this)}>
            <i className="material-icons">how_to_vote</i>
          </div>
        </Tooltip>
      );
    }

    return (
      <span>
        {(!drizzleApis || !drizzleApis.getLoggedInAccount()) &&
        <Tooltip title="Please, work with MetaMask" placement="bottom">
          <div className="vote-btn">
            <i className="material-icons">how_to_vote</i>
          </div>
        </Tooltip>
        }
        {drizzleApis && drizzleApis.isExistDocument(dataKey) &&
        <Tooltip title="Vote on this document" placement="bottom">
          <div className="vote-btn" onClick={() => this.handleClickOpen("classicModal", drizzleApis)}>
            <i className="material-icons">how_to_vote</i>
          </div>
        </Tooltip>
        }
        {drizzleApis && drizzleApis.getLoggedInAccount() &&
        <Dialog
          fullWidth={this.state.fullWidth}
          open={this.state.classicModal}
          TransitionComponent={Transition}
          keepMounted
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description">


          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography>
            <i className="material-icons modal-close-btn" onClick={() => this.handleClose("classicModal")}>close</i>
            <h3>Vote on document</h3>
          </DialogTitle>


          <DialogContent id="classic-modal-slide-description">
            <h4>1. Total amount of tokens voted</h4>
            <ul className="voteList">
              <li>
                <strong>You : </strong>
                <CuratorDepositOnUserDocument documentData={documentData}
                                              drizzleApis={drizzleApis}
                                              deposit={this.state.deposit}
                                              loggedInAccount={drizzleApis.getLoggedInAccount()}/>
              </li>
              <li>
                <strong>Total : </strong>
                <CuratorDepositOnDocument documentData={documentData}
                                          drizzleApis={drizzleApis}
                                          deposit={this.state.deposit}
                                          loggedInAccount={drizzleApis.getLoggedInAccount()}/>
              </li>
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
                  onChange: this.onChangeDeposit
                }}
              />
            </div>
            <p className="notiTxt mt-4">Note: The token used for voting can be withdrawn after 3 days.</p>
          </DialogContent>


          <DialogActions className="modal-footer">
            <div onClick={() => this.handleClose("classicModal")} className="cancel-btn">Cancel</div>
            <div onClick={() => this.onClickVote()} className="ok-btn">Commit</div>
          </DialogActions>
          <div className="progress-modal" id="progressModal">
            <div className="progress-modal-second">
              <span className="progress-percent">{this.state.percentage}%</span>
              <img src={require("assets/image/common/g_progress_circle.gif")} alt="progress circle"/>
            </div>
          </div>
        </Dialog>
        }
      </span>
    );
  }
}

export default withStyles(style)(VoteDocument);
