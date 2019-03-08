import React from "react";
import { Link } from "react-router-dom";
import LinesEllipsis from "react-lines-ellipsis";

import DollarWithDeck from "../profile/DollarWithDeck";
import DeckInShort from "../profile/DeckInShort";
import Common from "../../../common/Common";

class ContentListItem extends React.Component {
  render() {
    const { result, drizzleApis } = this.props;
    const badgeReward = drizzleApis.toEther(result.confirmAuthorReward);
    const badgeVote = drizzleApis.toEther(result.confirmVoteAmount);
    const badgeView = result.totalViewCount ? result.totalViewCount : 0;
    let imageUrl = Common.getThumbnail(result.documentId, 1);

    if (result.documentName.lastIndexOf(".dotx") > 0 || result.documentName.lastIndexOf(".dot") > 0 || result.documentName.lastIndexOf(".docx") > 0) {
      imageUrl = Common.getPageView(result.documentId, 1);
    }

    return (
      <div className="row u_center_inner" key={result.documentId}>

        <div className="col-sm-3 col-md-3 col-thumb">
          <Link to={"/content/view/" + result.documentId}>
            <div className="thumb_image">
              <img src={imageUrl} alt={result.title} className="img-fluid"/>
            </div>
          </Link>
        </div>

        <div className="col-sm-9 col-md-9 col-details_info">
          <dl className="details_info">
            <dt className="blind">info desc</dt>
            <Link to={"/content/view/" + result.documentId}>
              <dd className="info_title">  {result.title ? result.title : result.documentName} </dd>
            </Link>
            <Link to={"/author/" + result.accountId} className="info_name">
              <i className="material-icons img-thumbnail">face</i>
              {result.nickname ? result.nickname : result.accountId}
            </Link>
            <span className="info_date">
              {Common.dateAgo(result.created) === 0 ? "Today" : Common.dateAgo(result.created) + " days ago"}
              </span>
            <Link to={"/content/view/" + result.documentId} className="info_desc">
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
              <span className="view_date view-reward">  <DollarWithDeck deck={badgeReward}
                                                                        drizzleApis={drizzleApis}/></span>
              <span className="view_date view-reward">VOTE <DeckInShort deck={badgeVote}/></span>
            </dd>
          </dl>
        </div>
      </div>
    );
  }
}

export default ContentListItem;
