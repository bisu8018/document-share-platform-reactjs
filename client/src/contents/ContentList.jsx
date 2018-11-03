import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Button from "components/CustomButtons/Button.jsx";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Badge from "components/Badge/Badge.jsx";
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from 'react-spinkit';
import { Face } from "@material-ui/icons";
import { Link } from 'react-router-dom';
import * as restapi from 'apis/DocApi';
import ContentListItem from 'contents/ContentListItem';
import ContentTags from 'contents/ContentTags';

const style = {

};

class ContentList extends React.Component {
    state = {
      resultList: [],
      nextPageKey: null,
      isEndPage:false,
      tag: null,
    };

    tagSearch = (tag) => {

      console.log("tagSearch", tag);

      this.setState({
        resultList: [],
        nextPageKey: null,
        isEndPage:false,
        tag: tag
      });

      this.fetchDocuments({
        tag: tag,
        nextPageKey: null
      });
    }

    fetchMoreData = () => {

        this.fetchDocuments({
          nextPageKey: this.state.nextPageKey,
          tag: this.state.tag
        })

    };

    fetchDocuments = (args) => {

        const params = {
          nextPageKey: args.nextPageKey,
          tag: args.tag
        }

        console.log("fetchDocument start", params);
        restapi.getDocuments(params).then((res)=>{
          console.log("Fetch Document", res.data);
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

            if(res.data.nextPageKey && res.data.resultList.length<20){
              this.fetchDocuments({nextPageKey: res.data.nextPageKey, tag: args.tag});
            }
          }
        });

    }

    goDetail = (e) => {
      //e.preventDefault();
      //console.log("goDetail", e);
      this.props.handleSelectDocument(e);

    }

    componentWillMount() {
      const { match } = this.props;
      console.log("componentWillMount");
      this.setState({
        resultList: [],
        nextPageKey: null,
        isEndPage:false,
        tag: match.params.tag
      });

      this.fetchDocuments({
        tag: match.params.tag
      });
    }

    render() {
      const { classes, match } = this.props;
      const resultList = this.state.resultList;

      return (
          <div>
             <InfiniteScroll
               dataLength={resultList.length}
               next={this.fetchMoreData}
               hasMore={!this.state.isEndPage}
               loader={<div className="spinner"><Spinner name="ball-pulse-sync"/></div>}>

                 <div className="contentGrid" >
                    <ContentTags tagSearch={this.tagSearch}/>
                    <div className="rightWrap">
                        <h3>{this.state.tag?"#" + this.state.tag:"@LATEST"}</h3>
                        {resultList.map((result, index) => (
                          <ContentListItem key={result.documentId + result.accountId} result={result} {...this.props} />
                        ))}
                     </div>
                </div>
             </InfiniteScroll>
          </div>
      );
    }
}

export default withStyles(style)(ContentList);
