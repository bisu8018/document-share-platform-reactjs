import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from '@material-ui/core/Tooltip';

import Badge from "components/badge/Badge";
import Web3Apis from 'apis/Web3Apis';

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

class CuratorDepositOnDocument extends React.Component {

  web3Apis = new Web3Apis();

  state = {
    curatorDepositOnDocument: 0,
    anchorEl: null,
    open: false
  };

  componentWillMount () {
    const { document, handleRewardOnDocuments, loggedInAccount } = this.props;

    //console.log(document);
    this.web3Apis.getCuratorDepositOnUserDocument(loggedInAccount, document.documentId).then((data) => {

      this.setState({curatorDepositOnDocument:data});

      if(handleRewardOnDocuments){
        handleRewardOnDocuments(document.documentId, data);
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
    const curatorDepositOnDocument = this.state.curatorDepositOnDocument;
    const textDeck = drizzleApis.toEther(curatorDepositOnDocument?curatorDepositOnDocument:0) + " DECK";

    return (
     <Badge color="success">
       <Tooltip title={textDeck} placement="bottom">
        <span className={classes.dollar}>
          Deposit ${this.web3Apis.toDollar(curatorDepositOnDocument)}
        </span>
      </Tooltip>
     </Badge>
    );
  }
}

export default withStyles(styles)(CuratorDepositOnDocument);
