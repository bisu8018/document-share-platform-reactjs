import React from "react";


class DeckInShort extends React.Component {

  render() {
    const { deck } = this.props;

    let deck1m = Math.round((deck * 1) / 1000000) > 0 ?c(deck * 1) / 100000) / 10 : 0,
      deck1k = Math.round((deck * 1) / 1000) > 0 ? Math.floor((deck * 1) / 100) / 10 : 0,
      deckStr = 0;

    if (deck) deckStr = deck1m > 0 ? deck1m.toFixed(1) + "m" : deck1k > 0 ? deck1k + "k" : deck + "";

    return <span><i className="material-icons thumb-up-icon">thumb_up_alt</i>{deckStr}</span>;
  }
}

export default DeckInShort;
