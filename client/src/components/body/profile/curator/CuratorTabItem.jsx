import React from "react";
import { Link } from "react-router-dom";

import Common from "../../../../common/common";
import CuratorClaimContainer from "../../../../container/body/profile/curator/CuratorClaimContainer";
import LinesEllipsis from "react-lines-ellipsis";
import { psString } from "../../../../config/localization";
import common_view from "../../../../common/common_view";
import { APP_PROPERTIES } from "../../../../properties/app.properties";

class CuratorTabItem extends React.Component {

  // 리워드 정보 표시
  showRewardInfo = (id) => {
    if (document.getElementById(id)) document.getElementById(id).style.display = "block";
  };

  // 리워드 정보 숨김
  hideRewardInfo = (id) => {
    if (document.getElementById(id)) document.getElementById(id).style.display = "none";
  };


  render() {
    const { document, getCreatorDailyRewardPool, totalViewCountInfo, getIsMobile } = this.props;

    let reward = Common.toEther(common_view.getAuthorNDaysReward(document, getCreatorDailyRewardPool, totalViewCountInfo, 7)),
      vote = document.latestVoteAmount ? Common.toEther(Object.values(document.latestVoteAmount)[0]) : 0,
      view = document.latestPageview || 0,
      identification = document.author ? (document.author.username && document.author.username.length > 0 ? document.author.username : document.author.email) : document.accountId;

    return (

      <div className="row u_center_inner">

        <div className="pl-0 col-12 col-sm-3 col-lg-2 col-thumb">
          <Link to={"/@" + identification + "/" + document.seoTitle} rel="nofollow">
            <div className="tab-thumbnail" onClick={common_view.scrollTop()}>
              <img src={Common.getThumbnail(document.documentId, (getIsMobile ? 640 : 320), 1, document.documentName)}
                   alt={document.title ? document.title : document.documentName}
                   className="main-category-card-img"/>
            </div>
          </Link>
        </div>


        <div className="col-12 col-sm-9 col-lg-10 p-0">
          <div className="details_info-padding">
            <Link to={"/@" + identification + "/" + document.seoTitle} rel="nofollow">
              <div className="info_title mb-1"
                   onClick={() => common_view.scrollTop()}>  {document.title ? document.title : document.documentName} </div>
            </Link>


            <div className="details-info-desc-wrapper">
              <Link to={"/@" + identification + "/" + document.seoTitle} className="info_desc" rel="nofollow"
                    onClick={() => common_view.scrollTop()}>
                {document.desc &&
                <LinesEllipsis
                  text={document.desc}
                  maxLine={2}
                  ellipsis='...'
                  trimRight
                  basedOn='words'
                />
                }
              </Link>
            </div>

            <div className="tab-item-info-wrapper">
              <span className="info-detail-reward mr-3"
                    onMouseOver={() => this.showRewardInfo(document.seoTitle + "rewardVote")}
                    onMouseOut={() => this.hideRewardInfo(document.seoTitle + "rewardVote")}>
                $ {Common.deckToDollar(reward)}
                <img className="reward-arrow" src={APP_PROPERTIES.domain().static + "/image/icon/i_arrow_down_blue.svg"}
                     alt="arrow button"/>
              </span>

              {reward > 0 &&
              <div className="info-detail-reward-info" id={document.seoTitle + "rewardVote"}>
                {psString("profile-payout-txt-3")} <span
                className="font-weight-bold">{(!reward ? 0 : reward)} DECK</span> {psString("profile-payout-txt-2")}
              </div>
              }


              <span className="info-detail-view mr-3">{view}</span>
              <span className="info-detail-vote mr-4">{Common.deckStr(vote)}</span>


              <div className="info-date">
                {common_view.dateTimeAgo(document.created)}
              </div>

              <div className={(getIsMobile ? "mt-2" : "float-right")}>
                <CuratorClaimContainer {...this.props} document={document}/>
              </div>


            </div>
          </div>


        </div>
      </div>

    );
  }

}

export default CuratorTabItem;
