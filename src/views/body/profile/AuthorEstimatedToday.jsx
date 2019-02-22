import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Web3Apis from 'apis/Web3Apis';
const style = {

};

class AuthorEstimatedToday extends React.Component {

  state = {
    estimatedToday: 0
  };

  web3Apis = new Web3Apis();

  shouldComponentUpdate(nextProps, nextState) {
    const {classes, drizzleApis} = this.props;
    if(drizzleApis.isAuthenticated()){
      this.getCalculateAuthorReward();
    }
    return true;
  }


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

  };


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
