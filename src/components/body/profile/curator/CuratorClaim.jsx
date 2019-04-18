import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

import Common from "../../../../util/Common";

class CuratorClaim extends React.Component {

  state = {
    determineReward: -1,
    stackId: null
  };

  _onClickClaim = () => {
    const { document, getDrizzle } = this.props;

    const unsubscribe = getDrizzle.subscribe((drizzle, drizzleState) => {

      if (!this.state.stackId) return;

      const { transactions, transactionStack } = drizzleState;

      const txHash = transactionStack[this.state.stackId];

      // if transaction hash does not exist, don't display anything
      if (!txHash) return;

      const state = transactions[txHash].status;
      const receipt = transactions[txHash].receipt;
      const confirmations = transactions[txHash].confirmations;

      console.log(state, confirmations, receipt);
      this.setState({ message: state });

      if (state === "pending") {
        //pending
      } else if (state === "error") {
        // error
        this.setState({ stackId: null, determineReward: -1 });
        getDrizzle.unsubscribe(unsubscribe);
      } else if (state === "success") {
        //success
        this.setState({ stackId: null, determineReward: -1 });
        getDrizzle.unsubscribe(unsubscribe);
      }

    });

    const stackId = getDrizzle.claimReward(document.documentId);
    this.setState({ stackId: stackId });
  };

  shouldComponentUpdate = () => {
    const { document, getWeb3Apis, getDrizzle } = this.props;
    if (document && getDrizzle.isAuthenticated() && this.state.determineReward < 0) {
      getWeb3Apis.getDetermineCuratorReward(document.documentId, getDrizzle.getLoggedInAccount()).then((data) => {
        //console.log("getDetermineCuratorReward", document.documentId, data)
        this.setState({ determineReward: data });
      }).catch((err) => {
        console.error(err);
      });
    }
    return true;
  };

  render() {
    const { getDrizzle, accountId } = this.props;
    const loggedInAccount = getDrizzle.getLoggedInAccount();
    let isAuthenticated = getDrizzle.isAuthenticated();
    if (loggedInAccount !== accountId) return null;

    if (!isAuthenticated) {
      return (
        <div className='sweet-loading'>
          <ClipLoader
            sizeUnit={"px"}
            width={5}
            height={15}
            margin={"2px"}
            radius={2}
            color={"#e91e63"}
            loading={!isAuthenticated}
          />
        </div>
      );
    }

    const disabled = this.state.determineReward <= 0;

    if (disabled) return "";

    const determineReward = Common.toDollar(this.state.determineReward > 0 ? this.state.determineReward : 0);

    return (
      <div className="info_btn ok-btn" onClick={this._onClickClaim} disabled={disabled}>
        Claim ${determineReward}
      </div>
    );
  }
}

export default CuratorClaim;
