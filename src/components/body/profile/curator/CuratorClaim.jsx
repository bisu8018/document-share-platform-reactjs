import React from "react";
import Common from "../../../../common/common";
import { psString } from "../../../../config/localization";
import MainRepository from "../../../../redux/MainRepository";

class CuratorClaim extends React.Component {
  state = {
    determineReward: null,
    btnText: psString("claim-text") + " $ "
  };


  // 클레임
  claimCuratorReward = () => {
    const { document, setAlertCode } = this.props;

    MainRepository.Wallet.claimCurator({ documentId: document.documentId }).then(res => {
      this.setState({ btnText: psString("claim-btn-text-1") }, () => {
        window.location.reload();
      });
    }).catch(err => {
      this.setState({ btnText: psString("claim-text") + " $ " }, () => {
        setAlertCode(2035);
      });
    });
  };

  // 큐레이터 리워드 GET
  getDetermineCuratorReward = () => {
    const { document } = this.props;
    const { determineReward } = this.state;

    if (document  && determineReward === null) {
      this.setState({
        determineReward: 100
      });
    }
  };


  // 클레임 버튼 클릭 관리
  handelClickClaim = () => {
    const { document } = this.props;

    if (document) {
      this.setState({ btnText: psString("claim-btn-text-2") }, () => {
        this.claimCuratorReward();
      });
    }
  };


  componentWillUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void {
    this.getDetermineCuratorReward();
  }


  render() {
    const { getDrizzle, getIsMobile } = this.props;
    const { determineReward, btnText } = this.state;
    let claimReward = Common.deckToDollar(determineReward > 0 ? determineReward.toString() : 0);

    if (!getDrizzle.isAuthenticated() || claimReward <= 0 || btnText === "Complete") return <div/>;

    return (
      <div
        className={"claim-btn " + (btnText === psString("claim-btn-text-2") ? "btn-disabled" : "") + (getIsMobile ? " w-100" : "")}
        onClick={() => this.handelClickClaim()}>
        {btnText} {(btnText === psString("claim-btn-text-2") ? "" : claimReward)}
      </div>
    );
  }
}

export default CuratorClaim;
