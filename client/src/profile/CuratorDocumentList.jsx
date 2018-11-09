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

const style = {

};


class CuratorDocumentList extends React.Component {

  state = {
    resultList: [],
    todayVotedDocuments: [],
    nextPageKey: null,
    isEndPage:false,
  };

  fetchMoreData = () => {

      this.fetchDocuments({
        nextPageKey: this.state.nextPageKey
      })

  };

  fetchDocuments = (params) => {

      const {classes, match} = this.props;
      const accountId = match.params.email;
      restapi.getCuratorDocuments({
        accountId: accountId,
        nextPageKey: this.state.nextPageKey
      }).then((res)=>{
        console.log("Fetch Voted Document", res.data);
        if(res.data && res.data.resultList) {
          if(this.state.resultList){
            this.setState({resultList: this.state.resultList.concat(res.data.resultList), nextPageKey:res.data.nextPageKey});
          } else {
            this.setState({resultList: res.data.resultList, nextPageKey:res.data.nextPageKey});
          }
          console.log("list", this.state.resultList);
          if(!res.data.nextPageKey){
            this.setState({isEndPage:true});
          }

          if(this.state.todayVotedDocuments){
            this.setState({todayVotedDocuments: res.data.todayVotedDocuments});
          }
        }

      });

  }

  componentWillMount() {
    this.fetchDocuments();
  }

  render() {
    const {classes, drizzleApis, match, handleRewardOnDocuments} = this.props;
    const accountId = match.params.email;
    if(!drizzleApis.isAuthenticated()) return "DrizzleState Loading!!";

    const loggedInAccount = drizzleApis.getLoggedInAccount();


    if (this.state.resultList.length > 0) {
      return (
        <div>
            <h3 style={{margin:'20px 0 0 0',fontSize:'26px'}} >{this.state.resultList.length} Voted documents </h3>
            <InfiniteScroll
              dataLength={this.state.resultList.length}
              next={this.fetchMoreData}
              hasMore={!this.state.isEndPage}
              loader={<div className="spinner"><Spinner name="ball-pulse-sync"/></div>}>

              <div className="customGrid col3">
                {this.state.resultList.map((result, index) => (
                  <div className="box" key={result.documentId + result.created}>
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
                                       <CuratorDepositOnDocument handleRewardOnDocuments={handleRewardOnDocuments} document={result.documentInfo} {...this.props} loggedInAccount={loggedInAccount} />
                                   </div>
                              </div>
                          </Link>
                      </div>
                  </div>
                ))}

              </div>
          </InfiniteScroll>
        </div>

      );
    }
    return null;
  }

}

export default withStyles(style)(CuratorDocumentList);
