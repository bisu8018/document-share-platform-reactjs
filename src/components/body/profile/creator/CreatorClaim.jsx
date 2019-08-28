import React from "react";
import Common from "../../../../common/common";
import { psString } from "../../../../config/localization";

class CreatorClaim extends React.Component {
  state = {
    determineReward: null,
    btnText: psString("claim-text") + " $ "
  };


  // 클레임
  claimCreatorReward = () => {
    const { document, getDrizzle, getMyInfo, setAlertCode } = this.props;

    getDrizzle.creatorClaimReward(document.documentId, getMyInfo.ethAccount).then((res) => {
      if (res === "success") {
        this.setState({ btnText: psString("claim-btn-text-1") }, () => {
          window.location.reload();
        });
      } else {
        this.setState({ btnText: psString("claim-text") + " $ " }, () => {
          setAlertCode(2035);
        });
      }
    });
  };


  // 크리에이터 확정 보상 GET
  getDetermineCreatorReward = () => {
    const { document, getWeb3Apis, getMyInfo } = this.props;
    const { determineReward } = this.state;

    if (document && getMyInfo.ethAccount && determineReward === null) {
      getWeb3Apis.getDetermineCreatorReward(document.documentId, getMyInfo.ethAccount)
        .then(data => {
          this.setState({
            determineReward: data && Common.toDeck(data[0]) > 0 ?
              Common.toDeck(data[0]) : 0
          });
        }).catch(err => console.error(err));
    }
  };


  // 클레임 버튼 클릭 관리
  handelClickClaim = () => {
    const { document, getDrizzle, getMyInfo, setAlertCode } = this.props;

    if (!getDrizzle.isInitialized() || !getDrizzle.isAuthenticated())
      return setAlertCode(2054);

    if (!getMyInfo.ethAccount)
      return setAlertCode(2055);

    if (getMyInfo.ethAccount !== getDrizzle.getLoggedInAccount())
      return setAlertCode(2056);

    if (document && getDrizzle.isAuthenticated()) {
      this.setState({ btnText: psString("claim-btn-text-2") }, () => {
        this.claimCreatorReward();
      });
    }
  };


  componentDidMount(): void {
    this.getDetermineCreatorReward();
  }


  render() {
    const { getIsMobile } = this.props;
    const { determineReward, btnText } = this.state;

    let claimReward = Common.deckToDollar(determineReward > 0 ? determineReward.toString() : 0);

    if (claimReward <= 0 || btnText === psString("claim-btn-text-1")) return <div/>;

    return (
      <div
        className={"claim-btn " + (btnText === psString("claim-btn-text-2") ? "btn-disabled" : "") + (getIsMobile ? " w-100" : "")}
        onClick={() => this.handelClickClaim()}>
        {btnText} {(btnText === psString("claim-btn-text-2") ? "" : claimReward)}
      </div>
    );
  }
}

export default CreatorClaim;
