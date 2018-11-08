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

class CuratorEstimatedToday extends React.Component {

  state = {
    estimatedToday: 0
  };


  shouldComponentUpdate(nextProps, nextState) {
    const {classes, drizzleApis} = this.props;
    if(drizzleApis.isAuthenticated()){
      this.requestCalculateAuthorReward();
    }


    return true;
  }


  render() {
    const {classes, drizzleApis} = this.props;

    if(!drizzleApis.isAuthenticated()) return "DrizzleState Loading!!";

    const estimatedToday = this.printCalculateAuthorReward();
    return (
        <span>
            {estimatedToday} DECK
        </span>

    );
  }
}

export default withStyles(style)(CuratorEstimatedToday);
