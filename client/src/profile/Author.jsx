import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Badge from "components/Badge/Badge.jsx";
import ContentList from "contents/ContentList";
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from 'react-spinkit';
import { Link } from 'react-router-dom';
import * as restapi from 'apis/DocApi';
import AuthorSummary from 'profile/AuthorSummary';
import AuthorRevenueOnDocument from 'profile/AuthorRevenueOnDocument';
import CuratorDocumentList from 'profile/CuratorDocumentList.jsx';
import Web3Apis from 'apis/Web3Apis';
import AuthorClaim from 'profile/AuthorClaim';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
const style = {

};


class Author extends React.Component {

  state = {
    resultList: [],
    curatorDocumentList: [],
    curatorDocumentKeyList: [],
    nextPageKey: null,
    isEndPage:false,
    totalAuthor3DayReward: 0,
    totalCurator3DayReward: 0,
    totalCuratorEstimateRewards: 0
  };

  author3DayRewardOnDocuments = [];
  author3DayRewards = [];

  curator3DayRewardOnDocuments = [];
  curator3DayRewards = [];
  curatorEstimateRewards = [];

  web3Apis = new Web3Apis();

  handleTotalAuthor3DayReward = (documentId, revenue) =>{

    if(this.author3DayRewardOnDocuments.includes(documentId)) return;

    //console.log("handleTotalAuthor3DayReward", documentId, revenue);
    this.author3DayRewardOnDocuments.push(documentId);
    this.author3DayRewards.push(Number(revenue));
    let totalAuthor3DayRewards = 0;

    for(const idx in this.author3DayRewardOnDocuments){
      totalAuthor3DayRewards += Number(this.author3DayRewards[idx]);
    }
    //console.log("handleTotalAuthor3DayReward", this.author3DayRewards, "totalAuthor3DayRewards", totalAuthor3DayRewards);
    this.setState({totalAuthor3DayReward: totalAuthor3DayRewards});


  }

  handleCurator3DayRewardOnDocuments = (documentId, reward, estimateReward) =>{

    if(this.curator3DayRewardOnDocuments.includes(documentId)) return;

    console.log("handleCurator3DayRewardOnDocuments", documentId, reward, estimateReward);
    this.curator3DayRewardOnDocuments.push(documentId);
    this.curator3DayRewards.push(Number(reward));
    this.curatorEstimateRewards.push(Number(estimateReward));
    let totalCurator3DayReward = 0;
    let totalCuratorEstimateRewards = 0;
      //console.log(this.revenues);
      for(const idx in this.curator3DayRewards){

        totalCurator3DayReward += Number(this.curator3DayRewards[idx]);
        totalCuratorEstimateRewards += Number(this.curatorEstimateRewards[idx]);
      }
      //console.log("handleCurator3DayRewardOnDocuments", this.curator3DayRewards, "totalCurator3DayReward", totalCurator3DayReward, "totalCuratorEstimateRewards", totalCuratorEstimateRewards);
      this.setState({totalCurator3DayReward: totalCurator3DayReward, totalCuratorEstimateRewards: totalCuratorEstimateRewards});

  }

  fetchMoreData = () => {

      this.fetchDocuments({
        nextPageKey: this.state.nextPageKey
      })

  };

  fetchDocuments = (params) => {
      const {classes, match} = this.props;
      const email = match.params.email;
      restapi.getDocuments({email:email, nextPageKey: this.state.nextPageKey}).then((res)=>{
        console.log("Fetch Author Document", res.data);
        if(res.data && res.data.resultList) {
          if(this.state.resultList){
            this.setState({resultList: this.state.resultList.concat(res.data.resultList), nextPageKey:res.data.nextPageKey, totalViewCountInfo: res.data.totalViewCountInfo});
          } else {
            this.setState({resultList: res.data.resultList, nextPageKey:res.data.nextPageKey, totalViewCountInfo: res.data.totalViewCountInfo});
          }
          console.log("list", this.state.resultList);
          if(!res.data.nextPageKey){
            this.setState({isEndPage:true});
          }
        }
      });

  }

