import React from "react";
import Common from "../../../../util/Common";

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
        this.setState({ determineReward: (Common.toDeck(data[0]) > 0 ? Common.toDeck(data[0]) : 0) });
      }).catch((err) => {
        console.error(err);
      });
    }
  };

  handelClickClaim = () => {
    const { document, getDrizzle, getMyInfo } = this.props;
    if (document && getDrizzle.isAuthenticated()) {
      this.setState({ btnText: "Pending" }, () => {
        getDrizzle.curatorClaimReward(document.documentId, getMyInfo.ethAccount).then((res) => {
          this.setState({ btnText: "Complete" });
          document.location.reload();
        });
      });
    }
  };

  componentWillMount(): void {
    this.getDetermineCuratorReward();
  }

  render() {
    const { getDrizzle, userInfo, getMyInfo } = this.props;
    const { determineReward, btnText } = this.state;
    let myEthAccount = getMyInfo.ethAccount;
    let ethAccount = userInfo ? userInfo.ethAccount : "";
    let claimReward = Common.deckToDollar(determineReward > 0 ? determineReward.toString() : 0);
    if (myEthAccount !== ethAccount || !getDrizzle.isAuthenticated() || claimReward <= 0 || btnText === "Complete" ) return <div/>;

    return (
      <div className={"claim-btn " + (btnText === "Pending" ? "btn-disabled" : "")} onClick={() => this.handelClickClaim()} title={"Claim $" + claimReward}>
        {btnText} {(btnText === "Pending" ? "" : claimReward)}
      </div>
    );
  }
}

export default CuratorClaim;
