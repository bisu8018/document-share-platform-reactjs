import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
const style = {

};

class CuratorEstimatedToday extends React.Component {

  state = {
    estimatedToday: 0
  };

  render() {
    const {classes, drizzleApis} = this.props;

    if(!drizzleApis.isAuthenticated()) return "DrizzleState Loading!!";

    const estimatedToday = this.state.estimatedToday();
    return (
        <span>
            {estimatedToday} DECK
        </span>

    );
  }
}

export default withStyles(style)(CuratorEstimatedToday);
