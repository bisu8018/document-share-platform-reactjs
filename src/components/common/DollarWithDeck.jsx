import React from "react";
import Tooltip from "@material-ui/core/Tooltip/index";
import Common from "../../util/Common";

class DollarWithDeck extends React.Component {

  render() {
    const { deck } = this.props;
    let deckStr = (!deck ? 0 : deck) + " DECK";
    let dollarStr = Common.deckToDollar(deck);

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
