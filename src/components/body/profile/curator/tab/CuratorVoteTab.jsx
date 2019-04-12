import React from "react";

import Web3Apis from "apis/Web3Apis";
import CuratorTabItem from "./CuratorTabItem";
import MainRepository from "../../../../../redux/MainRepository";

class CuratorVoteTab extends React.Component {

  state = {
    resultList: [],
    nextPageKey: null,
    isEndPage: true,
    totalConfirmVoteAmount: 0
  };

  web3Apis = new Web3Apis();

  fetchMoreData = () => {

    this.fetchDocuments({
      nextPageKey: this.state.nextPageKey
    });

  };

  fetchDocuments = () => {
    const { accountId, handleCurator3DayRewardOnDocuments, totalViewCountInfo } = this.props;

    MainRepository.Document.getCuratorDocuments({ accountId: accountId }, (res) => {
      //console.log("Fetch My Voted Document", res);
      if (res && res.resultList) {

        this.setState({
          resultList: res.resultList
        });

        const totalPageviewSquare = res.totalViewCountInfo.totalPageviewSquare;

        res.resultList.forEach((item) => {
          const document = item.documentInfo;
          const totalViewCount = isNaN(document.totalViewCount) ? 0 : document.totalViewCount;
          if (totalPageviewSquare > totalViewCount) {
            this.getCuratorReward(accountId, document.documentId, document.totalViewCount, totalPageviewSquare).then((data) => {

              const reward = data[0];
              const estimateReward = data[1];
              //console.log(item.documentId, reward, estimateReward);
              if (handleCurator3DayRewardOnDocuments) {
                handleCurator3DayRewardOnDocuments(document.documentId, Number(reward), Number(estimateReward));
              }
            }).catch((err) => {
              console.error("fetchDocument", err);
            });
          } else {
            console.error("getCuratorReward total View count error", item, totalViewCountInfo);
          }
        });
      }
    }, (err) => {
      console.error("Error CuratorDocumentList", err);
    });
  };


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
      });
    });
  };

  componentWillMount() {
    this.fetchDocuments();
  }

  render() {
    if (this.state.resultList.length > 0) {
      return (
        <div>
          <h3 style={{ margin: "20px 0 0 0", fontSize: "26px" }}>{this.state.resultList.length} voted documents </h3>
          <div className="customGrid col3">
            {this.state.resultList.map((result, idx) => (
              <CuratorTabItem {...this.props}
                              document={result.documentInfo}
                              key={idx}/>
            ))}
          </div>
        </div>
      );
    }else{
      return (
        <div className="document-total-num">
          Total documents : <span>0</span>
        </div>
      )
    }
  }
}

export default CuratorVoteTab;
