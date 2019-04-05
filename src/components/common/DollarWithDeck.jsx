import React from "react";
import Web3Apis from "apis/Web3Apis";
import Tooltip from "@material-ui/core/Tooltip";

class DollarWithDeck extends React.Component {

  web3Apis = new Web3Apis();

  render() {
    const { drizzleApis, deck } = this.props;

    const deckStr = (deck.toFixed(2) === "NaN" ? 0 : deck.toFixed(2)) + " DECK";
    const dollarStr = drizzleApis.deckToDollar(deck).toFixed(2);

    return (
      <Tooltip title={"Creator payout $" + dollarStr + " (" + deckStr + ") \n in 7 days"} placement="bottom">
        <span>
          $ {dollarStr}
        </span>
      </Tooltip>
    );
  }
}

export default DollarWithDeck;
