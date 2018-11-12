import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
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

class CuratorDepositOnUserDocument extends React.Component {

  web3Apis = new Web3Apis();

  state = {
    curatorRewardOnDocuments: 0,
    anchorEl: null,
    open: false
  };

  componentWillMount () {
    const { document, loggedInAccount, handleRewardOnDocuments } = this.props;

    //console.log(document);

    this.web3Apis.getCuratorDepositOnUserDocument(loggedInAccount, document.documentId).then((data) => {

      this.setState({curatorDepositOnUserDocument:data});


    });

    /*
    const blockchainTimestamp = this.web3Apis.getBlockchainTimestamp(new Date());
    this.web3Apis.getCurator3DayRewardOnUserDocument(loggedInAccount, document.documentId, blockchainTimestamp).then((data) => {

      this.setState({curatorRewardOnDocuments:data});
      if(handleCurator3DayRewardOnDocuments){
        //console.log("getCuratorDepositOnUserDocument", data);
        handleCurator3DayRewardOnDocuments(document.documentId, data);
      }

    });
    */

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
    const { classes, drizzleApis, deposit } = this.props;
    const { anchorEl, open } = this.state;

    const curatorRewardOnDocuments = this.state.curatorRewardOnDocuments;
    const textDeck = this.web3Apis.toDeck(curatorRewardOnDocuments?curatorRewardOnDocuments:0) + " DECK";

    return (
     <span>
       <Tooltip title={textDeck} placement="bottom">
        <span className={classes.dollar}>
          ${this.web3Apis.toDollar(curatorRewardOnDocuments)}
        </span>
      </Tooltip>
    </span>
    );
  }
}

export default withStyles(styles)(CuratorDepositOnUserDocument);