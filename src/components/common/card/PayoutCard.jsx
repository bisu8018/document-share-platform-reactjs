import React from "react";

class PayoutCard extends React.Component {

  render() {
    const { reward, data } = this.props;
    if (data.isRegistry) {
      return (
        <div className="info-detail-reward-info" id={data.seoTitle + "reward"}>
          <div>Creator payout <span className="font-weight-bold">{(!reward ? 0 : reward)} DECK</span> in 7 days</div>
        </div>
      );
    } else {
      return (
        <div className="info-detail-reward-info reward-info-not-registered" id={data.seoTitle + "reward"}>
          <div className="reward-info-not-registered-syntax">NOT REGISTERED ON BLOCKCHAIN</div>
          Creator can be paid
          <span className="font-weight-bold ml-1">{(!reward ? 0 : reward)} DECK</span>
        </div>
      );
    }
  }
}

export default PayoutCard;
