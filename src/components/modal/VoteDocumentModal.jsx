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
import Common from "../../util/Common";
import CuratorUserActiveVoteContainer from "../../container/body/profile/curator/CuratorUserActiveVoteContainer";
import CuratorActiveVoteContainer from "../../container/body/profile/curator/CuratorActiveVoteContainer";


const style = {
  modalCloseButton: {
    float: "right"
  }
};

const VOTE_STATE = { "START": 1, "APPROVE": 2, "VOTE": 3, "DONE": 4, "COMPLETE": 5, "ERROR": 6 };

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class VoteDocumentModal extends React.Component {

  state = {
    buttonText: "Vote",
    voteState: VOTE_STATE.START,
    approve: { stackId: -1, done: false, voteOpening: false, receipt: null },
    vote: { stackId: -1, done: false, complete: false, receipt: null },
    deposit: 0,
    classicModal: false,
    stackId: null,
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
    const { documentData, getDrizzle } = this.props;
    let ethAccount = getDrizzle.getLoggedInAccount();
    let curatorId = MainRepository.Account.getMyEmail();
    let voteAmount = getDrizzle.fromWei(this.state.deposit);
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

    const { documentData, getDrizzle } = this.props;
    const deposit = this.state.deposit;

    if (!documentData) return;
    if (!getDrizzle.isAuthenticated()) return;
    if (deposit <= 0) {
      console.error("Deposit must be greater than zero.");
      return;
    }

    getDrizzle.subscribe((drizzle, drizzleState) => {
      if (!this.state.approve.done && this.checkApproveTransaction(this.state.approve.stackId, drizzleState)) {
        const stackId = getDrizzle.voteOnDocument(documentData.documentId, deposit);
        this.setState({ vote: { stackId: stackId } });
      }

      if (this.state.approve.done && this.checkVoteTransaction(this.state.vote.stackId, drizzleState)) {
        this.setState({ buttonText: "Vote" });
        this.clearVoteInfo();
      }

    });

    const stackId = getDrizzle.approve(deposit);
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


  handleClickOpen = (modal) => {
    const { getDrizzle } = this.props;
    if (getDrizzle && !getDrizzle.isAuthenticated()) return null;

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

  handleLogin = () => {
    MainRepository.Account.login();
  };

  printBalance = () => {
    const { getWeb3Apis, getDrizzle } = this.props;
    let balance;
    let loggedInAccount = getDrizzle.getLoggedInAccount();
    if(loggedInAccount) {
      getWeb3Apis.getBalance(loggedInAccount, res => {
        balance = res;
      });
    }else{
      balance = 0;
    }
    return balance;
  };

  refresh = () => {
    document.location.reload();
  };

  render() {
    const { documentData, getDrizzle, getIsDocumentExist } = this.props;
    this.printBalance();
    let balanceOf = 0; //this.printBalance() === 0 ? 0 : this.printBalance().toFixed(2);
    let isLogin = MainRepository.Account.isAuthenticated();

    if (getDrizzle && (!getDrizzle.isInitialized() || !getIsDocumentExist)) {
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
        {(!getDrizzle || !getDrizzle.isAuthenticated()) &&
        <Tooltip title="Please, work with MetaMask" placement="bottom">
          <div className="vote-btn">
            <i className="material-icons">how_to_vote</i>
          </div>
        </Tooltip>
        }
        {getDrizzle && getIsDocumentExist &&
        <Tooltip title="Vote on this document" placement="bottom">
          <div className="vote-btn" onClick={() => this.handleClickOpen("classicModal")}>
            <i className="material-icons">how_to_vote</i>
          </div>
        </Tooltip>
        }
        {getDrizzle && getDrizzle.getLoggedInAccount() &&
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
                <CuratorUserActiveVoteContainer documentData={documentData}
                                                deposit={this.state.deposit}
                                                loggedInAccount={getDrizzle.getLoggedInAccount()}/>
              </li>
              <li>
                <strong>Total : </strong>
                <CuratorActiveVoteContainer documentData={documentData}
                                            deposit={this.state.deposit}
                                            loggedInAccount={getDrizzle.getLoggedInAccount()}/>
              </li>
            </ul>

            <h4>2. Amount of available tokens</h4>
            <ul className="voteList">
              <li><Tooltip title={Common.deckToDollar(balanceOf).toFixed(2)}
                           placement="bottom"><span>{balanceOf.toFixed(2) + " DECK"}  ($ {Common.toDollar(balanceOf)})</span></Tooltip></li>
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

export default withStyles(style)(VoteDocumentModal);
