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
import CuratorClaim from 'profile/CuratorClaim';
import Tooltip from '@material-ui/core/Tooltip';

const style = {

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
                   <div className="badge">
                       <Badge color="info">View {document.totalViewCount?document.totalViewCount:0}</Badge>
                       <Badge color="success">
                         <CuratorRewardOnUserDocument handleCurator3DayRewardOnDocuments={handleCurator3DayRewardOnDocuments} document={this.state.document} {...this.props} loggedInAccount={drizzleApis.getLoggedInAccount()} />
                       </Badge>
                   </div>

                </div>
            </Link>
            <CuratorClaim {...this.props} accountId={accountId} document={this.state.document} />
        </div>
      );
  }

}

export default withStyles(style)(CuratorDocumentView);
