import React from "react";
import Common from "../../../../util/Common";

class CreatorClaim extends React.Component {
  state = {
    determineReward: null,
    btnText: "Claim $"
  };

  getDetermineCreatorReward = () => {
    const { document, getWeb3Apis, getDrizzle, getMyInfo } = this.props;
    const { determineReward } = this.state;

    if (document && getDrizzle.isAuthenticated() && getMyInfo.ethAccount && determineReward === null) {
      getWeb3Apis.getDetermineCreatorReward(document.documentId, getMyInfo.ethAccount).then((data) => {
        this.setState({ determineReward: (Common.toDeck(data[0]) > 0 ? Common.toDeck(data[0]) : 0) });
      }).catch((err) => {
        console.error(err);
      });
    }
  };

  handelClickClaim = () => {
    const { document, getDrizzle, getMyInfo, setAlertCode } = this.props;
    if (!getMyInfo.ethAccount) {
      this.setState({ msg: "Please log in to the Meta Mask." });
      return;
    }
    if (getMyInfo.ethAccount !== getDrizzle.getLoggedInAccount()) {
      this.setState({ msg: "Please log in with the correct account." });
      return;
    }

    if (document && getDrizzle.isAuthenticated()) {

      this.setState({ btnText: "Pending" }, () => {
        getDrizzle.creatorClaimReward(document.documentId, getMyInfo.ethAccount).then((res) => {
          if(res === "success") this.setState({ btnText: "Complete" },()=>{window.location.reload()});
          else this.setState({ voteStatus: "Claim $" }, () => {setAlertCode(2035)});
        });
      });
    }
  };

  componentWillUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void {
    this.getDetermineCreatorReward();
  }

  render() {
    const { getDrizzle, userInfo, getMyInfo } = this.props;
    const { determineReward, btnText } = this.state;

    let myEthAccount = getMyInfo.ethAccount;
    let ethAccount = userInfo ? userInfo.ethAccount : "";
    let drizzleAccount = getDrizzle ? getDrizzle.getLoggedInAccount() : "";
    let claimReward = Common.deckToDollar(determineReward > 0 ? determineReward.toString() : 0);
    if (myEthAccount !== ethAccount || !getDrizzle.isAuthenticated() || ethAccount !== drizzleAccount || claimReward <= 0 || btnText === "Complete" ) return <div/>;

    return (
      <div className={"claim-btn " + (btnText === "Pending" ? "btn-disabled" : "")} onClick={() => this.handelClickClaim()} title={"Claim $" + claimReward}>
        {btnText} {(btnText === "Pending" ? "" : claimReward)}
      </div>
    );
  }
}

export default CreatorClaim;
