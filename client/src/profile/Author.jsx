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
const style = {

};


class Author extends React.Component {

  state = {
    resultList: [],
    nextPageKey: null,
    isEndPage:false,
    totalRevenue: 0,
    totalReward: 0
  };

  revenueOnDocuments = [];
  revenues = [];

  rewardOnDocuments = [];
  rewards = [];

  web3Apis = new Web3Apis();

  handleRevenueOnDocuments = (documentId, revenue) =>{

    if(this.revenueOnDocuments.includes(documentId)) return;

    //console.log("handleRevenueOnDocuments", documentId, revenue);
    this.revenueOnDocuments.push(documentId);
    this.revenues.push(Number(revenue));
    let totalRevenue = 0;
    if(this.revenues.length == this.state.resultList.length){
      //console.log(this.revenues);
      for(const idx in this.revenues){

        totalRevenue += this.revenues[idx];
        //console.log("handleRevenueOnDocuments", this.revenues[idx], revenue);
      }
      this.setState({totalRevenue: totalRevenue});
    }

  }

  handleRewardOnDocuments = (documentId, reward) =>{

    if(this.rewardOnDocuments.includes(documentId)) return;

    //.log("handleRewardOnDocuments", documentId, reward);
    this.rewardOnDocuments.push(documentId);
    this.rewards.push(Number(reward));
    let totalReward = 0;

      //console.log(this.revenues);
      for(const idx in this.rewards){

        totalReward += Number(this.rewards[idx]);
      }
      console.log("handleRevenueOnDocuments", this.rewards, "totalReward", totalReward);
      this.setState({totalReward: totalReward});

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
            this.setState({resultList: this.state.resultList.concat(res.data.resultList), nextPageKey:res.data.nextPageKey});
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

  componentWillMount() {
    this.fetchDocuments();
  }

  render() {
    const {classes, drizzleApis, match} = this.props;
    const accountId = match.params.email;
    if(!drizzleApis.isAuthenticated()) "DrizzleState Loading!!";

    return (

        <div className="contentGridView">

            <AuthorSummary totalReward={this.state.totalReward} totalRevenue={this.state.totalRevenue} drizzleApis={drizzleApis} documentList={this.state.resultList} totalViewCountInfo={this.state.totalViewCountInfo} accountId={accountId} />

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
                                        {/*<AuthorRevenueOnDocument handleRevenueOnDocuments={this.handleRevenueOnDocuments} document={result} {...this.props} />*/}
                                        <Badge color="success">Reward $ {drizzleApis.toDollar(result.confirmAuthorReward)}</Badge>
                                        <Badge color="success">Vote $ {drizzleApis.toDollar(result.confirmVoteAmount)}</Badge>
                                    </div>
                                </div>
                            </Link>

                            <AuthorClaim document={result} {...this.props}/>
                        </div>
                    </div>
                  ))}

                </div>
            </InfiniteScroll>

            <CuratorDocumentList {...this.props} handleRewardOnDocuments={this.handleRewardOnDocuments} />
        </div>

    );
  }
}

export default withStyles(style)(Author);
