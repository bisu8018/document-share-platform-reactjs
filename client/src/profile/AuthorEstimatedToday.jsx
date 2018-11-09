import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Badge from "components/Badge/Badge.jsx";
import ContentList from "contents/ContentList";
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from 'react-spinkit';
import { Link } from 'react-router-dom';
import * as restapi from 'apis/DocApi';
import DrizzleApis from 'apis/DrizzleApis';
import Web3Apis from 'apis/Web3Apis';
const style = {

};

class AuthorEstimatedToday extends React.Component {

  state = {
    estimatedToday: 0
  };

  web3Apis = new Web3Apis();

  getCalculateAuthorReward = () => {
    const {drizzleApis, documentList, totalViewCountInfo} = this.props;
    if(this.state.estimatedToday || !totalViewCountInfo) return;

    let viewCount = 0;
    for(const idx in documentList) {
      const document = documentList[idx];
      viewCount += document.viewCount;
    }
    //console.log("requestCalculateAuthorReward", viewCount, totalViewCountInfo);
    const address = drizzleApis.getLoggedInAccount();
    this.web3Apis.getCalculateAuthorReward(address, viewCount, totalViewCountInfo.totalViewCount).then((data) =>{
      this.setState({estimatedToday: data});

    }).catch((err) => {
      console.error(err);
    });

  }


  shouldComponentUpdate(nextProps, nextState) {
    const {classes, drizzleApis} = this.props;
    if(drizzleApis.isAuthenticated()){
      this.getCalculateAuthorReward();
    }
    return true;
  }


  render() {
    const {classes, drizzleApis} = this.props;

    const estimatedToday = this.state.estimatedToday;
    return (
        <span>
            ${this.web3Apis.toDollar(estimatedToday)}
        </span>

    );
  }
}

export default withStyles(style)(AuthorEstimatedToday);
