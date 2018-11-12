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
      totalViewCountInfo: null,
      path: null,
      loading: false
    };

    tagSearch = (tag, path) => {

      console.log("tagSearch", tag, path);

      this.setState({
        resultList: [],
        nextPageKey: null,
        isEndPage:false,
        tag: tag,
        path: path
      });

      this.fetchDocuments({
        tag: tag,
        nextPageKey: null,
        path: path
      });
    }

    fetchMoreData = () => {

        this.fetchDocuments({
          nextPageKey: this.state.nextPageKey,
          tag: this.state.tag,
          path: this.state.path
        })

    };

    fetchDocuments = (args) => {

        if(this.state.loading) return;

        this.setState({loading:true});

        const params = {
          nextPageKey: args.nextPageKey,
          tag: args.tag,
          path: args.path?args.path:this.state.path
        }

        console.log("fetchDocument start", args, this.state, params);



        restapi.getDocuments(params).then((res)=>{
          console.log("Fetch Document", res.data);
          this.setState({loading:false});

          if(res.data && res.data.resultList) {
            if(this.state.resultList && this.state.nextPageKey){
              this.setState({resultList: this.state.resultList.concat(res.data.resultList), nextPageKey:res.data.nextPageKey});
            } else {
              this.setState({resultList: res.data.resultList, nextPageKey:res.data.nextPageKey});
            }

            console.log("list", this.state.resultList, res.data.nextPageKey);
            if(!res.data.nextPageKey){
              this.setState({isEndPage:true});
            }

            if(res.data.nextPageKey && res.data.resultList.length<10){
              this.fetchDocuments({nextPageKey: res.data.nextPageKey, tag: args.tag});
            }
          }

          if(res.data && res.data.totalViewCountInfo && !this.state.totalViewCountInfo){
            this.setState({totalViewCountInfo: res.data.totalViewCountInfo});
          }
        }).catch((err) => {
          this.setState({loading:false});

        });

    }

    goDetail = (e) => {
      //e.preventDefault();
      //console.log("goDetail", e);
      this.props.handleSelectDocument(e);

    }

    componentWillMount() {
      const { match } = this.props;
      //console.log("componentWillMount", match);
      this.setState({
        resultList: [],
        nextPageKey: null,
        isEndPage:false,
        tag: match.params.tag,
        path: match.url
      });

      this.fetchDocuments({
        tag: match.params.tag,
        path: match.url
      });
    }

    render() {
      const { classes, match } = this.props;
      const resultList = this.state.resultList;
      const tag = this.state.tag;
      let title = "latest";
      if(this.state.path
        && (this.state.path.lastIndexOf("featured")>0 || this.state.path.lastIndexOf("popular")>0)){
        title = this.state.path.substring(1);
      }
      return (

          <div>

             <InfiniteScroll
               dataLength={resultList.length}
               next={this.fetchMoreData}
               hasMore={!this.state.isEndPage}
               loader={<div className="spinner"><Spinner name="ball-pulse-sync"/></div>}>

                 <div className="contentGrid" >
                   <ContentTags path={match.path} url={match.url} tagSearch={this.tagSearch}/>
                    <div className="rightWrap">
                        <h3>{this.state.tag ? "@" + title + " #" + this.state.tag : "@" + title}</h3>
                        {resultList.map((result, index) => (
                          <ContentListItem key={result.documentId + result.accountId} result={result} totalViewCountInfo={this.state.totalViewCountInfo} {...this.props} />
                        ))}
                     </div>
                </div>
             </InfiniteScroll>
          </div>
      );
    }
}

export default withStyles(style)(ContentList);