  getCuratorDocuments = () => {

      const {classes, match} = this.props;
      const email = match.params.email;
      restapi.getCuratorDocuments({
        accountId: email
      }).then((res)=>{
        console.log("Fetch My Voted Document", res.data);
        if(res.data && res.data.resultList) {
          //console.log("list", res.data.resultList);

          let deduplicationList = this.state.curatorDocumentList;
          let deduplicationKeys = this.state.curatorDocumentKeyList;
          res.data.resultList.forEach((curItem) => {
            if(!deduplicationKeys.includes(curItem.documentId)){
              deduplicationKeys.push(curItem.documentId);
              deduplicationList.push(curItem);
              //console.log(curItem);
            }
          });

          this.setState({curatorDocumentList:deduplicationList, curatorDocumentKeyList:deduplicationKeys});

        }

      });
  }


  componentWillMount() {
    this.fetchDocuments();
    this.getCuratorDocuments();
  }

  render() {
    const {classes, drizzleApis, match} = this.props;
    const accountId = match.params.email;
    if(!drizzleApis.isAuthenticated()) "DrizzleState Loading!!";

    return (

        <div className="contentGridView">

            <AuthorSummary totalReward={this.state.totalReward}
              totalAuthor3DayReward={this.state.totalAuthor3DayReward}
              totalCurator3DayReward={this.state.totalCurator3DayReward}
              totalCuratorEstimateRewards={this.state.totalCuratorEstimateRewards}
              drizzleApis={drizzleApis} documentList={this.state.resultList}
              curatorDocumentList={this.state.curatorDocumentList}
              totalViewCountInfo={this.state.totalViewCountInfo}
              accountId={accountId} />


            <Tabs
              forceRenderTabPanel={true}>
              <TabList>
                <Tab>Author</Tab>
                <Tab>Voted</Tab>
              </TabList>

              <TabPanel>
                <h3 style={{margin:'20px 0 0 0',fontSize:'26px'}} >{this.state.resultList.length} shared documents </h3>
                <InfiniteScroll
                  dataLength={this.state.resultList.length}
                  next={this.fetchMoreData}
                  hasMore={!this.state.isEndPage}
                  loader={<div className="spinner"><Spinner name="ball-pulse-sync"/></div>}>

                  <div className="customGrid col3">
                    {this.state.resultList.map((result, index) => (
                      <div className="box" key={result.documentId}>
                          <div className="cardSide">
                              <Link to={"/content/view/" + result.documentId} >
                                  <span className="img">
                                      <img src={restapi.getThumbnail(result.documentId, 1)} alt={result.title?result.title:result.documentName} />
                                  </span>
                                 <div className="inner">
                                      <div className="tit"
                                          style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}
                                          >{result.title?result.title:result.documentName}</div>
                                        <div className="descript"
                                            style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}>
                                       {restapi.convertTimestampToString(result.created)}
                                       </div>
                                      <div className="descript"
                                          style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}
                                       >{result.desc}</div>
                                      <div className="badge">
                                          <Badge color="info">View {result.totalViewCount?result.totalViewCount:0}</Badge>
                                          <AuthorRevenueOnDocument handleTotalAuthor3DayReward={this.handleTotalAuthor3DayReward} document={result} {...this.props} />
                                          {/* <Badge color="success">Reward $ {drizzleApis.toDollar(result.confirmAuthorReward)}</Badge> */}
                                          <Badge color="success">Vote $ {drizzleApis.toDollar(result.confirmVoteAmount)}</Badge>
                                      </div>
                                  </div>
                              </Link>

                              <AuthorClaim document={result} accountId={accountId} {...this.props}/>
                          </div>
                      </div>
                    ))}

                  </div>
                </InfiniteScroll>
              </TabPanel>

              <TabPanel>
                <CuratorDocumentList {...this.props}
                  handleCurator3DayRewardOnDocuments={this.handleCurator3DayRewardOnDocuments}
                  curatorDocumentList={this.state.curatorDocumentList}
                  totalViewCountInfo={this.state.totalViewCountInfo}
                    />
              </TabPanel>
            </Tabs>




        </div>

    );
  }
}

export default withStyles(style)(Author);
