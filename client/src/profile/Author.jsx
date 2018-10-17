import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Badge from "components/Badge/Badge.jsx";
import ContentList from "contents/ContentList";
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from 'react-spinkit';
import { Link } from 'react-router-dom';
import * as restapi from 'apis/DocApi';
const style = {

};

class Author extends React.Component {

  state = {
    resultList: [],
    nextPageKey: null,
    isEndPage:false
  };

  fetchMoreData = () => {

      this.fetchDocuments({
        nextPageKey: this.state.nextPageKey
      })

  };

  fetchDocuments = (params) => {
      const {classes, match} = this.props;
      const email = match.params.email;
      restapi.getDocuments({email:email, nextPageKey: this.state.nextPageKey}).then((res)=>{
        console.log("Fetch Document", res.data);
        if(res.data && res.data.resultList) {
          if(this.state.resultList){
            console.log("concat");
            this.setState({resultList: this.state.resultList.concat(res.data.resultList), nextPageKey:res.data.nextPageKey});
          } else {
            console.log("init list");
            this.setState({resultList: res.data.resultList, nextPageKey:res.data.nextPageKey});
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
    const {classes, match} = this.props;

    return (

        <div className="contentGridView">

            <h3 style={{margin:'0',fontSize:'26px'}} >KPI Summary</h3>
            <div className="customGrid">
                <div className="box">
                    <h4>{match.params.email}</h4>
                    <ul className="detailList">
                        <li>daily total page views : </li>
                        <li>aily total earning : </li>
                        <li>otal number of documents :</li>
                        <li>otal number of votes :</li>
                        <li>otal number of curators :</li>
                    </ul>
                </div>
                <div className="box">
                    <h4>Global</h4>
                    <ul className="detailList">
                        <li>daily total page views : </li>
                        <li>aily total earning : </li>
                        <li>otal number of documents :</li>
                        <li>otal number of votes :</li>
                        <li>otal number of curators :</li>
                    </ul>
                </div>
            </div>

            <h3 style={{margin:'20px 0 0 0',fontSize:'26px'}} >{match.params.email} documents</h3>
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
                                    <img src={restapi.getThumbnail(result.documentId, 1)} alt={result.accountId} />
                                </span>
                               <div className="inner">
                                    <div className="tit"
                                        style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}
                                        >{result.title?result.title:result.documentName}</div>
                                    <div className="descript"
                                        style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}
                                     >{result.desc}</div>
                                    <div className="badge">
                                        <Badge color="rose">1,222 Deck</Badge>
                                        <Badge color="rose">1,222 view</Badge>
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
