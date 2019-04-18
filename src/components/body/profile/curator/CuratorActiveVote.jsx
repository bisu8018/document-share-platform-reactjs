import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Common from "../../../../util/Common";

class CuratorActiveVote extends React.Component {
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
    const textDeck = Common.toDeck(activeVote ? activeVote : 0).toFixed(2) + " DECK";
    const textDollar = "$" + Common.toDollar(activeVote).toFixed(1);

    return (
      <span>
       <Tooltip title={textDollar} placement="bottom">
        <span >{textDeck} ($ {Common.toDollar(activeVote)})</span>
      </Tooltip>
    </span>
    );
  }
}

export default CuratorActiveVote;
