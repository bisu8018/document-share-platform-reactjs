import React, {Component} from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from 'react-spinkit';
import ContentTags from "./ContentTags";
import ContentListItem from "./ContentListItem";
import MainRepository from "../../../redux/MainRepository";
/*import ContentListItem from './ContentListItem';
import ContentTags from './ContentTags';*/

const style = {
};

class ContentList extends Component {
    state = {
      resultList: [],
      pageNo: 1,
      isEndPage:false,
      tag: null,
      totalViewCountInfo: null,
      path: null,
      loading: false
    };

    componentWillMount() {
        const { match } = this.props;
        //console.log("componentWillMount", match);
        this.setState({
            resultList: [],
            pageNo: null,
            isEndPage:false,
            tag: match.params.tag,
            path: match.url
        });

        this.fetchDocuments({
            tag: match.params.tag,
            path: match.url
        });
    }

    fetchMoreData = () => {
      this.fetchDocuments({
        pageNo: this.state.pageNo + 1,
        tag: this.state.tag,
        path: this.state.path
      })
    };

    fetchDocuments = (args) => {
        if(this.state.loading) return;
        this.setState({loading:true});
        const params = {
          pageNo: args.pageNo,
          tag: args.tag,
          path: args.path?args.path:this.state.path
        };

        //console.log("fetchDocument start", params);

        MainRepository.Document.getDocumentList(params, (res) => {
          //console.log("Fetch Document end", res);
          this.setState({loading:false});
          const resData = res;
          const resultList = resData.resultList?resData.resultList:[];
          const pageNo = resData.pageNo;

          if(resultList.length>0) {
            if(this.state.resultList && this.state.resultList.length>0){
              this.setState({resultList: this.state.resultList.concat(resultList), pageNo:pageNo});
            } else {
              this.setState({resultList: resultList, pageNo:pageNo});
            }

          } else {
            this.setState({isEndPage:true});
          }

          if(res && res.totalViewCountInfo && !this.state.totalViewCountInfo){
            this.setState({totalViewCountInfo: res.totalViewCountInfo});
          }
        }, (err) => {
          this.setState({loading:false});
        });
    };

    tagSearch = (tag, path) => {
        //console.log("tagSearch", tag, path);
        this.setState({
            resultList: [],
            pageNo: 1,
            isEndPage:false,
            tag: tag,
            path: path
        });

        this.fetchDocuments({
            tag: tag,
            pageNo: 1,
            path: path
        });
    };

    render() {
      const { match } = this.props;
      const resultList = this.state.resultList;
      //const tag = this.state.tag;
      let title = "latest";

      if(this.state.path
        && (this.state.path.lastIndexOf("featured")>0 || this.state.path.lastIndexOf("popular")>0)){
        title = this.state.path.substring(1);
      }

      return (

             <InfiniteScroll
               dataLength={resultList.length}
               next={this.fetchMoreData}
               hasMore={!this.state.isEndPage}
               loader={<div className="spinner"><Spinner name="ball-pulse-sync"/></div>}>

                 <div className="contentGrid" >
                    <ContentTags path={match.path} url={match.url} tagSearch={this.tagSearch}/>
                    <div className="rightWrap">
                        <h3>{this.state.tag ? "@" + title + " #" + this.state.tag : "@" + title}</h3>
                        {resultList.map((result) => (
                            <ContentListItem key={result.documentId + result.accountId} result={result} totalViewCountInfo={this.state.totalViewCountInfo} {...this.props} />
                        ))}
                     </div>
                </div>

             </InfiniteScroll>

      );
    }
}

export default withStyles(style)(ContentList);
