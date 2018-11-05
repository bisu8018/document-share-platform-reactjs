import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Badge from "components/Badge/Badge.jsx";
import ContentList from "contents/ContentList";
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from 'react-spinkit';
import { Link } from 'react-router-dom';
import * as restapi from 'apis/DocApi';
import DrizzleApis from 'apis/DrizzleApis';
const style = {

};

class AuthorEstimatedToday extends React.Component {

  state = {
    estimatedTodayDataKey: null,
    estimatedToday: 0
  };



  requestCalculateAuthorReward = () => {
    const {drizzleApis, documentList, totalViewCountInfo} = this.props;
    if(this.state.estimatedTodayDataKey || !totalViewCountInfo) return;

    let viewCount = 0;
    for(const idx in documentList) {
      const document = documentList[idx];
      viewCount += document.viewCount;
    }
    //console.log("requestCalculateAuthorReward", viewCount, totalViewCountInfo);
    const dataKey = drizzleApis.requestCalculateAuthorReward(viewCount, totalViewCountInfo.totalViewCount);
    if(dataKey){
      console.log("requestCalculateAuthorReward dataKey", dataKey);
      this.setState({estimatedTodayDataKey: dataKey});
    }

  }

  printCalculateAuthorReward = () => {
    const {drizzleApis, document} = this.props;
    //console.log("printBalance", this.state.totalBalanceDataKey);
    if(this.state.estimatedTodayDataKey) {

      const v = drizzleApis.getCalculateAuthorReward(this.state.estimatedTodayDataKey);

      if(!isNaN(v)){
        const returnValue = Math.round(drizzleApis.fromWei(v)* 100) /100;
        return returnValue;
      }

    }

    return 0;
  }



  shouldComponentUpdate(nextProps, nextState) {
    const {classes, drizzleApis} = this.props;
    if(drizzleApis.isAuthenticated()){
      this.requestCalculateAuthorReward();
    }


    return true;
  }


  render() {
    const {classes, drizzleApis} = this.props;

    const estimatedToday = this.printCalculateAuthorReward();
    return (
        <span>
            {estimatedToday} DECK
        </span>

    );
  }
}

export default withStyles(style)(AuthorEstimatedToday);
