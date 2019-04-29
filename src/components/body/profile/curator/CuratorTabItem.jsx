import React from "react";
import { Link } from "react-router-dom";

import DollarWithDeck from "../../../common/DollarWithDeck";
import DeckInShort from "../../../common/DeckInShort";
import Common from "../../../../util/Common";
import CuratorClaimContainer from "../../../../container/body/profile/curator/CuratorClaimContainer";

class CuratorTabItem extends React.Component {

  render() {
    const { document, getCreatorDailyRewardPool, totalViewCountInfo } = this.props;

    let badgeReward = Common.toEther(Common.getAuthorNDaysReward(document, getCreatorDailyRewardPool, totalViewCountInfo, 7));
    let badgeVote = Common.toEther(document.latestVoteAmount) || 0;
    let badgeView = document.latestPageview || 0;
    let profileUrl = document.author ? document.author.picture : null;
    let identification = document.author ? (document.author.username && document.author.username.length > 0 ? document.author.username : document.author.email) : document.accountId;

    return (

      <div className="row u_center_inner">

        <div className="col-sm-3 col-md-3 col-thumb mb-4">
          <Link to={"/" + identification + "/" + document.seoTitle}>
            <div className="thumb_image">
              <img src={Common.getThumbnail(document.documentId, 320, 1, document.documentName)}
                   alt={document.title ? document.title : document.documentName} className="img-fluid"/>
            </div>
          </Link>
        </div>

        <div className="col-sm-9 col-md-9 col-details_info">
          <div className="details_info">
            <Link to={"/" + identification + "/" + document.seoTitle}>
              <div className="info_title">  {document.title ? document.title : document.documentName} </div>
            </Link>
            <Link to={"/" + identification} className="info_name">
              {profileUrl ?
                <img src={profileUrl} alt="profile"/> :
                <i className="material-icons img-thumbnail">face</i>
              }
              {identification}
            </Link>
            <span className="txt_view ">{badgeView}</span>
            <span className="view_date view-reward"><DollarWithDeck deck={badgeReward}/></span>
            <span className="view_date view-reward"><DeckInShort deck={badgeVote}/></span>
            <span
              className="view_date view-reward"> {Common.dateAgo(document.created) === 0 ? "Today" : Common.dateAgo(document.created) + " days ago"}</span>

          </div>
          <div className="float-right claim-btn-wrapper mb-3">
            <CuratorClaimContainer {...this.props} document={document}/>
          </div>
        </div>


      </div>

    );
  }

}

export default CuratorTabItem;
