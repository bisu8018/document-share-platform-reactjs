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
      isEndPage:false
    };

    fetchMoreData = () => {

        this.fetchDocuments({
          nextPageKey: this.state.nextPageKey
        })

    };

    fetchDocuments = (params) => {

        console.log("fetchDocument start", this.state);
        restapi.getDocuments({nextPageKey: this.state.nextPageKey}).then((res)=>{
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

    goDetail = (e) => {
      //e.preventDefault();
      //console.log("goDetail", e);
      this.props.handleSelectDocument(e);

    }

    componentWillMount() {
      this.fetchDocuments();
    }

    render() {
      const { classes } = this.props;
      const resultList = this.state.resultList;
      return (
          <div>
             <InfiniteScroll
               dataLength={resultList.length}
               next={this.fetchMoreData}
               hasMore={!this.state.isEndPage}
               loader={<div className="spinner"><Spinner name="ball-pulse-sync"/></div>}>

                 <div className="contentGrid" >
                    <ContentTags />
                    <div className="rightWrap">
                        <h3>@LATEST</h3>
                        {resultList.map((result, index) => (
                          <ContentListItem key={result.documentId} result={result} />
                        ))}
                     </div>
                </div>
             </InfiniteScroll>
          </div>
      );
    }
}

export default withStyles(style)(ContentList);
