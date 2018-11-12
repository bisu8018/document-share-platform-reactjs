import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";

const style = {
};

class DeckInShort extends React.Component {

  render() {
    const {deck} = this.props;

    const deck1m = Math.round((deck * 1) / 1000000) > 0 ? Math.floor((deck * 1) / 100000) / 10 : 0;
    const deck1k = Math.round((deck * 1) / 1000) > 0 ? Math.floor((deck * 1) / 100) / 10 : 0;

    const deckStr = deck1m > 0 ? deck1m.toFixed(1) + "m" : deck1k > 0 ? deck1k + "k" : deck + "";

    return (
      <span>{deckStr}</span>
    );
  }
}

export default withStyles(style)(DeckInShort);
