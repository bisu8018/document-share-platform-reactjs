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

const style = {

};


class Author extends React.Component {

  state = {
    resultList: [],
    nextPageKey: null,
    isEndPage:false,
    totalRevenue: 0,
    totalViewCountInfo: null
  };

  revenueOnDocuments = [];
  revenues = [];

  handleRevenueOnDocuments = (documentId, revenue) =>{

    if(this.revenueOnDocuments.includes(documentId)) return;

    //console.log("handleRevenueOnDocuments", documentId, revenue);
    this.revenueOnDocuments.push(documentId);
    this.revenues.push(revenue);
    let totalRevenue = 0;
    if(this.revenues.length == this.state.resultList.length){
      //console.log(this.revenues);
      for(const idx in this.revenues){

        totalRevenue += this.revenues[idx];
        //console.log("handleRevenueOnDocuments", totalRevenue, revenue);
      }
      this.setState({totalRevenue: Math.round(totalRevenue*100)/100});
    }

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

        if(res.data && res.data.totalViewCountInfo && !this.state.totalViewCountInfo){
          this.setState({totalViewCountInfo: res.data.totalViewCountInfo});
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

            <AuthorSummary totalRevenue={this.state.totalRevenue} drizzleApis={drizzleApis} documentList={this.state.resultList} totalViewCountInfo={this.state.totalViewCountInfo} accountId={accountId} />

            <h3 style={{margin:'20px 0 0 0',fontSize:'26px'}} >Author Documents {this.state.resultList.length}</h3>
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
                                        style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}
                                     >{result.desc}</div>
                                    <div className="badge">
                                        <Badge color="info">View {result.viewCount?result.viewCount:0 + result.confirmViewCount?result.confirmViewCount:0} </Badge>
                                        <Badge color="success">Reward <AuthorRevenueOnDocument handleRevenueOnDocuments={this.handleRevenueOnDocuments} document={result} {...this.props} /></Badge>
                                        <Badge color="success">Vote $ {drizzleApis.toDollar(result.totalVoteAmount?result.totalVoteAmount:"0")}</Badge>


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
}

export default withStyles(style)(Author);
