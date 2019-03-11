import React from "react";

import Web3Apis from 'apis/Web3Apis';

import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from '@material-ui/core/Tooltip';

const style = {
};

class DollarWithDeck extends React.Component {

  web3Apis = new Web3Apis();

  render() {
    const {drizzleApis, deck} = this.props;

    const deckStr = deck.toFixed(2) + " DECK";
    const dollarStr = drizzleApis.deckToDollar(deck).toFixed(2);

    return (
      <Tooltip title={deckStr} placement="bottom">
        <span className={this.props.classes.dollar}>${dollarStr}</span>
      </Tooltip>
    );
  }
}

export default withStyles(style)(DollarWithDeck);
