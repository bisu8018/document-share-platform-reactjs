import React from "react";
import Common from "../../../common/common";


class BalanceOf extends React.Component {

  render() {
    const { balance } = this.props;
    let _balance = balance || 0;
    let balanceDollarStr = "$ " + Common.toDollar(_balance.toString()).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
