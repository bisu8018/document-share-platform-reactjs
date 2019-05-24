import React from "react";
import { Link } from "react-router-dom";

import Common from "../../../../util/Common";
import CreatorClaimContainer from "../../../../container/body/profile/creator/CreatorClaimContainer";

class CreatorTabItem extends React.Component {

  render() {
    const { document, getCreatorDailyRewardPool, totalViewCountInfo } = this.props;

    let reward = Common.toEther(Common.getAuthorNDaysReward(document, getCreatorDailyRewardPool, totalViewCountInfo, 7));
    let vote = Common.toEther(document.latestVoteAmount) || 0;
    let view = document.latestPageview || 0;
    let identification = document.author ? (document.author.username && document.author.username.length > 0 ? document.author.username : document.author.email) : document.accountId;

    return (

      <div className="row u_center_inner">

        <div className="pl-0 col-3 col-md-4 col-thumb">
          <Link to={"/" + identification + "/" + document.seoTitle}>
            <div className="tab-thumbnail">
              <img src={Common.getThumbnail(document.documentId, 320, 1, document.documentName)}
                   alt={document.title ? document.title : document.documentName} className="img-fluid"/>
            </div>
          </Link>
        </div>

        <div className="col-9 col-md-8 col-details_info">
          <div className="details_info details_info-padding">
            <Link to={"/" + identification + "/" + document.seoTitle}>
              <div className="info_title">  {document.title ? document.title : document.documentName} </div>
            </Link>
            <div className="d-inline-block">
              <span className="info-detail-reward mr-2">
                ${Common.deckToDollar(reward)}
                <i className="material-icons">arrow_drop_down</i>
              </span>
              <span className="info-detail-view mr-3">{view}</span>
              <span className="info-detail-vote mr-4">{Common.deckStr(vote)}</span>
              <div className="info_date">
                {Common.dateAgo(document.created) === 0 ? "Today" : Common.dateAgo(document.created) + " days ago"}
              </div>
            </div>
          </div>
          <div className="float-right claim-btn-wrapper">
            <CreatorClaimContainer {...this.props} document={document}/>
          </div>
        </div>


      </div>

    );
  }

}

export default CreatorTabItem;
