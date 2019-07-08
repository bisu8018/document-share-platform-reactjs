import React from "react";
import Common from "../../../../config/common";

class CuratorClaim extends React.Component {
  state = {
    determineReward: null,
    btnText: "Claim $"
  };

  getDetermineCuratorReward = () => {
    const { document, getWeb3Apis, getDrizzle, getMyInfo } = this.props;
    const { determineReward } = this.state;

    if (document && getDrizzle.isAuthenticated() && getMyInfo.ethAccount && determineReward === null) {
      getWeb3Apis.getDetermineCuratorReward(document.documentId, getMyInfo.ethAccount).then((data) => {
        this.setState({ determineReward: (data && Common.toDeck(data[0]) > 0 ? Common.toDeck(data[0]) : 0) });
      }).catch((err) => {
        console.error(err);
      });
    }
  };

  handelClickClaim = () => {
    const { document, getDrizzle, getMyInfo, setAlertCode } = this.props;
    const { btnText } = this.state;

    if (document && getDrizzle.isAuthenticated()) {
      this.setState({ btnText: "Pending" }, () => {
        getDrizzle.curatorClaimReward(document.documentId, getMyInfo.ethAccount).then((res) => {
          this.setState({ btnText: "Complete" });
        });
        if (btnText === "Complete") window.location.reload();//this.setState({ voteStatus: "COMPLETE" });
        else {
          this.setState({ voteStatus: "Claim $" });
          setAlertCode(2035);
        }
      });
    }
  };

  componentWillMount(): void {
    this.getDetermineCuratorReward();
  }

  render() {
    const { getDrizzle, userInfo, getMyInfo, getIsMobile } = this.props;
    const { determineReward, btnText } = this.state;
    let myEthAccount = getMyInfo.ethAccount;
    let ethAccount = userInfo ? userInfo.ethAccount : "";
    let drizzleAccount = getDrizzle ? getDrizzle.getLoggedInAccount() : "";
    let claimReward = Common.deckToDollar(determineReward > 0 ? determineReward.toString() : 0);
    if (myEthAccount !== ethAccount || !getDrizzle.isAuthenticated() || ethAccount !== drizzleAccount || claimReward <= 0 || btnText === "Complete") return <div/>;

    return (
      <div className={"claim-btn " + (btnText === "Pending" ? "btn-disabled" : "") + (getIsMobile ? " w-100" : "")}
           onClick={() => this.handelClickClaim()} title={"Claim $" + claimReward}>
        {btnText} {(btnText === "Pending" ? "" : claimReward)}
      </div>
    );
  }
}

export default CuratorClaim;
