import React from "react";
import { Link } from 'react-router-dom';

import DollarWithDeck from '../../../../../components/common/DollarWithDeck';
import DeckInShort from '../../../../../components/common/DeckInShort';
import Common from "../../../../../common/Common";
import LinesEllipsis from "react-lines-ellipsis";
import CuratorClaim from "../CuratorClaim";

class CuratorTabItem extends React.Component {

  render() {
      const {document, drizzleApis, accountId} = this.props;

      const badgeReward = drizzleApis.toEther(document.confirmAuthorReward);
      const badgeVote = drizzleApis.toEther(document.confirmVoteAmount) || 0;
      const badgeView = document.totalViewCount || 0;

      return (

        <div className="row u_center_inner" >

          <div className="col-sm-3 col-md-3 col-thumb">
            <Link to={"/doc/" + document.documentId}>
              <div className="thumb_image">
                <img src={Common.getThumbnail(document.documentId, 1, document.documentName)}
                     alt={document.title ? document.title : document.documentName} className="img-fluid"/>
              </div>
            </Link>
          </div>

          <div className="col-sm-9 col-md-9 col-details_info">
            <dl className="details_info">
              <Link to={"/doc/" + document.documentId}>
                <dd className="info_title">  {document.title ? document.title : document.documentName} </dd>
              </Link>
              <Link to={"/author/" + document.accountId} className="info_name">
                <i className="material-icons img-thumbnail">face</i>
                {document.nickname ? document.nickname : document.accountId}
              </Link>
              <span className="info_date">
                             {Common.dateAgo(document.created) === 0 ? "Today" : Common.dateAgo(document.created) + " days ago"}
                          </span>
              <Link to={"/doc/" + document.documentId} className="info_desc">
                <LinesEllipsis
                  text={document.desc}
                  maxLine='1'
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
              </dd>
            </dl>
          </div>

          <CuratorClaim {...this.props} accountId={accountId} document={document} />

        </div>

      );
  }

}

export default CuratorTabItem;
