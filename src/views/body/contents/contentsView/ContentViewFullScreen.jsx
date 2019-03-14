import React, { Component } from "react";
import Fullscreen from "react-full-screen";
import FileDownload from "js-file-download";
import { Link } from "react-router-dom";

import * as restapi from "apis/DocApi";
import DollarWithDeck from "../../../../components/common/DollarWithDeck";
import DeckInShort from "../../../../components/common/DeckInShort";
import ContentViewCarousel from "./ContentViewCarousel";
import ContentViewRegistBlockchainButton from "./ContentViewRegistBlockchainButton";
// import ContentViewComment from "./ContentViewComment";
import Common from "../../../../common/Common";
import VoteDocument from "../../../../components/modal/VoteDocument";
import Tooltip from "@material-ui/core/Tooltip";

class ContentViewFullScreen extends Component {

  state = {
    isFull: false,
    dataKey: null,
    totalPages: 0
  };


  getContentDownload = (accountId, documentId, documentName) => {
    restapi.getContentDownload(accountId, documentId).then((res) => {
      FileDownload(new Blob([res.data]), documentName);
    }).catch((err) => {
      console.error(err);
    });
  };


  handleDownloadContent = () => {
    if (!this.props.documentData) {
      console.log("getting document meta information!");
      return;
    }
    const accountId = this.props.documentData.accountId;
    const documentId = this.props.documentData.documentId;
    const documentName = this.props.documentData.documentName;
    this.getContentDownload(accountId, documentId, documentName);
  };


  goFull = () => {
    this.setState({ isFull: true });
  };

  checkDocumentInBlockChain = () => {
    const { documentData, drizzleApis } = this.props;
    if (!drizzleApis.isInitialized() || !drizzleApis.isAuthenticated()) return;
    if (this.state.dataKey) return;
    if (!documentData) return;

    try {
      const dataKey = drizzleApis.requestIsExistDocument(documentData.documentId);
      this.setState({ dataKey: dataKey });
      //console.log("checkDocumentInBlockChain dataKey  :::::  ", dataKey);
    } catch (e) {
      //console.error("checkDocumentInBlockChain error", e);
    }
  };

  shouldComponentUpdate() {
    this.checkDocumentInBlockChain();
    return true;
  }

  render() {
    const { auth, documentData, documentText, drizzleApis } = this.props;
    if (this.state.totalPages !== documentData.totalPages) {
      this.setState({ totalPages: documentData.totalPages });
    }
    let page = document.getElementById("page");
    if (page !== null) {
      if (this.state.isFull) {
        page.style.display = "none";
      } else {
        page.style.display = "block";
      }
    }
    let full = document.getElementById("full");
    if (full !== null) {
      if (this.state.isFull) {
        full.style.display = "block";
      } else {
        full.style.display = "none";
      }
    }

    const badgeReward =drizzleApis.toEther(documentData.confirmAuthorReward);
    const badgeVote = drizzleApis.toEther(documentData.confirmVoteAmount);
    const badgeView = documentData.totalViewCount ? documentData.totalViewCount : 0;

    return (

      <div className="u__view row">

        <Fullscreen enabled={this.state.isFull} onChange={isFull => this.setState({ isFull })}>

          <div className="view_top">
            <ContentViewCarousel id="pageCarousel" target={documentData} tracking={true}/>

            <div className="view_screen">
              <i className="material-icons" onClick={this.goFull}>fullscreen</i>
            </div>
          </div>
          <div className="view_content">
            <div className="row">
              <div className="col-sm-12">
                <h2 className="u_title">   {documentData.title ? documentData.title : ""}</h2>
              </div>
              <div className="col-sm-12 col-view">
                <span className="txt_view">{badgeView}</span>
                <span className="view_date view-reward">Reward <span><DollarWithDeck deck={badgeReward}
                                                                                     drizzleApis={drizzleApis}/></span></span>
                <span className="view_date view-reward">Voting <span><DeckInShort deck={badgeVote}/></span></span>
                <span className="view_date"> {Common.timestampToDateTime(documentData.created)}</span>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-12 view_btns_inner">
                {drizzleApis.isAuthenticated() && auth.isAuthenticated() &&
                  <span>
                    <ContentViewRegistBlockchainButton documentData={documentData} dataKey={this.state.dataKey}  drizzleApis={drizzleApis} />
                    <VoteDocument documentData={documentData} dataKey={this.state.dataKey}  drizzleApis={drizzleApis} auth={auth} />
                  </span>
                }
                <Tooltip title="Share this document" placement="bottom">
                  <div className="share-btn">
                    <i className="material-icons">share</i>
                  </div>
                </Tooltip>
                <Tooltip title="Download this document" placement="bottom">
                  <div className="share-btn" onClick={this.handleDownloadContent}>
                    <i className="material-icons">save</i>
                  </div>
                </Tooltip>
                <Tooltip title="See statistics of this document" placement="bottom">
                  <Link to={{
                    pathname: "/tracking/" + documentData.accountId + "/" + documentData.documentId,
                    state: documentData
                  }}>
                    <div className="statistics-btn">
                      <i className="material-icons">insert_chart</i>
                    </div>
                  </Link>
                </Tooltip>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-12">
                <Link to={"/author/" + documentData.accountId} className="info_name" title="Go to profile page">
                  <i className="material-icons img-thumbnail">face</i>
                  {documentData.nickname ? documentData.nickname : documentData.accountId}
                </Link>
                <span className="view_tag">
                     {documentData.tags ? documentData.tags.map((tag, index) => (
                       <Link title={"Link to " + tag + " tag"} to={"/latest/" + tag} key={index}
                             className="tag"> {tag} </Link>
                     )) : ""}
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-12">
                <p className="view_desc">
                  {documentData.desc ? documentData.desc : ""}
                </p>
                <p className="view_editor">
                  {documentText ? documentText : ""}
                </p>
              </div>
            </div>

            {/*<ContentViewComment/>*/}
          </div>

        </Fullscreen>

      </div>
    );
  }
}

export default ContentViewFullScreen;
