import React from "react";
import Web3Apis from "apis/Web3Apis";

import withStyles from "@material-ui/core/styles/withStyles";

import BalanceOf from "./BalanceOf";
import DollarWithDeck from "../../../../components/common/DollarWithDeck";

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
    totalViewCount: null,
    balance: -1
  };

  web3Apis = new Web3Apis();


  getBalance = () => {
    const { accountId } = this.props;

    if (this.state.balance < 0) {
      this.web3Apis.getBalance(accountId).then((data) => {
        this.setState({ balance: Number(data) });
      }).catch((err) => {

      });
    }
  };

  getCalculateAuthorReward = () => {
    const { documentList, accountId, totalViewCountInfo } = this.props;
    let viewCount = 0;
    let totalAuthor3DayReward = 0;
    const blockchainTimestamp = this.web3Apis.getBlockchainTimestamp(new Date());
    for (const idx in documentList) {
      const document = documentList[idx];
      if (!isNaN(document.viewCountUpdated) && document.viewCountUpdated > blockchainTimestamp) {
        const docViewCount = isNaN(document.viewCount) ? 0 : Number(document.viewCount);
        viewCount += docViewCount;
        //console.log("viewCount", document.documentId, docViewCount, viewCount);
      }

      totalAuthor3DayReward += isNaN(document.confirmAuthorReward) ? 0 : Number(document.confirmAuthorReward);

    }
    if (totalAuthor3DayReward > this.state.totalAuthor3DayReward) {
      this.setState({ totalAuthor3DayReward: totalAuthor3DayReward });
    }


    if (!this.state.authorEstimatedToday && totalViewCountInfo) {
      const address = accountId;
      this.web3Apis.getCalculateAuthorReward(address, viewCount, totalViewCountInfo.totalViewCount).then((data) => {
        this.setState({ authorEstimatedToday: data });

      }).catch((err) => {
        console.error(err);
      });
    }


  };

  shouldComponentUpdate(nextProps, nextState) {
    this.getBalance();
    this.getCalculateAuthorReward();

    return true;
  }

  safeNumber = (num) => {
    return (typeof num == "number") ? num : 0;
  };


  render() {
    const { classes, accountId, drizzleApis, totalAuthor3DayReward, totalCurator3DayReward, totalCuratorEstimateRewards, ...others } = this.props;

    /*
        if(!drizzleApis.isAuthenticated()) return (
          <h3 style={{margin:'0',fontSize:'26px'}}>Account
            <span style={{margin:'0',fontSize:'18px',color:'555'}}> : {accountId}</span>
          </h3>
        );
    */
    // const loggedInAccount = accountId;

    // Values in DECK
    //const balance = drizzleApis.toEther(this.state.balance);
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

      <div className="profile_container">
        <div className="row  profile_top">
          <div className="col-12 col-sm-3 ">
            <div className="thumb_image">
              <img src={require("assets/image/tempImg/profile.jpg")} alt="profile" className="img-fluid"/>
            </div>
          </div>
          <div className="col-12 col-sm-9 ">
            <div className="profile_info_name">
              <strong>Account : {accountId}</strong>
            </div>
            <div className="profile_info_desc">
              * Total balance : <span className="color"><BalanceOf balance={this.state.balance} sumReward={sumReward}
                                                                   drizzleApis={drizzleApis} {...others}/></span>
              <br/>* Estimated earnings for today : <span className="color"><DollarWithDeck deck={authorTodayReward}
                                                                                            drizzleApis={drizzleApis} {...others}/></span>
              <br/>* Revenue for the last 7 days : <span className="color"> $0.00 </span>
            </div>
          </div>
        </div>
        <div className="row">
        <div className=" profile_creator col-sm-12 col-md-6">
          <h5>Author rewards</h5>
          <div className="profile_info_desc">
            * Estimated earnings for today : <span><DollarWithDeck deck={authorTodayReward}
                                                                   drizzleApis={drizzleApis} {...others}/></span>
            <br/>* Revenue for the last 7 days : <span><DollarWithDeck deck={author3DayReward}
                                                                       drizzleApis={drizzleApis} {...others}/></span>
          </div>
        </div>
        <div className=" profile_creator col-sm-12 col-md-6">
          <h5>Curator rewards</h5>
          <div className="profile_info_desc">
            * Estimated earnings for today : <span><DollarWithDeck deck={curatorTodayReward}
                                                                   drizzleApis={drizzleApis} {...others}/></span>

            <br/>* Revenue for the last 7 days : <span><DollarWithDeck deck={curator3DayReward}
                                                                       drizzleApis={drizzleApis} {...others}/></span>
          </div>
        </div>
        </div>
        <div className={this.props.classes.clear}/>
      </div>
    );
  }
}

export default withStyles(style)(AuthorSummary);
