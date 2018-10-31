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

  drizzleApis = new DrizzleApis(this.props.drizzle);

  state = {
    totalBalanceDataKey: null,
    estimatedDataKey: null,
    revenueDataKey: null,
    totalBalance: 0,
  };

  handleRequestBalance = () => {
    const dataKey = this.drizzleApis.requestTotalBalance();
    if(dataKey){
      //console.log("handleRequestBalance", dataKey);
      this.setState({totalBalanceDataKey: dataKey});
      //setInterval(this.printBalance, 3000);
    }

  }

  printBalance = () => {
    const {drizzle, drizzleState} = this.props;
    //console.log("printBalance", this.state.totalBalanceDataKey);
    if(drizzleState && this.state.totalBalanceDataKey) {

      const balance = this.drizzleApis.getTotalBalance(this.state.totalBalanceDataKey);
    //  console.log("Print Balance on data key", this.state.totalBalanceDataKey, balance);
      return balance;
    }

    return "-";
  }

  componentDidMount(){

  }


  render() {
    const {classes, nickname, drizzle, drizzleState} = this.props;

    if(drizzleState && !this.state.totalBalanceDataKey){
      this.handleRequestBalance();
    }
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
                        <li>Revenue for the last 3 days :</li>
                    </ul>
                </div>
            </div>
        </div>

    );
  }
}

export default withStyles(style)(AuthorSummary);
