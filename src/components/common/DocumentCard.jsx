import React from "react";
import Common from "../../util/Common";
import { Link } from "react-router-dom";

class DocumentCard extends React.Component {

  showRewardInfo = (id) => {
    if (document.getElementById(id)) document.getElementById(id).style.display = "block";
  };

  hideRewardInfo = (id) => {
    if (document.getElementById(id)) document.getElementById(id).style.display = "none";
  };

  render() {
    const { idx, path, documentData, getCreatorDailyRewardPool, totalViewCountInfo } = this.props;

    let author = documentData.author;
    let identification = author ? (author.username && author.username.length > 0 ? author.username : author.email) : documentData.accountId;
    let imgUrl = Common.getThumbnail(documentData.documentId, 320, 1, documentData.documentName);
    let profileUrl = author ? author.picture : null;
    let vote = Common.toEther(documentData.latestVoteAmount) || 0;
    let reward = Common.toEther(Common.getAuthorNDaysReward(documentData, getCreatorDailyRewardPool, totalViewCountInfo, 7));
    let view = documentData.latestPageview || 0;

    return (
      <div>
        <div className={"main-category-card mb-3 " + (idx < 3 && "mr-3")}>
          <Link to={"/" + identification + "/" + documentData.seoTitle}>
            <div className="main-category-card-img-wrapper">
              <img src={imgUrl} alt={documentData.title} className="main-category-card-img"/>
            </div>
          </Link>
          <div className="main-category-card-content">
            <div className="main-category-card-title">
              <Link to={"/" + identification + "/" + documentData.seoTitle}
                    title={documentData.title}> {documentData.title ? documentData.title : documentData.documentName}</Link>
            </div>
            <Link to={"/" + identification} className="main-category-card-profile mt-1 mb-1 pt-1 pb-2 w-full">
              {profileUrl ?
                <img src={profileUrl} alt="profile"/> :
                <i className="material-icons img-thumbnail">face</i>
              }
              <span className="main-category-card-name">{identification}</span>
              <span
                className="main-category-card-date"> {Common.dateAgo(documentData.created) === 0 ? "Today" : Common.dateAgo(documentData.created) + " days ago"}</span>
            </Link>
            <div className="main-category-card-count">
              <span className="main-category-card-reward" onMouseOver={() => this.showRewardInfo(path + idx)}
                    onMouseOut={() => this.hideRewardInfo(path + idx)}>
                ${Common.deckToDollar(reward)}
                <i className="material-icons">arrow_drop_down</i>
              </span>
              <span className="main-category-card-vote float-right">{Common.deckStr(vote)}</span>
              <span className="main-category-card-view float-right">{view}</span>
            </div>
          </div>

          {reward > 0 &&
          <div className="main-category-card-reward-info" id={path + idx}>
            Creator payout <span className="font-weight-bold">{(!reward ? 0 : reward)} DECK</span> in 7 days
          </div>
          }
        </div>

      </div>


    );
  }
}

export default DocumentCard;