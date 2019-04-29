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
    const { document, getDrizzle } = this.props;
    if (document && getDrizzle.isAuthenticated()) {
      this.setState({ btnText: "Pending" }, () => {
        getDrizzle.claimReward(document.documentId).then((res) => {
          this.setState({ btnText: "Claim $" }, () => {
            this.getDetermineCuratorReward();
          });
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
    if (myEthAccount !== ethAccount) return <div/>;    // 본인 프로필 맞는지 체크
    if (!getDrizzle.isAuthenticated()) return <div/>;    // MM 로그인 체크
    if (claimReward <= 0) return <div/>;    // 클레임 금액 체크

    return (
      <div className="claim-btn" onClick={() => this.handelClickClaim()} title={"Claim $" + claimReward}>
        {btnText} {(btnText === "Pending" ? "" : claimReward)}
      </div>
    );
  }
}

export default CuratorClaim;
