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
    if (!this.props.document) {
      console.log("getting document meta information!");
      return;
    }
    const accountId = this.props.document.accountId;
    const documentId = this.props.document.documentId;
    const documentName = this.props.document.documentName;
    this.getContentDownload(accountId, documentId, documentName);
  };


  goFull = () => {
    this.setState({ isFull: true });
  };

  checkDocumentInBlockChain = () => {
    const {document, drizzleApis} = this.props;
    if (!drizzleApis.isInitialized() || !drizzleApis.isAuthenticated()) return;
    if (this.state.dataKey) return;
    if (!document) return;

    try {
      const dataKey = drizzleApis.requestIsExistDocument(document.documentId);
      this.setState({dataKey: dataKey});
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
    const { documentText, ...rest } = this.props;
    if (this.state.totalPages !== this.props.document.totalPages) {
      this.setState({ totalPages: this.props.document.totalPages });
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



    const badgeReward = this.props.drizzleApis.toEther(this.props.document.confirmAuthorReward);
    const badgeVote = this.props.drizzleApis.toEther(this.props.document.confirmVoteAmount);
    const badgeView = this.props.document.totalViewCount ? this.props.document.totalViewCount : 0;

    return (

      <div className="u__view row">

        <Fullscreen enabled={this.state.isFull} onChange={isFull => this.setState({ isFull })}>

          <div className="view_top">
            <ContentViewCarousel id="pageCarousel" target={this.props.document} {...rest} tracking={true}/>

            <div className="view_screen">
              <i className="material-icons" onClick={this.goFull}>fullscreen</i>
            </div>
          </div>
          <div className="view_content">
            <div className="row">
              <div className="col-sm-12">
                <h2 className="u_title">   {this.props.document.title ? this.props.document.title : ""}</h2>
              </div>
              <div className="col-sm-12 col-view">
                <span className="txt_view">{badgeView}</span>
                <span className="view_date view-reward">Reward <span><DollarWithDeck deck={badgeReward}
                                                                                     drizzleApis={this.props.drizzleApis}/></span></span>
                <span className="view_date view-reward">Voting <span><DeckInShort deck={badgeVote}/></span></span>
                <span className="view_date"> {Common.timestampToDateTime(this.props.document.created)}</span>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-12 view_btns_inner">
                <ContentViewRegistBlockchainButton document={ this.props.document } dataKey={ this.state.dataKey } { ...rest } />
                <VoteDocument document={this.props.document} dataKey={ this.state.dataKey } { ...rest } />
                <div className="share-btn" title="Share this document">
                  <i className="material-icons">share</i>
                </div>
                <div className="share-btn" title="Download this document" onClick={this.handleDownloadContent}>
                  <i className="material-icons">save</i>
                </div>
                <Link to={{
                  pathname: "/tracking/" + this.props.document.accountId + "/" + this.props.document.documentId,
                  state: this.props.document
                }}>
                  <div className="statistics-btn" title="See statistics of this document">
                    <i className="material-icons">insert_chart</i>
                  </div>
                </Link>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-12">
                <Link to={"/author/" + this.props.document.accountId} className="info_name"
                      title={"Go to profile page"}>
                  <i className="material-icons img-thumbnail">face</i>
                  {this.props.document.nickname ? this.props.document.nickname : this.props.document.accountId}
                </Link>
                <span className="view_tag">
                     {this.props.document.tags ? this.props.document.tags.map((tag, index) => (
                       <Link title={"Link to " + tag + " tag"} to={"/latest/" + tag} key={index}
                             className="tag"> {tag} </Link>
                     )) : ""}
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-12">
                <p className="view_desc">
                  {this.props.document.desc ? this.props.document.desc : ""}
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
