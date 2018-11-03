import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Badge from "components/Badge/Badge.jsx";
import ContentList from "contents/ContentList";
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from 'react-spinkit';
import { Link } from 'react-router-dom';
import * as restapi from 'apis/DocApi';
import DrizzleApis from 'apis/DrizzleApis';
const style = {

};

class AuthorSummary extends React.Component {

  state = {
    totalBalanceDataKey: null,
    totalBalance: 0
  };

  handleRequestBalance = () => {
    const {drizzleApis, drizzleState} = this.props;
    if(this.state.totalBalanceDataKey) return;

    const dataKey = drizzleApis.requestTotalBalance();
    if(dataKey){
      //console.log("handleRequestBalance", dataKey);
      this.setState({totalBalanceDataKey: dataKey});
      //setInterval(this.printBalance, 3000);

      //const balance = drizzleApis.getTotalBalance(dataKey);
      //console.log("balance", balance);
    }

  }

  printBalance = () => {
    const {drizzleApis, drizzleState} = this.props;
    //console.log("printBalance", this.state.totalBalanceDataKey);
    if(this.state.totalBalanceDataKey) {

      const balance = drizzleApis.getTotalBalance(this.state.totalBalanceDataKey);
    //  console.log("Print Balance on data key", this.state.totalBalanceDataKey, balance);
      return balance;
    }

    return "-";
  }

  shouldComponentUpdate(nextProps, nextState) {

    this.handleRequestBalance();

    return true;
  }


  render() {
    const {classes, nickname, drizzleApis, drizzleState, totalRevenue} = this.props;

    if(!drizzleApis.isAuthenticated()) return "Loading";


    const totalBalance = this.printBalance();
    return (
        <div>
            <h3 style={{margin:'0',fontSize:'26px'}} >My Wallet</h3>
            <div className="customGrid">
                <div className="box">
                    <h4>{nickname}</h4>
                    <ul className="detailList">
                        <li>Total balance : {totalBalance} DECK</li>
                        <li>Estimated earnings for today : </li>
                        <li>Revenue for the last 3 days : {totalRevenue} DECK</li>
                    </ul>
                </div>
            </div>
        </div>

    );
  }
}

export default withStyles(style)(AuthorSummary);
