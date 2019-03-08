import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import InfiniteScroll from "react-infinite-scroll-component";
import "react-tabs/style/react-tabs.css";
import Spinner from "react-spinkit";
import { Link } from "react-router-dom";
import LinesEllipsis from "react-lines-ellipsis";

import Web3Apis from "apis/Web3Apis";

import AuthorSummary from "./AuthorSummary";
import CuratorDocumentList from "./CuratorDocumentList.jsx";
import MainRepository from "../../../redux/MainRepository";
import Common from "../../../common/Common";


class Author extends React.Component {
  state = {
    resultList: [],
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

  componentWillMount() {
    this.fetchDocuments();
  }

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

  fetchMoreData = () => {
    this.fetchDocuments({
      pageNo: this.state.pageNo + 1
    });
  };

  fetchDocuments = (params) => {
    const { match } = this.props;
    const accountId = match.params.accountId;
    const pageNo = (!params || isNaN(params.pageNo)) ? 1 : Number(params.pageNo);
    MainRepository.Document.getDocumentList({ accountId: accountId, pageNo: pageNo }, (res) => {
      let resData = res;
      if (resData && resData.resultList) {
        if (this.state.resultList) {
          this.setState({
            resultList: this.state.resultList.concat(resData.resultList),
            pageNo: resData.pageNo,
            totalViewCountInfo: resData.totalViewCountInfo
          });
        } else {
          this.setState({
            resultList: resData.resultList,
            pageNo: resData.pageNo,
            totalViewCountInfo: resData.totalViewCountInfo
          });
        }
        if (resData.count === 0) {
          this.setState({ isEndPage: true });
        }
      }
    });
  };

  render() {
    const { drizzleApis, match } = this.props;
    const accountId = match.params.accountId;
    return (

      <div className="row">
        <div className="col-sm-12 col-lg-10 offset-lg-1 u__center profile-center">


          <AuthorSummary totalReward={this.state.totalReward}
                         totalCurator3DayReward={this.state.totalCurator3DayReward}
                         totalCuratorEstimateRewards={this.state.totalCuratorEstimateRewards}
                         drizzleApis={drizzleApis}
                         documentList={this.state.resultList}
                         curatorDocumentList={this.state.curatorDocumentList}
                         totalViewCountInfo={this.state.totalViewCountInfo}
                         accountId={accountId}/>

          <Tabs forceRenderTabPanel={true}>
            <TabList>
              <Tab>Uploaded</Tab>
              <Tab>Voted</Tab>
            </TabList>

            <TabPanel>
              <h3 style={{ margin: "20px 0 0 0", fontSize: "26px" }}>{this.state.resultList.length} shared
                documents </h3>
              <InfiniteScroll
                dataLength={this.state.resultList.length}
                next={this.fetchMoreData}
                hasMore={!this.state.isEndPage}
                loader={<div className="spinner"><Spinner name="ball-pulse-sync"/></div>}>


                {this.state.resultList.map((result) => (
                  <div className="row u_center_inner" key={result.documentId}>

                    <div className="col-sm-3 col-md-3 col-thumb">
                      <Link to={"/content/view/" + result.documentId}>
                        <div className="thumb_image">
                          <img src={Common.getThumbnail(result.documentId, 1, result.documentName)}
                               alt={result.title ? result.title : result.documentName} className="img-fluid"/>
                        </div>
                      </Link>
                    </div>

                    <div className="col-sm-9 col-md-9 col-details_info">
                      <dl className="details_info">
                        <dt className="blind">info desc</dt>
                        <dd className="info_btn">
                          <div className="claim-btn">CLAIM $ 1,222
                          </div>
                        </dd>
                        <Link to={"/content/view/" + result.documentId}>
                          <dd className="info_title">  {result.title ? result.title : result.documentName} </dd>
                        </Link>
                        <Link to={"/author/" + result.accountId} className="info_name">
                          <i className="material-icons img-thumbnail">face</i>
                          {result.nickname ? result.nickname : result.accountId}
                        </Link>
                        <span className="info_date">
                             {Common.dateAgo(result.created) === 0 ? "Today" : Common.dateAgo(result.created) + " days ago"}
                          </span>
                        <Link to={"/content/view/" + result.documentId} className="info_desc">
                          <LinesEllipsis
                            text={result.desc}
                            maxLine='2'
                            ellipsis='...'
                            trimRight
                            basedOn='letters'
                          />
                        </Link>
                      </dl>
                    </div>
                  </div>
                ))}
              </InfiniteScroll>
            </TabPanel>

            <TabPanel>
              <CuratorDocumentList
                {...this.props}
                handleCurator3DayRewardOnDocuments={this.handleCurator3DayRewardOnDocuments}
                totalViewCountInfo={this.state.totalViewCountInfo}
                accountId={accountId}
              />
            </TabPanel>

          </Tabs>

        </div>
      </div>

    );
  }
}

export default Author;
