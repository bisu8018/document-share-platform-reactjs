import React from "react";
import { psString } from "../../../config/localization";

class PayoutCard extends React.Component {

  render() {
    const { reward, data } = this.props;
    if (data.isRegistry) {
      return (
        <div className="info-detail-reward-info" id={data.seoTitle + "reward"}>
          <div>{psString("profile-payout-txt-1")} <span className="font-weight-bold">{(!reward ? 0 : reward)} DECK</span> {psString("profile-payout-txt-2")}</div>
        </div>
      );
    } else {
      return (
        <div className="info-detail-reward-info reward-info-not-registered" id={data.seoTitle + "reward"}>
          <div className="reward-info-not-registered-syntax">{psString("payout-registered")}</div>
          {psString("payout-text-2")}
          <span className="font-weight-bold ml-1">{(!reward ? 0 : reward)} DECK</span>
        </div>
      );
    }
  }
}

export default PayoutCard;
