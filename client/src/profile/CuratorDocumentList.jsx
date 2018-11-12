import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Badge from "components/Badge/Badge.jsx";
import ContentList from "contents/ContentList";
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from 'react-spinkit';
import { Link } from 'react-router-dom';
import * as restapi from 'apis/DocApi';
import AuthorSummary from 'profile/AuthorSummary';
import CuratorDepositOnDocument from 'profile/CuratorDepositOnDocument';
import CuratorClaim from 'profile/CuratorClaim';
import CuratorDocumentView from 'profile/CuratorDocumentView'

const style = {

};


class CuratorDocumentList extends React.Component {

  state = {
    resultList: [],
    resultKeyList: [],
    todayVotedDocuments: [],
    nextPageKey: null,
    isEndPage:true,
  };

  fetchMoreData = () => {

      this.fetchDocuments({
        nextPageKey: this.state.nextPageKey
      })

  };
/*
  fetchDocuments = (params) => {

      const {classes, match} = this.props;
      const accountId = match.params.email;
      restapi.getCuratorDocuments({
        accountId: accountId
      }).then((res)=>{
        console.log("Fetch My Voted Document", res.data);
        if(res.data && res.data.resultList) {
          //console.log("list", res.data.resultList);

          let deduplicationList = this.state.resultList;
          let deduplicationKeys = this.state.resultKeyList;
          res.data.resultList.forEach((curItem) => {
            if(!deduplicationKeys.includes(curItem.documentId)){
              deduplicationKeys.push(curItem.documentId);
              deduplicationList.push(curItem);
              //console.log(curItem);
            }
          });

          this.setState({resultList:deduplicationList});
          this.setState({resultKeyList:deduplicationKeys});


          if(this.state.todayVotedDocuments){
            this.setState({todayVotedDocuments: res.data.todayVotedDocuments});
          }

        }

      });


  }

  componentWillMount() {
    this.fetchDocuments();
  }
*/
  render() {
    const {classes, drizzleApis, match, handleCurator3DayRewardOnDocuments, curatorDocumentList, totalViewCountInfo} = this.props;
    const accountId = match.params.email;
    if(!drizzleApis.isAuthenticated()) return "DrizzleState Loading!!";

    const loggedInAccount = drizzleApis.getLoggedInAccount();

    if (curatorDocumentList.length > 0) {
      return (
        <div>
            <h3 style={{margin:'20px 0 0 0',fontSize:'26px'}} >{this.state.resultList.length} voted documents </h3>


            <div className="customGrid col3">
              {curatorDocumentList.map((result, index) => (
                <div className="box" key={result.documentId}>
                    <CuratorDocumentView {...this.props} documentId={result.documentId} totalViewCountInfo={totalViewCountInfo}/>
                </div>
              ))}

            </div>

        </div>

      );
    }
    return null;
  }

}

export default withStyles(style)(CuratorDocumentList);
