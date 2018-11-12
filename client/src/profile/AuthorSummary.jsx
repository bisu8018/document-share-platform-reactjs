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
    totalBalance: 0,
    totalViewCountInfo: null,
    authorEstimatedToday: 0,
    curatorEstimatedToday: 0,
    todayVotedDocuments: null,
    totalViewCount:null

  };

  web3Apis = new Web3Apis();

  fetchDocuments = (params) => {
      const {classes, accountId} = this.props;
      restapi.getTodayVotedDocumentsByCurator({accountId:accountId}).then((res)=>{
        //console.log("Fetch getTodayVotedDocumentsByCurator Document", res.data);
        if(res.data){
          const todayVotedDocuments = res.data.todayVotedDocuments;
          const totalViewCount = res.data.totalViewCount[0];
          this.setState({todayVotedDocuments: todayVotedDocuments, totalViewCount: totalViewCount});

          console.log(todayVotedDocuments, totalViewCount);
          for(const i in todayVotedDocuments){
            const document = todayVotedDocuments[i].documentInfo;
            console.log(document);
            this.setState({curatorEstimatedToday: this.state.curatorEstimatedToday + Number(isNaN(document.voteAmount)?0:document.voteAmount)});
          }
        }
      });

  }
/*
  getCuratorEstimatedToday = (curatorId, documentId, viewCount, totalTodayViewCount) => {
    const {classes, accountId} = this.props;


    Web3Apis.calculateCuratorReward(curatorId, documentId, viewCount, totalTodayViewCount).then((data) => {
      console.log("get Today Curator' Estimated reward  in blockchain", data);
      //this.setState({curatorEstimatedToday: this.state.curatorEstimatedToday + Number(data)});
    }).catch((err) => {
      console.error(err);
    })
  }
*/
  componentWillMount() {
    const {drizzleApis} = this.props;

    this.fetchDocuments();
  }

  handleRequestBalance = () => {

    const {drizzleApis, drizzleState, accountId} = this.props;
    if(this.state.totalBalanceDataKey) return;

    const dataKey = drizzleApis.requestTotalBalance(accountId);
    if(dataKey){
      //console.log("handleRequestBalance", dataKey);
      this.setState({totalBalanceDataKey: dataKey});
      //setInterval(this.printBalance, 3000);

      //const balance = drizzleApis.getTotalBalance(dataKey);
      //console.log("balance", balance);
    }

  }

  getCalculateAuthorReward = () => {
    const {drizzleApis, documentList, accountId, totalViewCountInfo} = this.props;
    if(this.state.authorEstimatedToday || !totalViewCountInfo) return;

    let viewCount = 0;
    for(const idx in documentList) {
      const document = documentList[idx];
      viewCount += document.viewCount;
    }

    this.web3Apis.getCalculateAuthorReward(accountId, viewCount, totalViewCountInfo.totalViewCount).then((data) =>{
      this.setState({authorEstimatedToday: data});

    }).catch((err) => {
      console.error(err);
    });

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
    if(this.props.drizzleApis != null && this.props.drizzleApis.isAuthenticated()){
      this.getCalculateAuthorReward();
    }
    return true;
  }

  render() {
    const {classes, accountId, drizzleApis, totalRevenue, totalReward} = this.props;

    if(!drizzleApis.isAuthenticated()) return (
      <h3 style={{margin:'0',fontSize:'26px'}}>Account
        <span style={{margin:'0',fontSize:'18px',color:'555'}}> : {accountId}</span>
      </h3>
    );

    const loggedInAccount = drizzleApis.getLoggedInAccount();
    const myAccount = loggedInAccount == accountId ? accountId : null;

    // Values in DECK
    const balance = drizzleApis.toEther(this.printBalance());
    const author3DayReward = drizzleApis.toEther(totalRevenue);
    const authorTodayReward = drizzleApis.toEther(this.state.authorEstimatedToday);
    const curator3DayReward = drizzleApis.toEther(totalReward);
    const curatorTodayReward = drizzleApis.toEther(this.state.curatorEstimatedToday);
    const sumReward = author3DayReward + authorTodayReward + curator3DayReward + curatorTodayReward;

    return (
      <div>
        <h3 style={{margin:'0',fontSize:'26px'}}>Account
          <span style={{margin:'0',fontSize:'18px',color:'555'}}> : {accountId}</span>
        </h3>
        <ul className="detailList">
            <li><BalanceOf balance={balance} sumReward={sumReward} {...this.props}></BalanceOf></li>
        </ul>
        <div className={this.props.classes.authorReward}>
        <h5>Author rewards</h5>
        <ul className="detailList">
            <li>- Today(Est.) : <DollarWithDeck deck={authorTodayReward} {...this.props}/></li>
            <li>- Last 3 days : <DollarWithDeck deck={author3DayReward} {...this.props}/></li>
        </ul>
        </div>
        <div className={this.props.classes.curatorReward}>
        <h5>Curator rewards</h5>
        <ul className="detailList">
          <li>- Today(Est.) : <DollarWithDeck deck={curatorTodayReward} {...this.props}/></li>
          <li>- Last 3 days : <DollarWithDeck deck={curator3DayReward} {...this.props}/></li>
        </ul>
        </div>
        <div className={this.props.classes.clear}></div>
      </div>
    );
  }
}

export default withStyles(style)(AuthorSummary);
