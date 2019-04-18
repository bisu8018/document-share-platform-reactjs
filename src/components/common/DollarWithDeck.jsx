import React from "react";
import Tooltip from "@material-ui/core/Tooltip/index";
import Common from "../../util/Common";

class DollarWithDeck extends React.Component {

  render() {
    const { deck } = this.props;

    const deckStr = (deck.toFixed(2) === "NaN" ? 0 : deck.toFixed(2)) + " DECK";
    const dollarStr = Common.deckToDollar(deck).toFixed(2);

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
