import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Web3Apis from 'apis/Web3Apis';
import DollarWithDeck from './DollarWithDeck';

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

  web3Apis = new Web3Apis();

  render() {
    const {drizzleApis, balance, sumReward} = this.props;

    const balanceDollarStr = '$' + drizzleApis.deckToDollar(balance).toFixed(2);
    const balanceDeckStr = balance.toFixed(2) + ' DECK';

    return (
      <div>
        <span className={this.props.classes.balance}>Balance : {balanceDollarStr} </span>
        <span className={this.props.classes.deck}> ({balanceDeckStr}) </span>
        <div>
          <span className={this.props.classes.reward}>Total rewards : </span>
          <span className={this.props.classes.dollar}> <DollarWithDeck deck={sumReward} {...this.props}/></span>
        </div>
      </div>
    );
  }
}

export default withStyles(style)(BalanceOf);
