import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Badge from "components/Badge/Badge.jsx";
import ContentList from "contents/ContentList";
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from 'react-spinkit';
import { Link } from 'react-router-dom';
import * as restapi from 'apis/DocApi';
import Web3Apis from 'apis/Web3Apis';
import AuthorSummary from 'profile/AuthorSummary';
import CuratorDepositOnDocument from 'profile/CuratorDepositOnDocument';
import CuratorClaim from 'profile/CuratorClaim';
import CuratorDocumentView from 'profile/CuratorDocumentView'

const style = {

};


class CuratorDocumentList extends React.Component {

  state = {
    resultList: [],
    nextPageKey: null,
    isEndPage: true,
    totalConfirmVoteAmount: 0,
  };

  web3Apis = new Web3Apis();

  fetchMoreData = () => {

      this.fetchDocuments({
        nextPageKey: this.state.nextPageKey
      })

  };

  fetchDocuments = (params) => {
    const {classes, match, accountId, handleCurator3DayRewardOnDocuments, totalViewCountInfo} = this.props;
    restapi.getCuratorDocuments({
      accountId: accountId
    }).then((res)=>{
      console.log("Fetch My Voted Document", res.data);
      if(res.data && res.data.resultList) {

        this.setState({
          resultList:res.data.resultList
        });

        let totalConfirmVoteAmount = 0;

        const totalViewCountSquare = res.data.totalViewCountInfo.totalViewCountSquare;

        res.data.resultList.forEach((item)=>{
          const viewCount = isNaN(item.viewCount)?0:item.viewCount;
          if(totalViewCountSquare > viewCount){
            this.getCuratorReward(accountId, item.documentId, item.viewCount, totalViewCountSquare).then((data)=>{

              const reward = data[0];
              const estimateReward = data[1];
              //console.log(item.documentId, reward, estimateReward);
              if(handleCurator3DayRewardOnDocuments){
                handleCurator3DayRewardOnDocuments(item.documentId, Number(reward), Number(estimateReward));
              }
            }).catch((err)=>{
              console.error("fetchDocument", err);
            });
          } else {
            console.error("getCuratorReward total View count error", item, totalViewCountInfo);
          }

        });
      }

    }).catch((err)=>{
      console.error("Error CuratorDocumentList", err);
    });

  }


  getCuratorReward = (accountId, documentId, totalViewCount, totalViewCountSquare) => {
    console.log("getCuratorReward", accountId, documentId, totalViewCount, totalViewCountSquare);
    return new Promise((resolve, reject) => {
      const blockchainTimestamp = this.web3Apis.getBlockchainTimestamp(new Date());
      const promise1 = this.web3Apis.getCurator3DayRewardOnUserDocument(accountId, documentId, blockchainTimestamp);
      const promise2 = this.web3Apis.calculateCuratorReward(accountId, documentId, totalViewCount, totalViewCountSquare);

      Promise.all([promise1, promise2]).then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      })
    })

  }

  componentWillMount() {
    this.fetchDocuments();
  }

  render() {
    const {classes, drizzleApis, match, handleCurator3DayRewardOnDocuments, totalViewCountInfo, accountId} = this.props;
    //console.log(this.state.resultList);
    if (this.state.resultList.length > 0) {
      return (
        <div>
            <h3 style={{margin:'20px 0 0 0',fontSize:'26px'}} >{this.state.resultList.length} voted documents </h3>
            <div className="customGrid col3">
              {this.state.resultList.map((result, index) => (
                <div className="box" key={result.documentId}>
                    <CuratorDocumentView {...this.props} document={result} totalViewCountInfo={totalViewCountInfo}/>
                </div>
              ))}

            </div>
        </div>
      );
    }
    return(
      <div>
        <h3 style={{margin:'20px 0 0 0',fontSize:'26px'}} >0 voted documents </h3>
      </div>
    )
  }

}

export default withStyles(style)(CuratorDocumentList);
