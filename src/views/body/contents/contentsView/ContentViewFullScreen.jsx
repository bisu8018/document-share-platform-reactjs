import React, { Component } from "react";
import Fullscreen from "react-full-screen";
import FileDownload from "js-file-download";
import { Link } from "react-router-dom";
import * as restapi from "apis/DocApi";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";

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
import EditDocumentModal from "../../../../components/modal/EditDocumentModal";

class ContentViewFullScreen extends Component {

  state = {
    isFull: false,
    dataKey: null,
    totalPages: 0,
    text: ""
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

  getPageNum = (page) => {
    this.setState({page : page})
  };

  componentWillUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void {
    this.checkDocumentInBlockChain();
    return true;
  }

  render() {
    const { documentData, documentText, drizzleApis, tagList } = this.props;
    const { page, totalPages, isFull, dataKey } = this.state;
    let badgeReward = drizzleApis.toEther(documentData.latestReward);
    let badgeVote = drizzleApis.toEther(documentData.latestVoteAmount) || 0;
    let badgeView = documentData.totalViewCount ? documentData.totalViewCount : 0;
    let accountId = documentData.accountId || "";
    let url = window.location.href;

    if (totalPages !== documentData.totalPages) {
      this.setState({ totalPages: documentData.totalPages });
    }

    return (

      <div className="u__view">
        <Fullscreen enabled={isFull} onChange={isFull => this.setState({ isFull })}>

          <div className="view_top">
            <ContentViewCarousel id="pageCarousel" target={documentData} documentText={documentText} tracking={true} getPageNum={(page)=> {this.getPageNum(page)}}/>
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
              {accountId === this.getAuthSub() && documentData &&
              <EditDocumentModal documentData={documentData} tagList={tagList}/>
              }

              <CopyModal/>

              <Tooltip title="Download this document" placement="bottom">
                <div className="share-btn" onClick={this.handleDownloadContent}>
                  <i className="material-icons">save_alt</i>
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

              <ContentViewRegistBlockchainButton documentData={documentData} dataKey={dataKey}
                                                 drizzleApis={drizzleApis}/>
              <VoteDocument documentData={documentData} dataKey={dataKey} drizzleApis={drizzleApis}/>
            </div>

            <Link to={"/author/" + documentData.accountId} className="info_name"
                  title={"Go to profile page of " + (documentData.nickname ? documentData.nickname : documentData.accountId)}>
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

              <div className="sns-share-icon-wrapper">

                <Tooltip title="Share with Twitter" placement="bottom">
                  <div className="float-right d-inline-block">
                    <TwitterShareButton url={url} className="sns-share-icon" hashtags={documentData.tags}
                                        title={documentData.title}>
                      <TwitterIcon size={28}/>
                    </TwitterShareButton>
                  </div>
                </Tooltip>

                <Tooltip title="Share with Line" placement="bottom">
                <div className="float-right d-inline-block">
                  <LinkedinShareButton url={url} className="sns-share-icon " title={documentData.title}>
                    <LinkedinIcon size={28}/>
                  </LinkedinShareButton>
                 </div>
                </Tooltip>

                <Tooltip title="Share with Facebook" placement="bottom">
                <div className="float-right d-inline-block">
                  <FacebookShareButton url={url} className="sns-share-icon">
                    <FacebookIcon size={28}/>
                  </FacebookShareButton>
                </div>
                </Tooltip>
              </div>

              <hr className="mb-4"/>
              <div className="view_content-desc">
              {documentText[page]}
              </div>
            </div>
            <hr/>

            {/*<ContentViewComment/>*/}
          </div>


        </Fullscreen>
      </div>
    );
  }
}

export default ContentViewFullScreen;
