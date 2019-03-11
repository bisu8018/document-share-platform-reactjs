import React from "react";
import ClipLoader from 'react-spinners/ClipLoader'

import withStyles from "@material-ui/core/styles/withStyles";
import Web3Apis from 'apis/Web3Apis';
import Button from "components/common/HeaderButton";

const style = {
  claimButton: {
    marginLeft: "15px"
  }
};

class AuthorClaim extends React.Component {

  state = {
    determineReward: -1,
    stackId: null
  };


  web3Apis = new Web3Apis();

  onClickClaim = () => {
    const {document, drizzleApis} = this.props;

    const unsubscribe = drizzleApis.subscribe((drizzle, drizzleState) => {

      if(!this.state.stackId) return;

      const { transactions, transactionStack } = drizzleState;

      const txHash = transactionStack[this.state.stackId];

      // if transaction hash does not exist, don't display anything
      if(!txHash) return;

      const state = transactions[txHash].status;
      const receipt = transactions[txHash].receipt;
      const confirmations = transactions[txHash].confirmations;

      console.log(state, confirmations, receipt);
      this.setState({ message: state});
      if(state !== "pending"){
        this.setState({stackId:null, determineReward: -1});
        drizzleApis.unsubscribe(unsubscribe);
      }
    });

    const stackId = drizzleApis.claimAuthorReward(document.documentId);
    this.setState({stackId:stackId});

  };

  shouldComponentUpdate() {
    const {document, drizzleApis} = this.props;
    if(drizzleApis.isAuthenticated() && this.state.determineReward < 0){
      this.web3Apis.getDetermineAuthorReward(drizzleApis.getLoggedInAccount(), document.documentId).then((data) => {
        //console.log("getDetermineAuthorReward", drizzleApis.getLoggedInAccount(), data);
        this.setState({determineReward: data});
      }).catch((err) => {
        console.error(err);
      });
    }
    return true;
  }

  render() {
    const {drizzleApis, accountId} = this.props;

    const loggedInAccount = drizzleApis.getLoggedInAccount();
    if (loggedInAccount !== accountId) {
      return null;
    }

    if(!drizzleApis.isAuthenticated()){

      return (
        <div className='sweet-loading'>
          <ClipLoader
            sizeUnit={"px"}
            width={5}
            height={15}
            margin={"2px"}
            radius={2}
            color={'#e91e63'}
            loading={!drizzleApis.isAuthenticated()}
          />
        </div>
      )

    }

    const disabled = this.state.determineReward<=0;

    if(disabled) return "";

    const determineReward = this.web3Apis.toDollar(this.state.determineReward>0?this.state.determineReward:0);

    return (
      <div>
        <Button className={this.props.classes.claimButton} onClick={this.onClickClaim} color="rose" size="sm" disabled={disabled}>Claim ${determineReward}</Button>
      </div>
    );
  }
}

export default withStyles(style)(AuthorClaim);
