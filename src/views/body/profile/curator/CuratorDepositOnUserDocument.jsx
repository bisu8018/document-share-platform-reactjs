import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Web3Apis from 'apis/Web3Apis';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  dollar: {
    margin: 0,
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
    curatorRewardOnUserDocument: 0,
    anchorEl: null,
    open: false
  };

  componentWillMount () {
    const { documentData, loggedInAccount } = this.props;

    //console.log(document);

    this.web3Apis.getCuratorDepositOnUserDocument(loggedInAccount, documentData.documentId).then((data) => {

      this.setState({curatorRewardOnUserDocument:data});


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
    const { classes} = this.props;

    const curatorRewardOnDocuments = this.state.curatorRewardOnUserDocument;
    const textDeck = this.web3Apis.toDeck(curatorRewardOnDocuments?curatorRewardOnDocuments:0).toFixed(2) + " DECK";
    const textDollar = "$" + this.web3Apis.toDollar(curatorRewardOnDocuments).toFixed(1);

    return (
     <span>
       <Tooltip title={textDollar} placement="bottom">
        <span className={classes.dollar}>
          {textDeck}
        </span>
      </Tooltip>
    </span>
    );
  }
}

export default withStyles(styles)(CuratorDepositOnUserDocument);
