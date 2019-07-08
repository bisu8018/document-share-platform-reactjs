import React from "react";
import Common from "../../../config/common";

class UserActiveVote extends React.Component {

  state = {
    userActiveVote: 0,
    anchorEl: null,
    open: false
  };

  componentWillMount() {
    const { documentData, handleRewardOnDocuments, loggedInAccount, getWeb3Apis } = this.props;
    getWeb3Apis.getUserActiveVotes(loggedInAccount, documentData.documentId).then((data) => {
      this.setState({ userActiveVote: data });
      if (handleRewardOnDocuments) {
        handleRewardOnDocuments(documentData.documentId, data);
      }
    });
  }

  handleClick = event => {
    const { currentTarget } = event;
    this.setState(state => ({
      anchorEl: currentTarget,
      open: !state.open
    }));
  };

  handleClose = () => {
    if (!this.state.open) {
      return;
    }
    this.setState({ open: false });
  };

  render() {
    const userActiveVote = this.state.userActiveVote;
    const textDeck = Common.toEther(userActiveVote ? userActiveVote : 0).toFixed(2);
    const textDollar = Common.toDollar(userActiveVote).toFixed(1);

    return (
      <span>
        <span className="color-main-color font-weight-bold">{textDeck}</span> DECK
        ($ <span className="color-main-color">{textDollar}</span>)
        </span>
    );
  }
}

export default UserActiveVote;
