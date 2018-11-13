import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Badge from "components/Badge/Badge.jsx";
import ContentList from "contents/ContentList";
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from 'react-spinkit';
import { Link } from 'react-router-dom';
import * as restapi from 'apis/DocApi';
import DrizzleApis from 'apis/DrizzleApis';
import Web3Apis from 'apis/Web3Apis';
import AuthorEstimatedToday from 'profile/AuthorEstimatedToday'
import BalanceOf from './BalanceOf'
import DollarWithDeck from './DollarWithDeck'
const style = {
  authorReward: {
    float: "left",
    paddingLeft: "10px",
    paddingTop: "0px",
    paddingRight: "10px",
    paddingBottom: "0px",
    margin: "0px"
  },
  curatorReward: {
    float: "left",
    paddingLeft: "50px",
    paddingTop: "0px",
    paddingRight: "10px",
    paddingBottom: "0px",
    margin: "0px"
  },
  clear: {
    clear: "both"
  }
};

class AuthorSummary extends React.Component {

  state = {
    totalBalanceDataKey: null,
    totalAuthor3DayReward: 0,
    authorEstimatedToday: 0,
    curatorEstimatedToday: 0,
    todayVotedDocuments: null,
    totalViewCount:null,
    balance:-1
  };

  web3Apis = new Web3Apis();


  getBalance = () => {
    const {drizzleApis, drizzleState, accountId} = this.props;

    if(this.state.balance <0){
      this.web3Apis.getBalance(accountId).then((data) => {
        //console.log("balance", data)
        this.setState({balance: Number(data)});
      }).catch((err) => {

      })
    }

  }

  getCalculateAuthorReward = () => {
    const {drizzleApis, documentList, accountId, totalViewCountInfo} = this.props;
    let viewCount = 0;
    let totalAuthor3DayReward = 0;
    for(const idx in documentList) {
      const document = documentList[idx];
      viewCount += document.viewCount;
      totalAuthor3DayReward += document.confirmAuthorReward;
    }

    if(totalAuthor3DayReward >this.state.totalAuthor3DayReward){
      this.setState({totalAuthor3DayReward: totalAuthor3DayReward});
    }


    if(!this.state.authorEstimatedToday && totalViewCountInfo){
      const address = accountId;//drizzleApis.getLoggedInAccount();
      this.web3Apis.getCalculateAuthorReward(address, viewCount, totalViewCountInfo.totalViewCount).then((data) =>{
        this.setState({authorEstimatedToday: data});

      }).catch((err) => {
        console.error(err);
      });
    }


  }

  shouldComponentUpdate(nextProps, nextState) {

    const {drizzleApis, drizzleState} = this.props;

    //this.handleRequestBalance();
    //if(drizzleApis.isAuthenticated()){
      this.getBalance()
      this.getCalculateAuthorReward();
    //}

    return true;
  }

  safeNumber = (num) => {
    return (typeof num == 'number') ? num : 0;
  }


  render() {
    const {classes, accountId, drizzleApis, totalAuthor3DayReward, totalCurator3DayReward, totalCuratorEstimateRewards, ...others} = this.props;

/*
    if(!drizzleApis.isAuthenticated()) return (
      <h3 style={{margin:'0',fontSize:'26px'}}>Account
        <span style={{margin:'0',fontSize:'18px',color:'555'}}> : {accountId}</span>
      </h3>
    );
*/
    const loggedInAccount = accountId;

    // Values in DECK
    const balance = drizzleApis.toEther(this.state.balance);
    const author3DayReward = drizzleApis.toEther(this.state.totalAuthor3DayReward);
    const authorTodayReward = drizzleApis.toEther(this.state.authorEstimatedToday);
    const curator3DayReward = drizzleApis.toEther(totalCurator3DayReward);
    const curatorTodayReward = drizzleApis.toEther(totalCuratorEstimateRewards);

    let sumReward = 0;
    sumReward += this.safeNumber(author3DayReward);
    sumReward += this.safeNumber(authorTodayReward);
    sumReward += this.safeNumber(curator3DayReward);
    sumReward += this.safeNumber(curatorTodayReward);

    //console.log('author3DayReward:' + author3DayReward);
    //console.log('authorTodayReward:' + authorTodayReward);
    //console.log('curator3DayReward:' + curator3DayReward);
    //console.log('curatorTodayReward:' + curatorTodayReward);

    return (
      <div>
        <h3 style={{margin:'0',fontSize:'26px'}}>Account
          <span style={{margin:'0',fontSize:'18px',color:'555'}}> : {accountId}</span>
        </h3>
        <ul className="detailList">
            <li><BalanceOf balance={this.state.balance} sumReward={sumReward} drizzleApis={drizzleApis} {...others}></BalanceOf></li>
        </ul>
        <div className={this.props.classes.authorReward}>
        <h5>Author rewards</h5>
        <ul className="detailList">
            <li>- Today(Est.) : <DollarWithDeck deck={authorTodayReward} drizzleApis={drizzleApis} {...others}/></li>
            <li>- Last 3 days : <DollarWithDeck deck={author3DayReward} drizzleApis={drizzleApis} {...others}/></li>
        </ul>
        </div>
        <div className={this.props.classes.curatorReward}>
        <h5>Curator rewards</h5>
        <ul className="detailList">
          <li>- Today(Est.) : <DollarWithDeck deck={curatorTodayReward} drizzleApis={drizzleApis} {...others}/></li>
          <li>- Last 3 days : <DollarWithDeck deck={curator3DayReward} drizzleApis={drizzleApis} {...others}/></li>
        </ul>
        </div>
        <div className={this.props.classes.clear}></div>
      </div>
    );
  }
}

export default withStyles(style)(AuthorSummary);
