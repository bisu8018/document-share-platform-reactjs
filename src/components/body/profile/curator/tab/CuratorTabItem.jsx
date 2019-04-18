import React from "react";
import { Link } from "react-router-dom";

import DollarWithDeck from "../../../../common/DollarWithDeck";
import DeckInShort from "../../../../common/DeckInShort";
import Common from "../../../../../util/Common";
import LinesEllipsis from "react-lines-ellipsis";
import CuratorClaimContainer from "../../../../../container/body/profile/curator/CuratorClaimContainer";

class CuratorTabItem extends React.Component {
  state = {
    badgeReward: 0
  };

  getBadgeReward = () => {
    const { document, getWeb3Apis } = this.props;
    let badgeReward = Common.toEther(getWeb3Apis.getNDaysRewards(document.documentId,7));
    this.setState({badgeReward : badgeReward});
  };

  componentWillMount(): void {
    this.getBadgeReward();
  }

  render() {
    const { document, accountId } = this.props;
    const { badgeReward } = this.state;

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
          <dl className="details_info">
            <Link to={"/" + identification + "/" + document.seoTitle}>
              <dd className="info_title">  {document.title ? document.title : document.documentName} </dd>
            </Link>
            <Link to={"/" + identification} className="info_name">
              {profileUrl ?
                <img src={profileUrl} alt="profile"/> :
                <i className="material-icons img-thumbnail">face</i>
              }
              {identification}
            </Link>
            <span className="info_date">
                             {Common.dateAgo(document.created) === 0 ? "Today" : Common.dateAgo(document.created) + " days ago"}
                          </span>
            <Link to={"/" + identification + "/" + document.seoTitle} className="info_desc">
              <LinesEllipsis
                text={document.desc || ""}
                maxLine='2'
                ellipsis='...'
                trimRight
                basedOn='words'
              />
            </Link>
            <dd className="info_detail">
              <span className="txt_view ">{badgeView}</span>
              <span className="view_date view-reward"><DollarWithDeck deck={badgeReward} /></span>
              <span className="view_date view-reward"><DeckInShort deck={badgeVote}/></span>
            </dd>
          </dl>
        </div>

        <CuratorClaimContainer {...this.props} accountId={accountId} document={document}/>

      </div>

    );
  }

}

export default CuratorTabItem;
