import React from "react";
import Common from "../../../config/common";

class ActiveVote extends React.Component {
  state = {
    curatorRewardOnUserDocument: 0,
    anchorEl: null,
    open: false
  };

  componentWillMount() {
    const { documentData, getWeb3Apis } = this.props;
    getWeb3Apis.getActiveVotes(documentData.documentId).then((data) => {
      this.setState({ curatorRewardOnUserDocument: data });
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
    const activeVote = this.state.curatorRewardOnUserDocument;
    const textDeck = Common.toDeck(activeVote ? activeVote : 0).toFixed(2);
    const textDollar = Common.toDollar(activeVote).toFixed(1);

    return (
      <span>
        <span className="color-main-color font-weight-bold">{textDeck}</span> DECK
        ($ <span className="color-main-color">{textDollar}</span>)
        </span>
    );
  }
}

export default ActiveVote;
