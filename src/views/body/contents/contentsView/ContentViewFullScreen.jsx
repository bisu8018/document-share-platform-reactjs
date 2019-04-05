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
  TwitterIcon
} from "react-share";

import DollarWithDeck from "../../../../components/common/DollarWithDeck";
import DeckInShort from "../../../../components/common/DeckInShort";
import ContentViewCarousel from "./ContentViewCarousel";
import ContentViewRegistBlockchainButton from "./ContentViewRegistBlockchainButton";
// import ContentViewComment from "./ContentViewComment";
import Common from "../../../../common/Common";
import VoteDocument from "../../../../components/modal/VoteDocument";
import Tooltip from "@material-ui/core/Tooltip";
import CopyModal from "../../../../components/modal/CopyModal";
import EditDocumentModal from "../../../../components/modal/EditDocumentModal";

class ContentViewFullScreen extends Component {

  state = {
    isFull: false,
    dataKey: null,
    totalPages: 0,
    carouselClass: null,
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
    let element = document.getElementsByClassName("selected")[0].firstChild;
    let imgWidth = element.clientWidth;
    let imgHeight = element.clientHeight;
    let deviceRatio = window.innerWidth/window.innerHeight;
    let imgRatio = imgWidth/imgHeight;

    if (this.state.isFull) {
      this.setState({ isFull: false });
    }else {
      this.setState({ isFull: true }, () => {
        if(deviceRatio > imgRatio){
          this.setState({carouselClass : "deviceRatio"})
        }else{
          this.setState({carouselClass : "imgRatio"})
        }
      });
    }
  };

  checkDocumentInBlockChain = () => {
    const { documentData, drizzleApis } = this.props;
    if (!drizzleApis.isInitialized() || !drizzleApis.isAuthenticated()) return;
    if (this.state.dataKey) return;
    if (!documentData) return;

    try {
      let dataKey = drizzleApis.requestIsExistDocument(documentData.documentId);
      console.log(dataKey);
      this.setState({ dataKey: dataKey });
      //console.log("checkDocumentInBlockChain dataKey  :::::  ", dataKey);
    } catch (e) {
      //console.error("checkDocumentInBlockChain error", e);
    }
  };

  getPageNum = (page) => {
    this.setState({ page: page });
  };

  handleFullChange = (_isFull) => {
    const { isFull } = this.state;
    if(isFull !== _isFull){
      this.goFull();
    }
  };

  componentWillUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void {
    this.checkDocumentInBlockChain();
    return true;
  }

  render() {
    const { documentData, documentText, drizzleApis, tagList, author, myInfo } = this.props;
    const { page, totalPages, isFull, dataKey, carouselClass } = this.state;
    let badgeReward = drizzleApis.toEther(documentData.latestReward);
    let badgeVote = drizzleApis.toEther(documentData.latestVoteAmount) || 0;
    let badgeView = documentData.totalViewCount ? documentData.totalViewCount : 0;
    let accountId = documentData.accountId || "";
    let url = window.location.href;
    let profileUrl = author ? author.picture : null;
    let identification = author ? (author.username && author.username.length > 0 ? author.username : author.email) : documentData.accountId;

    if (totalPages !== documentData.totalPages) {
      this.setState({ totalPages: documentData.totalPages });
    }

    return (

      <div className={"u__view " +  (isFull && (carouselClass === "deviceRatio" ? "device-ratio" : "img-ratio"))}>
        <div className="view_top" >
        <Fullscreen enabled={isFull} onChange={isFull => this.handleFullChange(isFull)}>
            <ContentViewCarousel id="pageCarousel" target={documentData} documentText={documentText} tracking={true} myInfo={myInfo}
                                 getPageNum={(page) => {
                                   this.getPageNum(page);
                                 }}/>
            <div className="view_screen">
              <i title="Fullscreen button" className="material-icons" onClick={this.goFull}>fullscreen</i>
            </div>
        </Fullscreen>
        </div>
        <div className="view_content">
          <div className="u_title h4">   {documentData.title ? documentData.title : ""}</div>
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
            {accountId === Common.getMySub() && documentData &&
            <EditDocumentModal documentData={documentData} tagList={tagList}/>
            }

            <CopyModal/>

            <Tooltip title="Download this document" placement="bottom">
              <div className="share-btn" onClick={this.handleDownloadContent}>
                <i className="material-icons">save_alt</i>
              </div>
            </Tooltip>

            {accountId === Common.getMySub() &&
            <Tooltip title="Tracking activity of your audience." placement="bottom">
              <Link to={{
                pathname: "/tracking/" + identification + "/" + documentData.seoTitle,
                state: { documentData: documentData, documentText: documentText }
              }}>
                <div className="statistics-btn"><i className="material-icons">bar_chart</i></div>
              </Link></Tooltip>
            }

            <ContentViewRegistBlockchainButton documentData={documentData} dataKey={dataKey}
                                               drizzleApis={drizzleApis}/>
            <VoteDocument documentData={documentData} dataKey={dataKey} drizzleApis={drizzleApis}/>
          </div>

          <Link to={"/" + identification} className="info_name"
                title={"Go to profile page of " + identification}>
            {profileUrl ?
              <img src={profileUrl} alt="profile"/> :
              <i className="material-icons img-thumbnail">face</i>
            }
            {identification}
          </Link>

          <div className="sns-share-icon-wrapper">

            <Tooltip title="Share with Facebook" placement="bottom">
              <div className="d-inline-block">
                <FacebookShareButton url={url} className="sns-share-icon">
                  <FacebookIcon size={28}/>
                </FacebookShareButton>
              </div>
            </Tooltip>

            <Tooltip title="Share with Line" placement="bottom">
              <div className="d-inline-block">
                <LinkedinShareButton url={url} className="sns-share-icon " title={documentData.title}>
                  <LinkedinIcon size={28}/>
                </LinkedinShareButton>
              </div>
            </Tooltip>

            <Tooltip title="Share with Twitter" placement="bottom">
              <div className="d-inline-block">
                <TwitterShareButton url={url} className="sns-share-icon" hashtags={documentData.tags}
                                    title={documentData.title}>
                  <TwitterIcon size={28}/>
                </TwitterShareButton>
              </div>
            </Tooltip>

          </div>


          <div className="view_desc">
            {documentData.desc ? documentData.desc : ""}

            <div className="view_tag">
              <i className="material-icons" title="tag">local_offer</i>
              {documentData.tags ? documentData.tags.map((tag, index) => (
                <Link title={"Link to " + tag + " tag"} to={"/latest/" + tag} key={index}
                      className="tag"> {tag} </Link>
              )) : ""}
            </div>

            <hr className="mb-4"/>
            <div className="view_content-desc">
              {documentText[page - 1]}
            </div>
          </div>

          {/*<ContentViewComment/>*/}
        </div>


      </div>
    );
  }
}

export default ContentViewFullScreen;
