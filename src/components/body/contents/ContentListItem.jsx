import React from "react";
import { Link } from "react-router-dom";
import LinesEllipsis from "react-lines-ellipsis";
import Common from "../../../util/Common";

class ContentListItem extends React.Component {

  showRewardInfo = (id) => {
    if (document.getElementById(id)) document.getElementById(id).style.display = "block";
  };

  hideRewardInfo = (id) => {
    if (document.getElementById(id)) document.getElementById(id).style.display = "none";
  };

  render() {
    const { result, getCreatorDailyRewardPool, totalViewCountInfo } = this.props;
    let vote = Common.toEther(result.latestVoteAmount) || 0;
    let reward = Common.toEther(Common.getAuthorNDaysReward(result, getCreatorDailyRewardPool, totalViewCountInfo, 7));
    let view = result.latestPageview || 0;
    let imageUrl = Common.getThumbnail(result.documentId, 320, 1, result.documentName);
    let profileUrl = result.author ? result.author.picture : null;
    let identification = result.author ? (result.author.username && result.author.username.length > 0 ? result.author.username : result.author.email) : result.accountId;

    return (
      <div className="row u_center_inner" key={result.seoTitle}>
        <div className="col-thumb">
          <Link to={"/" + identification + "/" + result.seoTitle}>
            <div className="thumb_image">
              <img src={imageUrl} alt={result.title} className="img-fluid"/>
            </div>
          </Link>
        </div>

        <div className="col-details_info details_info">
          <div className="mb-2 detail-title">
            <Link to={"/" + identification + "/" + result.seoTitle}
                  title={result.title}> {result.title ? result.title : result.documentName}</Link>
          </div>
          <div>
            <Link to={"/" + identification} className="info_name mb-2"
                  title={identification}>
              {profileUrl ?
                <img src={profileUrl} alt="profile"/> : <i className="material-icons img-thumbnail">face</i>
              }
              {identification}
            </Link>
            <div className="info_date float-right d-md-inline-block d-none">
              {Common.dateAgo(result.created) === 0 ? "Today" : Common.dateAgo(result.created) + " days ago"}
            </div>
          </div>


          <Link to={"/" + identification + "/" + result.seoTitle} className="info_desc" title="description">
            {result.desc &&
            <LinesEllipsis
              text={result.desc}
              maxLine={2}
              ellipsis='...'
              trimRight
              basedOn='words'
            />
            }
          </Link>


          <div className="info_detail">
            <span className="info-detail-reward mr-3"
                  onMouseOver={() => this.showRewardInfo(result.seoTitle + "reward")}
                  onMouseOut={() => this.hideRewardInfo(result.seoTitle + "reward")}>
              ${Common.deckToDollar(reward)}
              <i className="material-icons">arrow_drop_down</i>
            </span>
            <span className="info-detail-view mr-3">{view}</span>
            <span className="info-detail-vote mr-3">{Common.deckStr(vote)}</span>
          </div>

          {reward > 0 &&
          <div className="info-detail-reward-info" id={result.seoTitle + "reward"}>
            Creator payout <span className="font-weight-bold">{(!reward ? 0 : reward)} DECK</span> in 7 days
          </div>
          }

        </div>
      </div>
    );
  }
}

export default ContentListItem;
