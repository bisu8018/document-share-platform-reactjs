import React, { Component } from "react";
import Fullscreen from "react-full-screen";
import { Link } from "react-router-dom";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterShareButton,
  TwitterIcon
} from "react-share";
// import ContentViewComment from "./ContentViewComment";
import Common from "../../../../util/Common";
import Tooltip from "@material-ui/core/Tooltip";
import CopyModal from "../../../modal/CopyModal";
import MainRepository from "../../../../redux/MainRepository";
import EditDocumentModalContainer from "../../../../container/modal/EditDocumentModalContainer";
import ContentViewCarouselContainer
  from "../../../../container/body/contents/contentsView/ContentViewCarouselContainer";
import Linkify from "react-linkify";
import RegBlockchainBtnContainer from "../../../../container/body/contents/contentsView/RegBlockchainBtnContainer";
import VoteDocumentModalContainer from "../../../../container/modal/VoteDocumentModalContainer";

class ContentViewFullScreen extends Component {

  state = {
    isFull: false,
    carouselClass: null,
    text: "",
    error: null,
    eventId: null,
    emailFlag: false,
    reward: 0,
    isDocumentExist: null
  };

  //문서 다운로드
  getContentDownload = (accountId, documentId, documentName) => {
    let params = {
      documentId: documentId
    };
    MainRepository.Document.getDocumentDownloadUrl(params, result => {
      const a = document.createElement("a");

      a.style.display = "none";
      document.body.appendChild(a);
      a.href = result.downloadUrl;
      a.setAttribute("download", documentName);
      a.click();

      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    });
  };


  //이메일 입력 여부 Flag
  handleEmailFlag = (flag) => {
    this.setState({ emailFlag: flag });
  };


  //문서 다운로드 전 데이터 SET
  handleDownloadContent = () => {
    const { getMyInfo, documentData } = this.props;
    if (!documentData) {
      console.log("getting document meta information!");
      return;
    }
    if (!MainRepository.Account.isAuthenticated() && !getMyInfo.email) {
      MainRepository.Account.login();
    }
    const accountId = documentData.accountId;
    const documentId = documentData.documentId;
    const documentName = documentData.documentName;
    this.getContentDownload(accountId, documentId, documentName);
  };


  //전체화면 전환
  goFull = () => {
    let element = document.getElementsByClassName("selected")[0].firstChild;
    let imgWidth = element.clientWidth;
    let imgHeight = element.clientHeight;
    let deviceRatio = window.innerWidth / window.innerHeight;
    let imgRatio = imgWidth / imgHeight;

    if (this.state.isFull) {
      this.setState({ isFull: false });
    } else {
      this.setState({ isFull: true }, () => {
        if (deviceRatio > imgRatio) {
          this.setState({ carouselClass: "deviceRatio" });
        } else {
          this.setState({ carouselClass: "imgRatio" });
        }
      });
    }
  };

  //현재 page GET
  getPageNum = (page) => {
    this.setState({ page: page });
  };

  //Web3에서 보상액 GET
  getReward = () => {
    const { documentData, getWeb3Apis } = this.props;
    getWeb3Apis.getNDaysRewards(documentData.documentId, 7).then(res => {
      let reward = Common.toEther(res);
      this.setState({ reward: reward });
    });
  };

  //전체화면 전환 컨트롤
  handleFullChange = (_isFull) => {
    const { isFull } = this.state;
    if (isFull !== _isFull) {
      this.goFull();
    }
  };

  componentWillMount(): void {
    this.getReward();
  }

