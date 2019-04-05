import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import Web3Apis from "apis/Web3Apis";

import AuthorSummary from "./AuthorSummary";
import CuratorVoteTab from "../curator/tab/CuratorVoteTab.jsx";
import CuratorUploadTab from "../curator/tab/CuratorUploadTab";
import CuratorAnalyticsTab from "../curator/tab/CuratorAnalyticsTab";
import MainRepository from "../../../../redux/MainRepository";
import Common from "../../../../common/Common";
import Spinner from "react-spinkit";
import NotFoundPage from "../../../../components/common/NotFoundPage";


class Author extends React.Component {
  state = {
    resultList: [],
    userInfo: null,
    errMessage: null,
    curatorDocumentList: [],
    curatorDocumentKeyList: [],
    pageNo: null,
    isEndPage: false,
    totalCurator3DayReward: 0,
    totalCuratorEstimateRewards: 0
  };

  author3DayRewardOnDocuments = [];
  author3DayRewards = [];
  curator3DayRewardOnDocuments = [];
  curator3DayRewards = [];
  curatorEstimateRewards = [];

  web3Apis = new Web3Apis();


  handleTotalAuthor3DayReward = (documentId, revenue) => {

    if (this.author3DayRewardOnDocuments.includes(documentId)) return;

    //console.log("handleTotalAuthor3DayReward", documentId, revenue);
    this.author3DayRewardOnDocuments.push(documentId);
    this.author3DayRewards.push(Number(revenue));
    let totalAuthor3DayRewards = 0;

    for (const idx in this.author3DayRewardOnDocuments) {
      totalAuthor3DayRewards += Number(this.author3DayRewards[idx]);
    }
    //console.log("handleTotalAuthor3DayReward", this.author3DayRewards, "totalAuthor3DayRewards", totalAuthor3DayRewards);
    this.setState({ totalAuthor3DayReward: totalAuthor3DayRewards });
  };

  handleCurator3DayRewardOnDocuments = (documentId, reward, estimateReward) => {

    if (this.curator3DayRewardOnDocuments.includes(documentId)) return;

    //console.log("handleCurator3DayRewardOnDocuments", documentId, reward, estimateReward);
    this.curator3DayRewardOnDocuments.push(documentId);
    this.curator3DayRewards.push(Number(reward));
    this.curatorEstimateRewards.push(Number(estimateReward));
    let totalCurator3DayReward = 0;
    let totalCuratorEstimateRewards = 0;
    //console.log(this.revenues);
    for (const idx in this.curator3DayRewards) {
      totalCurator3DayReward += Number(this.curator3DayRewards[idx]);
      totalCuratorEstimateRewards += Number(this.curatorEstimateRewards[idx]);
    }
    //console.log("totalCurator3DayReward", totalCurator3DayReward, this.web3Apis.toDeck(totalCurator3DayReward));
    //console.log("totalCuratorEstimateRewards", totalCuratorEstimateRewards);
    this.setState({
      totalCurator3DayReward: totalCurator3DayReward,
      totalCuratorEstimateRewards: totalCuratorEstimateRewards
    });
  };

  getParam = () => {
    let pathArr = window.location.pathname.split("/");
    return decodeURI(pathArr[1]);
  };

  componentWillMount(): void {
    const { myInfo } = this.props;

    let presentValue = this.getParam();
    let params = {};

    if(myInfo.username !== presentValue && myInfo.email !== presentValue && myInfo.sub !== presentValue) {
      if(Common.checkEmailForm(presentValue)) params = {email : presentValue};
      else params = {username : presentValue};

      MainRepository.Account.getProfileInfo(params, result => {
        this.setState({ userInfo: result, errMessage : null });
      }, err =>{
        this.setState({ userInfo: null, errMessage: err });
      });
    }else{
      this.setState({ userInfo: myInfo, errMessage : null });
    }
  }

  render() {
    const { drizzleApis, myInfo } = this.props;
    const { userInfo, errMessage } = this.state;

    let param = this.getParam();

    return (

      <div className="row">

        <div className="col-sm-12 col-lg-10 offset-lg-1 u__center profile-center">

          {userInfo &&
          <AuthorSummary totalReward={this.state.totalReward}
                         totalCurator3DayReward={this.state.totalCurator3DayReward}
                         totalCuratorEstimateRewards={this.state.totalCuratorEstimateRewards}
                         drizzleApis={drizzleApis}
                         documentList={this.state.resultList}
                         curatorDocumentList={this.state.curatorDocumentList}
                         totalViewCountInfo={this.state.totalViewCountInfo}
                         userInfo={userInfo}/>
          }
          {!userInfo && !errMessage && <div className="spinner"><Spinner name="ball-pulse-sync"/></div>}
          {errMessage && <NotFoundPage errMessage={ errMessage }/>}
          {userInfo &&
          <Tabs forceRenderTabPanel={true}>
            <TabList>
              <Tab>Uploaded</Tab>
              <Tab>Voted</Tab>
              {(param === myInfo.username || param === myInfo.email || param === Common.getMySub()) && <Tab>Analytics</Tab>}
            </TabList>

            <TabPanel>
              <CuratorUploadTab
                drizzleApis={drizzleApis}
                userInfo={userInfo}
              />
            </TabPanel>

            <TabPanel>
              <CuratorVoteTab
                {...this.props}
                handleCurator3DayRewardOnDocuments={this.handleCurator3DayRewardOnDocuments}
                totalViewCountInfo={this.state.totalViewCountInfo}
                accountId={param}
              />
            </TabPanel>

            {(param === myInfo.username || param === myInfo.email || param === Common.getMySub()) &&
            <TabPanel>
              <CuratorAnalyticsTab
                userInfo={userInfo}
              />
            </TabPanel>

            }
          </Tabs>
          }
        </div>
      </div>

    );
  }
}

export default Author;
