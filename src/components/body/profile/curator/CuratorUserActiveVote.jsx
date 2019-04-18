import React from "react";
import Common from "../../../../util/Common";

class CuratorUserActiveVote extends React.Component {

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
    const textDeck = Common.toEther(userActiveVote ? userActiveVote : 0).toFixed(2) + " DECK";

    return (
      <span>{textDeck} ($ {Common.toDollar(userActiveVote)})</span>
    );
  }
}

export default CuratorUserActiveVote;
