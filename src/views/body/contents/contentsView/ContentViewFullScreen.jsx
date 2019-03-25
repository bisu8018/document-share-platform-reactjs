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
import MainRepository from "../../../../redux/MainRepository";
import CopyModal from "../../../../components/modal/CopyModal";

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
    if (this.state.isFull) this.setState({ isFull: false });
    if (!this.state.isFull) this.setState({ isFull: true });
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

  getAuthSub = () => {
    let authSub = "";
    let isAuthenticated = MainRepository.Account.isAuthenticated();

    if (isAuthenticated) {
      authSub = MainRepository.Account.getUserInfo().sub || "";
    }

    return authSub;
  };

  componentWillUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void {
    this.checkDocumentInBlockChain();
    return true;
  }

  render() {
    const { documentData, documentText, drizzleApis } = this.props;

    let badgeReward = drizzleApis.toEther(documentData.latestReward);
    let badgeVote = drizzleApis.toEther(documentData.latestVoteAmount) || 0;
    let badgeView = documentData.totalViewCount ? documentData.totalViewCount : 0;
    let accountId = documentData.accountId || "";

    if (this.state.totalPages !== documentData.totalPages) {
      this.setState({ totalPages: documentData.totalPages });
    }

    return (

      <div className="u__view">
        <Fullscreen enabled={this.state.isFull} onChange={isFull => this.setState({ isFull })}>

          <div className="view_top">
            <ContentViewCarousel id="pageCarousel" target={documentData} tracking={true}/>
            <div className="view_screen">
              <i title="Fullsceen button" className="material-icons" onClick={this.goFull}>fullscreen</i>
            </div>
          </div>



          <div className="view_content">
            <div className="u_title h2">   {documentData.title ? documentData.title : ""}</div>
            <div className="col-view">
              <span className="txt_view">{badgeView}</span>
              <span className="view_date view-reward">
                <DollarWithDeck deck={badgeReward} drizzleApis={drizzleApis}/>
              </span>
              <span className="view_date view-reward">
                <DeckInShort deck={badgeVote}/>
              </span>
              <span className="view_date">
                {Common.timestampToDateTime(documentData.created)}
              </span>
            </div>


            <div className="row view_btns_inner">
              {accountId === this.getAuthSub() &&
              <Tooltip title="Settings of this document" placement="bottom">
                  <div className="statistics-btn pt-1"><i className="material-icons">settings</i></div>
                </Tooltip>
              }

              <Tooltip title="Share this document" placement="bottom">
                <div className="share-btn">
                  <i className="material-icons">share</i>
                </div>
              </Tooltip>

              <CopyModal/>

              <Tooltip title="Download this document" placement="bottom">
                <div className="share-btn" onClick={this.handleDownloadContent}>
                  <i className="material-icons">save</i>
                </div>
              </Tooltip>

              {accountId === this.getAuthSub() &&
              <Tooltip title="See statistics of this document" placement="bottom">
                <Link to={{
                  pathname: "/tracking/" + documentData.accountId + "/" + documentData.documentId,
                  state: documentData
                }}>
                  <div className="statistics-btn"><i className="material-icons">bar_chart</i></div>
                </Link></Tooltip>
              }

              <ContentViewRegistBlockchainButton documentData={documentData} dataKey={this.state.dataKey} drizzleApis={drizzleApis}/>
              <VoteDocument documentData={documentData} dataKey={this.state.dataKey} drizzleApis={drizzleApis}/>
            </div>



            <Link to={"/author/" + documentData.accountId} className="info_name" title={"Go to profile page of " + (documentData.nickname ? documentData.nickname : documentData.accountId)}>
              <i className="material-icons img-thumbnail">face</i>
              {documentData.nickname ? documentData.nickname : documentData.accountId}
            </Link>


            <div className="view_tag">
              {documentData.tags ? documentData.tags.map((tag, index) => (
                <Link title={"Link to " + tag + " tag"} to={"/latest/" + tag} key={index}
                      className="tag"> {tag} </Link>
              )) : ""}
            </div>


            <div className="view_desc">
              {documentData.desc ? documentData.desc : ""}
              <hr className="mt-4 mb-4"/>
              {documentText ? documentText : ""}
            </div>


            {/*<ContentViewComment/>*/}
          </div>


        </Fullscreen>
      </div>
    );
  }
}

export default ContentViewFullScreen;
