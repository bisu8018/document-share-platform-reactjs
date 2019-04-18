import React from "react";
import ClipLoader from 'react-spinners/ClipLoader'

import Button from "../../../common/HeaderButton";
import Common from "../../../../util/Common";


class AuthorClaim extends React.Component {

  state = {
    determineReward: -1,
    stackId: null
  };

  onClickClaim = () => {
    const {document, getDrizzle} = this.props;

    const unsubscribe = getDrizzle.subscribe((drizzle, drizzleState) => {

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
        getDrizzle.unsubscribe(unsubscribe);
      }
    });

    const stackId = getDrizzle.claimReward(document.documentId);
    this.setState({stackId:stackId});

  };

  shouldComponentUpdate = () => {
    const {document, getWeb3Apis, getDrizzle} = this.props;
    if(getDrizzle.isAuthenticated() && this.state.determineReward < 0){
      getWeb3Apis.getDetermineAuthorReward(getDrizzle.getLoggedInAccount(), document.documentId).then((data) => {
        this.setState({determineReward: data});
      }).catch((err) => {
        console.error(err);
      });
    }
    return true;
  };

  render() {
    const {getWeb3Apis, accountId} = this.props;

    const loggedInAccount = getWeb3Apis.getLoggedInAccount();
    if (loggedInAccount !== accountId) {
      return null;
    }

    if(!getWeb3Apis.isAuthenticated()){

      return (
        <div className='sweet-loading'>
          <ClipLoader
            sizeUnit={"px"}
            width={5}
            height={15}
            margin={"2px"}
            radius={2}
            color={'#e91e63'}
            loading={!getWeb3Apis.isAuthenticated()}
          />
        </div>
      )

    }

    const disabled = this.state.determineReward<=0;

    if(disabled) return "";

    const determineReward = Common.toDollar(this.state.determineReward>0?this.state.determineReward:0);

    return (
      <div>
        <Button className={this.props.classes.claimButton} onClick={this.onClickClaim} color="rose" size="sm" disabled={disabled}>Claim ${determineReward}</Button>
      </div>
    );
  }
}

export default AuthorClaim;
