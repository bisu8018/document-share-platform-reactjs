import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Common from "../../util/Common";

const style = {
  balance: {
    color: "inherit",
    fontSize: "20px",
    fontWeight: "400",
  },
  reward: {
    color: "#inherit",
    fontSize: "20px",
    fontWeight: "400",
  },
  deck: {
    color: "inherit",
    fontSize: "16px",
    fontWeight: "400",
  },
  dollar: {
    color: "#2ACF1C",
    fontSize: "20px",
    fontWeight: "600"
  }
};

class BalanceOf extends React.Component {

  render() {
    const { balance } = this.props;
    let balanceDollarStr = "$ " + Common.toDollar(balance.toString());
    let balanceDeckStr = (balance >= 0 ?  Common.toDeck(balance) : 0).toFixed(2) + " DECK";

    return (
      <div className="d-inline">
        <span className={this.props.classes.balance}> {balanceDollarStr} </span>
        <span className={this.props.classes.deck}> ({balanceDeckStr}) </span>
      </div>
    );
  }
}

export default withStyles(style)(BalanceOf);
