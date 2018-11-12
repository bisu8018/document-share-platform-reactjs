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

  web3Apis = new Web3Apis();

  state = {
    author3DayRewardOnDocumentDataKey: null,
    author3DayRewardOnDocument: 0,
    anchorEl: null,
    open: false
  };

  componentWillMount () {
    const { document, handleRevenueOnDocuments } = this.props;

    console.log(document);
    this.web3Apis.getAuthor3DayRewardOnDocument(document.ethAccount, document.documentId).then((data) => {

      this.setState({author3DayRewardOnDocument:data});
      if(handleRevenueOnDocuments) {
        handleRevenueOnDocuments(document.documentId, Number(data));
      }

    });

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

    const author3DayRewardOnDocument = this.state.author3DayRewardOnDocument;
    const textDeck = drizzleApis.toEther(author3DayRewardOnDocument?author3DayRewardOnDocument:0) + " DECK";

    return (
     <Badge color="success">
       <Tooltip title={textDeck} placement="bottom">
        <span className={classes.dollar}>
          Reward ${this.web3Apis.toDollar(author3DayRewardOnDocument)}
        </span>
      </Tooltip>
     </Badge>
    );
  }
}

export default withStyles(styles)(AuthorRevenueOnDocument);
