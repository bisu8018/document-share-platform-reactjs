import React from "react";
import { Link } from "react-router-dom";
import LinesEllipsis from "react-lines-ellipsis";

import DollarWithDeck from "../../../components/common/DollarWithDeck";
import DeckInShort from "../../../components/common/DeckInShort";
import Common from "../../../common/Common";

class ContentListItem extends React.Component {
  render() {
    const { result, drizzleApis } = this.props;
    const badgeReward = drizzleApis.toEther(result.latestReward);
    const badgeVote = drizzleApis.toEther(result.latestVoteAmount) || 0;
    const badgeView = result.totalViewCount ? result.totalViewCount : 0;
    let imageUrl = Common.getThumbnail(result.documentId, 1);

    if (result.documentName.lastIndexOf(".dotx") > 0 || result.documentName.lastIndexOf(".dot") > 0 || result.documentName.lastIndexOf(".docx") > 0) {
      imageUrl = Common.getPageView(result.documentId, 1);
    }

    return (
      <div className="row u_center_inner" key={result.seoTitle}>

        <div className="col-sm-3 col-md-3 col-thumb">
          <Link to={"/doc/" + result.seoTitle}>
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
              <Link to={"/doc/" + result.seoTitle} title={result.title}> {result.title ? result.title : result.documentName}</Link>
            </dd>
            <Link to={"/author/" + result.accountId} className="info_name"
                  title={result.nickname ? result.nickname : result.accountId}>
              <i className="material-icons img-thumbnail">face</i>
              {result.nickname ? result.nickname : result.accountId}
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
