import React from "react";
import ClipLoader from 'react-spinners/ClipLoader'

import withStyles from "@material-ui/core/styles/withStyles";

import Button from "components/custom/HeaderButton";
import Web3Apis from 'apis/Web3Apis';

const style = {
  claimButton: {
    marginLeft: "15px",
    marginTop: "0"
  }
};

class CuratorClaim extends React.Component {

  state = {
    determineReward: -1,
    stackId: null
  };


  web3Apis = new Web3Apis();

  _onClickClaim = () => {
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

      if(state === "pending"){
        //pending
      } else if(state === "error") {
        // error
        this.setState({stackId:null, determineReward: -1});
        drizzleApis.unsubscribe(unsubscribe);
      } else if(state === "success") {
        //success
        this.setState({stackId:null, determineReward: -1});
        drizzleApis.unsubscribe(unsubscribe);
      }

    });

    const stackId = drizzleApis.claimCuratorReward(document.documentId);
    this.setState({stackId:stackId});
  };

  shouldComponentUpdate = () =>  {
    const {document, drizzleApis} = this.props;
    if(document && drizzleApis.isAuthenticated() && this.state.determineReward < 0){
      this.web3Apis.getDetermineCuratorReward(document.documentId, drizzleApis.getLoggedInAccount()).then((data) => {
        //console.log("getDetermineCuratorReward", document.documentId, data)
        this.setState({determineReward: data});
      }).catch((err) => {
        console.error(err);
      });
    }
    return true;
  };

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

    const disabled = this.state.determineReward <= 0;

    if(disabled) return "";

    const determineReward = this.web3Apis.toDollar(this.state.determineReward>0?this.state.determineReward:0);

    return (
      <div>
        <Button className={this.props.classes.claimButton} onClick={this._onClickClaim} color="rose" size="sm" disabled={disabled} >Claim ${determineReward}</Button>
      </div>
    );
  }
}

export default withStyles(style)(CuratorClaim);
