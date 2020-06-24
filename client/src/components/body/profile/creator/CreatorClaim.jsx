import React from "react";
import Common from "../../../../common/common";
import { psString } from "../../../../config/localization";
import MainRepository from "../../../../redux/MainRepository";

class CreatorClaim extends React.Component {
  state = {
    determineReward: null,
    btnText: psString("claim-text") + " $ "
  };


  // 클레임
  claimCreatorReward = () => {
    const { document, setAlertCode } = this.props;

    MainRepository.Wallet.claimCreator({documentId : document.documentId}).then(res => {
      this.setState({ btnText: psString("claim-btn-text-1") }, () => {
        //window.location.reload();
      });
    }).catch(err => {
      this.setState({ btnText: psString("claim-text") + " $ " }, () => {
        setAlertCode(2035);
      });
    });
  };


  // 크리에이터 확정 보상 GET
  getDetermineCreatorReward = () => {
    const { document } = this.props;
    const { determineReward } = this.state;

    if (document && determineReward === null) {
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
