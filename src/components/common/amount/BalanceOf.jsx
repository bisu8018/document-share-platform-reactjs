import React from "react";
import Common from "../../../util/Common";


class BalanceOf extends React.Component {

  render() {
    const { balance } = this.props;
    let balanceDollarStr = "$ " + Common.toDollar(balance.toString());
    let balanceDeckStr = (balance >= 0 ?  Common.toDeck(balance) : 0).toFixed(2) + " DECK";

    return (
      <div className="d-inline">
        <span className="balance-of-dollar"> {balanceDollarStr} </span>
        <span className="balance-of-deck"> ({balanceDeckStr}) </span>
      </div>
    );
  }
}

export default BalanceOf;
