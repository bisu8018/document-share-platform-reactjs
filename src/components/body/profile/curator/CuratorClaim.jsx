import React from "react";
import Common from "../../../../common/common";
import { APP_PROPERTIES } from "../../../../properties/app.properties";

class CuratorClaim extends React.Component {
  state = {
    determineReward: null,
    btnText: "Claim $ "
  };


  // 초기화
  init = () => {
    if(APP_PROPERTIES.ssr) return;

    this.getDetermineCuratorReward();
  };


  // 큐레이터 리워드 GET
  getDetermineCuratorReward = () => {
    const { document, getWeb3Apis, getMyInfo } = this.props;
    const { determineReward } = this.state;

    if (document &&  getMyInfo.ethAccount && determineReward === null) {
      getWeb3Apis.getDetermineCuratorReward(document.documentId, getMyInfo.ethAccount).then((data) => {
        this.setState({ determineReward: (data && Common.toDeck(data[0]) > 0 ? Common.toDeck(data[0]) : 0) });
      }).catch(err => console.error(err));
    }
  };


  // 클레임 버튼 클릭 관리
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
          this.setState({ voteStatus: "Claim $ " });
          setAlertCode(2035);
        }
      });
    }
  };


  componentWillMount(): void {
    this.init();
  }


  render() {
    const { getDrizzle, userInfo, getMyInfo, getIsMobile } = this.props;
    const { determineReward, btnText } = this.state;
    let myEthAccount = getMyInfo.ethAccount,
      ethAccount = userInfo ? userInfo.ethAccount : "",
      claimReward = Common.deckToDollar(determineReward > 0 ? determineReward.toString() : 0);

    let drizzleAccount = getDrizzle ? getDrizzle.getLoggedInAccount() : "";
    if (myEthAccount !== ethAccount || ethAccount !== drizzleAccount || !getDrizzle.isAuthenticated() || claimReward <= 0 || btnText === "Complete") return <div/>;

    return (
      <div className={"claim-btn " + (btnText === "Pending" ? "btn-disabled" : "") + (getIsMobile ? " w-100" : "")}
           onClick={() => this.handelClickClaim()} title={"Claim $ " + claimReward}>
        {btnText} {(btnText === "Pending" ? "" : claimReward)}
      </div>
    );
  }
}

export default CuratorClaim;
