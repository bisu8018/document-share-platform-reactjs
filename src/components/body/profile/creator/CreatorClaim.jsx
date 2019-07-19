import React from "react";
import Common from "../../../../config/common";
import { psString } from "../../../../config/localization";

class CreatorClaim extends React.Component {
  state = {
    determineReward: null,
    btnText: psString("claim-text") + " $"
  };

  getDetermineCreatorReward = () => {
    const { document, getWeb3Apis, getDrizzle, getMyInfo } = this.props;
    const { determineReward } = this.state;

    if (document && getDrizzle.isAuthenticated() && getMyInfo.ethAccount && determineReward === null) {
      getWeb3Apis.getDetermineCreatorReward(document.documentId, getMyInfo.ethAccount).then((data) => {
        this.setState({ determineReward: (data && Common.toDeck(data[0]) > 0 ? Common.toDeck(data[0]) : 0) });
      }).catch((err) => {
        console.error(err);
      });
    }
  };

  handelClickClaim = () => {
    const { document, getDrizzle, getMyInfo, setAlertCode } = this.props;
    if (!getMyInfo.ethAccount) {
      this.setState({ msg: psString("claim-msg-1") });
      return;
    }
    if (getMyInfo.ethAccount !== getDrizzle.getLoggedInAccount()) {
      this.setState({ msg: psString("claim-msg-2") });
      return;
    }

    if (document && getDrizzle.isAuthenticated()) {

      this.setState({ btnText: psString("claim-btn-text-2") }, () => {
        getDrizzle.creatorClaimReward(document.documentId, getMyInfo.ethAccount).then((res) => {
          if(res === "success") this.setState({ btnText: psString("claim-btn-text-1") },()=>{window.location.reload()});
          else this.setState({ btnText: psString("claim-text") + " $" }, () => {setAlertCode(2035)});
        });
      });
    }
  };

  componentWillUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void {
    this.getDetermineCreatorReward();
  }

  render() {
    const { getDrizzle, userInfo, getMyInfo, getIsMobile } = this.props;
    const { determineReward, btnText } = this.state;

    let myEthAccount = getMyInfo.ethAccount;
    let ethAccount = userInfo ? userInfo.ethAccount : "";
    let drizzleAccount = getDrizzle ? getDrizzle.getLoggedInAccount() : "";
    let claimReward = Common.deckToDollar(determineReward > 0 ? determineReward.toString() : 0);
    if (myEthAccount !== ethAccount || !getDrizzle.isAuthenticated() || ethAccount !== drizzleAccount || claimReward <= 0 || btnText === psString("claim-btn-text-1") ) return <div/>;

    return (
      <div className={"claim-btn " + (btnText === psString("claim-btn-text-2") ? "btn-disabled" : "") + (getIsMobile ? " w-100" : "")} onClick={() => this.handelClickClaim()}>
        {btnText} {(btnText === psString("claim-btn-text-2") ? "" : claimReward)}
      </div>
    );
  }
}

export default CreatorClaim;
