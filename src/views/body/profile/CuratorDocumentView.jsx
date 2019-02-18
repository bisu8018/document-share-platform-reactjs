import React from "react";
import { Link } from 'react-router-dom';

import withStyles from "@material-ui/core/styles/withStyles";

import * as restapi from 'apis/DocApi';
import Badge from "components/badge/Badge";
import DollarWithDeck from './DollarWithDeck';
import DeckInShort from './DeckInShort';
import CuratorClaim from './CuratorClaim';

const style = {
  badge: {
    marginTop: "0",
    marginLeft: "15px",
    marginBottom: "5px",
  }
};

class CuratorDocumentView extends React.Component {

  render() {
      const {document, drizzleApis, handleCurator3DayRewardOnDocuments, accountId} = this.props;


      const badgeReward = drizzleApis.toEther(document.confirmAuthorReward);
      const badgeVote = drizzleApis.toEther(document.confirmVoteAmount);
      const badgeView = document.totalViewCount ? document.totalViewCount : 0;

      return (

        <div className="cardSide">

            <Link to={"/content/view/" + document.documentId} >
                <span className="img">
                    <img src={restapi.getThumbnail(document.documentId, 1, document.documentName)} alt={document.title?document.title:document.documentName} />
                </span>
               <div className="inner">
                  <div className="tit"
                      style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}
                      >{document.title?document.title:document.documentName}</div>
                    <div className="descript"
                        style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}>
                   {restapi.convertTimestampToString(document.created)}
                   </div>
                  <div className="descript"
                      style={{ display: '-webkit-box', textOverflow:'ellipsis','WebkitBoxOrient':'vertical'}}
                   >{document.desc}</div>
                </div>
            </Link>

            <div className={this.props.classes.badge}>
              <Badge color="info">View {badgeView} </Badge>
              <Badge color="success">Reward <DollarWithDeck deck={badgeReward} drizzleApis={drizzleApis} /></Badge>
              <Badge color="success">Vote <DeckInShort deck={badgeVote} /></Badge>
            </div>

            <CuratorClaim {...this.props} accountId={accountId} document={document} />

        </div>

      );
  }

}

export default withStyles(style)(CuratorDocumentView);
