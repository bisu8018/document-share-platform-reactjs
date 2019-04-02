import React from "react";
import { Link } from "react-router-dom";
import LinesEllipsis from "react-lines-ellipsis";

import DollarWithDeck from "../../../components/common/DollarWithDeck";
import DeckInShort from "../../../components/common/DeckInShort";
import Common from "../../../common/Common";

class ContentListItem extends React.Component {
  render() {
    const { result, drizzleApis } = this.props;

    let badgeReward = drizzleApis.toEther(result.latestReward);
    let badgeVote = drizzleApis.toEther(result.latestVoteAmount) || 0;
    let badgeView = result.totalViewCount ? result.totalViewCount : 0;
    let imageUrl = Common.getThumbnail(result.documentId, 320, 1, result.documentName);
    let profileUrl = result.author ? result.author.picture : null;
    let personality = result.author ? (result.author.username && result.author.username.length > 0 ? result.author.username : result.author.email) : result.accountId;

    return (
      <div className="row u_center_inner" key={result.seoTitle}>

        <div className="col-sm-3 col-md-3 col-thumb  mb-3">
          <Link to={"/" + result.seoTitle}>
            <div className="thumb_image">
              <img src={imageUrl} alt={result.title} className="img-fluid"/>
            </div>
          </Link>
        </div>

        <div className="col-sm-9 col-md-9 col-details_info">
          <dl className="details_info">
            <div className="info_date d-md-inline-block d-none">
              {Common.dateAgo(result.created) === 0 ? "Today" : Common.dateAgo(result.created) + " days ago"}
            </div>
            <dd className="info_title">
              <Link to={"/doc/" + result.seoTitle}
                    title={result.title}> {result.title ? result.title : result.documentName}</Link>
            </dd>
            <Link to={"/author/" + personality} className="info_name"
                  title={personality}>
              {profileUrl ?
                <img src={profileUrl} alt="profile"/> :
                <i className="material-icons img-thumbnail">face</i>
              }
                {personality}
            </Link>
            <Link to={"/doc/" + result.seoTitle} className="info_desc" title="description">
              <LinesEllipsis
                text={result.desc}
                maxLine='2'
                ellipsis='...'
                trimRight
                basedOn='letters'
              />
            </Link>
            <dd className="info_detail">
              <span className="txt_view ">{badgeView}</span>
              <span className="view_date view-reward"><DollarWithDeck deck={badgeReward}
                                                                      drizzleApis={drizzleApis}/></span>
              <span className="view_date view-reward"><DeckInShort deck={badgeVote}/></span>
              <div className="info_date d-inline-block d-md-none">
                {Common.dateAgo(result.created) === 0 ? "Today" : Common.dateAgo(result.created) + " days ago"}
              </div>
            </dd>
          </dl>
        </div>
      </div>
    );
  }
}

export default ContentListItem;
