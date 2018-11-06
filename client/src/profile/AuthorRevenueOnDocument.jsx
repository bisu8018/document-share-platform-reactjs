import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Badge from "components/Badge/Badge.jsx";
import ContentList from "contents/ContentList";
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from 'react-spinkit';
import { Link } from 'react-router-dom';
import * as restapi from 'apis/DocApi';
import DrizzleApis from 'apis/DrizzleApis';
import Tooltip from '@material-ui/core/Tooltip';
const styles = theme => ({
  dollar: {
    margin: theme.spacing.unit * 0,
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 3,
  },
});

class AuthorRevenueOnDocument extends React.Component {

  state = {
    author3DayRewardOnDocumentDataKey: null,
    author3DayRewardOnDocument: 0,
    anchorEl: null,
    open: false
  };



  handleRequestAuthor3DayRewardOnDocument = () => {
    const {drizzleApis, document} = this.props;

    if(this.state.author3DayRewardOnDocumentDataKey) return;

    const dataKey = drizzleApis.requestAuthor3DayRewardOnDocument(document.ethAccount, document.documentId);
    if(dataKey){
      //console.log("handleRequestBalance", dataKey);
      this.setState({author3DayRewardOnDocumentDataKey: dataKey});
    }

  }

  printAuthor3DayRewardOnDocument = () => {
    const {drizzleApis, document, handleRevenueOnDocuments} = this.props;
    //console.log("printBalance", this.state.totalBalanceDataKey);
    if(this.state.author3DayRewardOnDocumentDataKey) {

      const v = drizzleApis.getAuthor3DayRewardOnDocument(this.state.author3DayRewardOnDocumentDataKey);

      if(!isNaN(v)){
        //console.log("printAuthor3DayRewardOnDocument", document.documentId, v)
        const returnValue = Math.round(drizzleApis.fromWei(v)* 100) /100;
        if(handleRevenueOnDocuments){
          handleRevenueOnDocuments(document.documentId, returnValue);
        }

        return v;

      }

    }

    return 0;
  }



  shouldComponentUpdate(nextProps, nextState) {
    const {classes, drizzleApis} = this.props;
    if(drizzleApis.isAuthenticated()){
      this.handleRequestAuthor3DayRewardOnDocument();
    }


    return true;
  }

  handleClick = event => {
    const { currentTarget } = event;
    this.setState(state => ({
      anchorEl: currentTarget,
      open: !state.open,
    }));
  };

  handleClose = () => {
    if (!this.state.open) {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    const { classes, drizzleApis } = this.props;
    const { anchorEl, open } = this.state;

    const author3DayRewardOnDocument = this.printAuthor3DayRewardOnDocument();
    const textDeck = "Reward " + (author3DayRewardOnDocument?author3DayRewardOnDocument:0) + " DECK";

    return (
     <Badge color="success">
       <Tooltip title={textDeck} placement="bottom">
        <span className={classes.dollar}>
          Reward ${drizzleApis.toDollar(author3DayRewardOnDocument?author3DayRewardOnDocument:0)}
        </span>
      </Tooltip>
     </Badge>
    );
  }
}

export default withStyles(styles)(AuthorRevenueOnDocument);
