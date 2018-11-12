import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Badge from "components/Badge/Badge.jsx";
import ContentList from "contents/ContentList";
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from 'react-spinkit';
import { Link } from 'react-router-dom';
import * as restapi from 'apis/DocApi';
import AuthorSummary from 'profile/AuthorSummary';
import CuratorRewardOnUserDocument from 'profile/CuratorRewardOnUserDocument';
import DollarWithDeck from 'profile/DollarWithDeck';
import DeckInShort from 'profile/DeckInShort';
import CuratorClaim from 'profile/CuratorClaim';
import Tooltip from '@material-ui/core/Tooltip';

const style = {
  badge: {
    marginTop: "0",
    marginLeft: "15px",
    marginBottom: "5px",
  }
};

class CuratorDocumentView extends React.Component {

  state ={
    document: null
  }

  getContentInfo = (documentId) => {
    restapi.getDocument(documentId).then((res) => {
      //console.log(res.data);
      this.setState({document:res.data.document});
    });

  }

  componentWillMount() {
    const {documentId, drizzleApis} = this.props;

    this.getContentInfo(documentId);

  }

  render() {
      const {classes, drizzleApis, handleCurator3DayRewardOnDocuments, accountId} = this.props;

      if(!this.state.document) return "Loading Document";

      const document = this.state.document;

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
            <CuratorClaim {...this.props} accountId={accountId} document={this.state.document} />
        </div>
      );
  }

}

export default withStyles(style)(CuratorDocumentView);