  render() {
    const { documentData, documentText, author, getCreatorDailyRewardPool, totalViewCountInfo } = this.props;
    const { page, isFull, carouselClass, emailFlag } = this.state;

    let vote = Common.toEther(documentData.latestVoteAmount) || 0;
    let reward = Common.toEther(Common.getAuthorNDaysReward(documentData, getCreatorDailyRewardPool, totalViewCountInfo, 7));
    let view = documentData.latestPageview || 0;
    let accountId = documentData.accountId || "";
    let url = window.location.href;
    let profileUrl = author ? author.picture : null;
    let identification = author ? (author.username && author.username.length > 0 ? author.username : author.email) : documentData.accountId;

    return (

      <div className={"u__view " + (isFull && (carouselClass === "deviceRatio" ? "device-ratio" : "img-ratio"))}>
        <div className="view_top">
          <Fullscreen enabled={isFull} onChange={isFull => this.handleFullChange(isFull)}>

            <ContentViewCarouselContainer id="pageCarousel" target={documentData} documentText={documentText}
                                          tracking={true} handleEmailFlag={this.handleEmailFlag}
                                          getPageNum={(page) => {
                                            this.getPageNum(page);
                                          }}/>

            <div className="view_screen">
              <i title="Fullscreen button" className="material-icons" onClick={this.goFull}>fullscreen</i>
            </div>
          </Fullscreen>
        </div>


        <div className="view_content">
          <div className="u_title pt-2 pb-2 mt-2 mb-2">   {documentData.title ? documentData.title : ""}</div>


          <div>
            <Link to={"/" + identification} className="info_name mb-2"
                  title={"Go to profile page of " + identification}>
              {profileUrl ?
                <img src={profileUrl} alt="profile"/> :
                <i className="material-icons img-thumbnail">face</i>
              }
              {identification}
            </Link>

            <div className="info_date">
              {Common.timestampToDateTime(documentData.created)}
            </div>
          </div>


          <div className="mb-3 d-inline-block">
            <span className="info-detail-reward mr-2">
              ${Common.deckToDollar(reward)}
              <i className="material-icons">arrow_drop_down</i>
            </span>
            <span className="info-detail-view mr-3">{view}</span>
            <span className="info-detail-vote mr-4">{Common.deckStr(vote)}</span>
          </div>
          <div className="d-inline-block mb-3">
            {accountId === Common.getMySub() && documentData &&
            <EditDocumentModalContainer documentData={documentData}/>}

            <CopyModal/>

            {documentData.isDownload &&
            <Tooltip title="Download this document" placement="bottom">
              <div className="viewer-btn" onClick={this.handleDownloadContent}>
                <i className="material-icons">save_alt</i> Download
              </div>
            </Tooltip>
            }

            {accountId === Common.getMySub() &&
            <Tooltip title="Track activity of your audience." placement="bottom">
              <Link to={{
                pathname: "/tracking/" + identification + "/" + documentData.seoTitle,
                state: {
                  documentData: documentData,
                  documentText: documentText,
                  totalViewCountInfo: totalViewCountInfo
                }
              }}>
                <div className="viewer-btn"><i className="material-icons">bar_chart</i> Tracking</div>
              </Link></Tooltip>
            }

            <RegBlockchainBtnContainer documentData={documentData}/>
            <VoteDocumentModalContainer documentData={documentData}/>
          </div>

          <hr className="mt-2 mb-3"/>

          <div className="view_desc">
            <Linkify properties={{
              title: "Link to this URL",
              rel: "nofollow",
              target: "_blank",
              style: { color: "#7fc241", fontWeight: "400" }
            }}>{documentData.desc}</Linkify>

            <div className="view_tag mb-3">
              {documentData.tags ? documentData.tags.map((tag, index) => (
                <Link title={"Link to " + tag + " tag"} to={"/latest/" + tag} key={index}
                      className="tag"> {tag} </Link>
              )) : ""}
            </div>

            <div className="sns-share-icon-wrapper mb-3">
              <Tooltip title="Share with Facebook" placement="bottom">
                <div className="d-inline-block mr-2">
                  <FacebookShareButton url={url} className="sns-share-icon">
                    <FacebookIcon size={28}/>
                  </FacebookShareButton>
                </div>
              </Tooltip>


              <Tooltip title="Share with Line" placement="bottom">
                <div className="d-inline-block mr-2">
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


            <hr className="mb-3"/>

            <div className="view_content-desc mb-5">
              {documentData.forceTracking && emailFlag ?
                <div className="view-content-desc-warning">If you want to read the document, you need to enter
                  email.</div> :
                <Linkify properties={{
                  title: "Link to this URL",
                  rel: "nofollow",
                  target: "_blank",
                  style: { color: "#0d73f8", fontWeight: "400" }
                }}>{documentText[page - 1]}</Linkify>
              }
            </div>
          </div>

          {/*<ContentViewComment/>*/}

        </div>


      </div>
    );
  }
}

export default ContentViewFullScreen;
