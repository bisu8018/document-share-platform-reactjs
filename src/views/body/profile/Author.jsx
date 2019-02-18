import React from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import InfiniteScroll from 'react-infinite-scroll-component';
import "react-tabs/style/react-tabs.css";
import Spinner from 'react-spinkit';
import { Link } from 'react-router-dom';
import Web3Apis from 'apis/Web3Apis';
import * as restapi from 'apis/DocApi';

import withStyles from "@material-ui/core/styles/withStyles";

import AuthorSummary from './AuthorSummary';
import AuthorClaim from './AuthorClaim';
import CuratorDocumentList from './CuratorDocumentList.jsx';
import DollarWithDeck from './DollarWithDeck';
import DeckInShort from './DeckInShort';
import Badge from "components/badge/Badge";

const style = {
  badge: {
    marginTop: "0",
    marginLeft: "15px",
    marginBottom: "5px",
  }
};

class Author extends React.Component {

  state = {
    resultList: [],
    curatorDocumentList: [],
    curatorDocumentKeyList: [],
    pageNo: null,
    isEndPage:false,
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

  };

  handleCurator3DayRewardOnDocuments = (documentId, reward, estimateReward) =>{

    if(this.curator3DayRewardOnDocuments.includes(documentId)) return;

    //console.log("handleCurator3DayRewardOnDocuments", documentId, reward, estimateReward);
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
      //console.log("totalCurator3DayReward", totalCurator3DayReward, this.web3Apis.toDeck(totalCurator3DayReward));
      //console.log("totalCuratorEstimateRewards", totalCuratorEstimateRewards);
      this.setState({totalCurator3DayReward: totalCurator3DayReward, totalCuratorEstimateRewards: totalCuratorEstimateRewards});

  };

  fetchMoreData = () => {

      this.fetchDocuments({
        pageNo: this.state.pageNo + 1
      })

  };

  fetchDocuments = (params) => {
      const {match} = this.props;
      const accountId = match.params.accountId;
      const pageNo = (!params || isNaN(params.pageNo))?1:Number(params.pageNo);
      restapi.getDocuments({accountId:accountId, pageNo: pageNo}).then((res)=>{

        if(res.data && res.data.resultList) {
          if(this.state.resultList){
            this.setState({resultList: this.state.resultList.concat(res.data.resultList), pageNo:res.data.pageNo, totalViewCountInfo: res.data.totalViewCountInfo});
          } else {
            this.setState({resultList: res.data.resultList, pageNo:res.data.pageNo, totalViewCountInfo: res.data.totalViewCountInfo});
          }
          console.log("list", this.state.resultList);
          if(!res.data.count===0){
            this.setState({isEndPage:true});
          }
        }
      });

  };

  render() {
    const {classes, drizzleApis, match} = this.props;
    const accountId = match.params.accountId;
    //if(!drizzleApis.isAuthenticated()) "DrizzleState Loading!!";

    return (

        <div className="contentGridView">

            <AuthorSummary totalReward={this.state.totalReward}
              totalCurator3DayReward={this.state.totalCurator3DayReward}
              totalCuratorEstimateRewards={this.state.totalCuratorEstimateRewards}
              drizzleApis={drizzleApis}
              documentList={this.state.resultList}
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
                                      <img src={restapi.getThumbnail(result.documentId, 1, result.documentName)} alt={result.title?result.title:result.documentName} />
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
                                    >{result.desc}
                                    </div>
                                  </div>
                                </Link>
                                <div className={this.props.classes.badge}>
                                  <Badge color="info">View {result.totalViewCount ? result.totalViewCount : 0} </Badge>
                                  <Badge color="success">Reward <DollarWithDeck deck={drizzleApis.toEther(result.confirmAuthorReward)} drizzleApis={drizzleApis} /></Badge>
                                  <Badge color="success">Vote <DeckInShort deck={drizzleApis.toEther(result.confirmVoteAmount)} /></Badge>
                                </div>
                                <AuthorClaim document={result} accountId={accountId} {...this.props}/>
                            </div>
                        </div>
                    ))}

                  </div>
                </InfiniteScroll>
              </TabPanel>

              <TabPanel>
                <CuratorDocumentList
                  {...this.props}
                  handleCurator3DayRewardOnDocuments= {this.handleCurator3DayRewardOnDocuments}
                  totalViewCountInfo= {this.state.totalViewCountInfo}
                  accountId= {accountId}
                    />
              </TabPanel>

            </Tabs>

        </div>

    );
  }
}

export default withStyles(style)(Author);
