import React, { Component } from "react";
import { APP_PROPERTIES } from "properties/app.properties";
import Fullscreen from "react-full-screen";
import { Link } from "react-router-dom";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton
} from "react-share";
import Common from "../../../../config/common";
import log from "../../../../config/log";
import Tooltip from "@material-ui/core/Tooltip";
import MainRepository from "../../../../redux/MainRepository";
import EditDocumentModalContainer from "../../../../container/common/modal/EditDocumentModalContainer";
import ContentViewCarouselContainer
  from "../../../../container/body/contents/contentsView/ContentViewCarouselContainer";
import Linkify from "react-linkify";
import RegBlockchainBtnContainer from "../../../../container/body/contents/contentsView/RegBlockchainBtnContainer";
import VoteDocumentModalContainer from "../../../../container/common/modal/VoteDocumentModalContainer";
import PayoutCard from "../../../common/card/PayoutCard";
import { psString } from "../../../../config/localization";
import PublishModalContainer from "../../../../container/common/modal/PublishModalContainer";
import DeleteDocumentModalContainer from "../../../../container/common/modal/DeleteDocumentModalContainer";
import CopyModalContainer from "../../../../container/common/modal/CopyModalContainer";
import ContentViewComment from "./ContentViewComment";
import { FadingCircle } from "better-react-spinkit";


class ContentViewFullScreen extends Component {

  state = {
    isFull: false,
    carouselClass: null,
    text: "",
    error: null,
    eventId: null,
    emailFlag: false,
    reward: 0,
    isDocumentExist: null,
    downloadLoading: false,
  };


  // 초기화
  init = () => {
    log.ContentViewFullscreen.init();
    this.getReward();
  };

  // 리워드 정보 표시
  showRewardInfo = id => {
    if (document.getElementById(id)) document.getElementById(id).style.display = "block";
  };


  // 리워드 정보 숨김
  hideRewardInfo = id => {
    if (document.getElementById(id)) document.getElementById(id).style.display = "none";
  };


  //전체화면 전환
  goFull = () => {
    let element = document.getElementsByClassName("selected")[0].firstChild,
      imgWidth = element.clientWidth,
      imgHeight = element.clientHeight,
      deviceRatio = window.innerWidth / window.innerHeight,
      imgRatio = imgWidth / imgHeight;

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
  getPageNum = page => this.setState({ page: page });


  //문서 다운로드
  getContentDownload = (accountId, documentId, documentName) => {
    this.setState({ downloadLoading: true });

    MainRepository.Document.getDocumentDownloadUrl({ documentId: documentId }).then(result => {
        const a = document.createElement("a");

        a.style.display = "none";
        document.body.appendChild(a);
        a.href = result.downloadUrl;
        a.setAttribute("download", documentName);
        a.click();

        window.URL.revokeObjectURL(a.href);
        document.body.removeChild(a);

        this.setState({ downloadLoading: false });
      }, err =>
        this.setState({ downloadLoading: false }, () => log.ContentViewFullscreen.getContentDownload(err))
    );
  };


  //Web3에서 보상액 GET
  getReward = () => {
    const { documentData, getWeb3Apis } = this.props;
    getWeb3Apis.getNDaysRewards(documentData.documentId, 7).then(res => {
      log.ContentViewFullscreen.getReward();
      let reward = Common.toEther(res);
      this.setState({ reward: reward });
    }, err => log.ContentViewFullscreen.getReward(err));
  };


  // 설정창 관리
  handleSetting = () => document.getElementById("viewer-option-table").classList.remove("d-none");


  //전체화면 전환 컨트롤
  handleFullChange = _isFull => {
    if (this.state.isFull !== _isFull) this.goFull();
  };


  //이메일 입력 여부 Flag
  handleEmailFlag = flag => this.setState({ emailFlag: flag });


  //문서 다운로드 전 데이터 SET
  handleDownloadContent = () => {
    const { getMyInfo, documentData, setAlertCode } = this.props;

    if (!documentData) return setAlertCode(2091);
    if (!MainRepository.Account.isAuthenticated() && !getMyInfo.email) return setAlertCode(2003);

    const accountId = documentData.accountId,
      documentId = documentData.documentId,
      documentName = documentData.documentName;

    this.getContentDownload(accountId, documentId, documentName);
  };


  componentWillMount(): void {
    this.init();
  }


  render() {
    const { documentData, documentText, author, getCreatorDailyRewardPool, totalViewCountInfo, getIsMobile, update } = this.props;
    const { page, isFull, carouselClass, emailFlag, downloadLoading } = this.state;

    let vote = Common.toEther(documentData.latestVoteAmount) || 0,
      reward = Common.toEther(Common.getAuthorNDaysReward(documentData, getCreatorDailyRewardPool, totalViewCountInfo, 7)),
      view = documentData.latestPageview || 0,
      accountId = documentData.accountId || "",
      profileUrl = author ? author.picture : null,
      identification = author ? (author.username && author.username.length > 0 ? author.username : author.email) : documentData.accountId,
      ogUrl = APP_PROPERTIES.domain().embed + documentData.seoTitle;

    return (

      <article
        className={"col-md-12 col-lg-8 view_left u__view " + (isFull && (carouselClass === "deviceRatio" ? "device-ratio" : "img-ratio"))}>
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
          {accountId === Common.getMySub() &&
          <div className="view-option-btn" id="viewer-option-btn">
            <i className="material-icons" onClick={() => this.handleSetting()}>more_vert</i>
            <div className="option-table d-none" id="viewer-option-table">
              <div className="option-table-btn" onClick={() => this.handleDownloadContent()}>Download</div>
              {documentData &&
              <EditDocumentModalContainer documentData={documentData}/>}
              {!documentData.isPublic && (accountId === Common.getMySub() && documentData) &&
              <DeleteDocumentModalContainer documentData={documentData}/>}
            </div>
          </div>
          }

          <div className="u_title pt-2 pb-2 mt-2 mb-2">
            {documentData.title ? documentData.title : ""}
          </div>

          <div>
            <Link to={"/" + identification} className="info_name"
                  title={"Go to profile page of " + identification}>
              {profileUrl ?
                <img src={profileUrl} alt="profile" onClick={() => Common.scrollTop()}/> :
                <i className="material-icons img-thumbnail" onClick={() => Common.scrollTop()}>face</i>
              }
              {identification}
            </Link>

            <div className="info-date-view">
              {Common.timestampToDateTime(documentData.created)}
            </div>
          </div>


          <div className="mb-3 d-inline-block position-relative">

            <span className={"info-detail-reward mr-3 " + (documentData.isRegistry ? "" : "color-not-registered")}
                  onMouseOver={() => this.showRewardInfo(documentData.seoTitle + "reward")}
                  onMouseOut={() => this.hideRewardInfo(documentData.seoTitle + "reward")}>
              $ {Common.deckToDollar(reward)}
              <img className="reward-arrow"
                   src={require("assets/image/icon/i_arrow_down_" + (documentData.isRegistry ? "blue" : "grey") + ".svg")}
                   alt="arrow button"/>
            </span>

            {reward > 0 && <PayoutCard reward={reward} data={documentData}/>}

            <span className="info-detail-view mr-3">{view}</span>
            <span className="info-detail-vote mr-4">{Common.deckStr(vote)}</span>
          </div>


          <div className="d-inline-block mb-3">
            {!documentData.isPublic &&
            <PublishModalContainer documentData={documentData}/>}


            {documentData.isPublic && (accountId === Common.getMySub() && documentData) &&
            <RegBlockchainBtnContainer documentData={documentData}/>
            }

            {documentData.isPublic &&
            <VoteDocumentModalContainer documentData={documentData}/>
            }

            <CopyModalContainer documentData={documentData}/>

            {documentData.isDownload && accountId !== Common.getMySub() &&
            <Tooltip title={psString("tooltip-download")} placement="bottom">
              <div className={"viewer-btn mb-1 " + (downloadLoading ? "btn-disabled" : "")}
                   onClick={() => this.handleDownloadContent()}>
                <i className="material-icons">save_alt</i>{psString("download-btn")}
                {downloadLoading &&
                <div className="download-btn-wrapper"><FadingCircle color="#3681fe" size={17}/></div>}
              </div>
            </Tooltip>
            }

            {accountId === Common.getMySub() &&
            <Tooltip title={psString("tooltip-tracking")} placement="bottom">
              <Link to={{
                pathname: "/tracking/" + identification + "/" + documentData.seoTitle,
                state: {
                  documentData: documentData,
                  documentText: documentText,
                  totalViewCountInfo: totalViewCountInfo
                }
              }}>
                <div className="viewer-btn" onClick={() => Common.scrollTop()}>
                  <i className="material-icons">bar_chart</i> {psString("tracking-btn")}
                </div>
              </Link>
            </Tooltip>
            }
          </div>


          <div className="hr mb-2"/>


          <div className="view_desc">
            <Linkify properties={{
              title: psString("viewer-page-title-1"),
              rel: "nofollow",
              target: "_blank",
              style: { color: "#3681fe", fontWeight: "400" }
            }}>{documentData.desc}</Linkify>

            <div className="view_tag mb-3">
              {documentData.tags ? documentData.tags.map((tag, index) => (
                <Link title={"Link to " + tag + " tag"} to={"/latest/" + tag} key={index}
                      onClick={() => Common.scrollTop()}
                      className="tag"> {tag} </Link>
              )) : ""}
            </div>

            <div className="sns-share-icon-wrapper mb-3">
              <Tooltip title={psString("viewer-page-sns-linkedin")} placement="bottom">
                <div className="d-inline-block mr-3">
                  <LinkedinShareButton url={ogUrl} className="sns-share-icon " title={documentData.title}>
                    <img src={require("assets/image/sns/ic-sns-linkedin-color.png")} alt="linkedin sns icon"/>
                  </LinkedinShareButton>
                </div>
              </Tooltip>

              <Tooltip title={psString("viewer-page-sns-fb")} placement="bottom">
                <div className="d-inline-block mr-3">
                  <FacebookShareButton url={ogUrl} className="sns-share-icon">
                    <img src={require("assets/image/sns/ic-sns-facebook-color.png")} alt="facebook sns icon"/>
                  </FacebookShareButton>
                </div>
              </Tooltip>

              <Tooltip title={psString("viewer-page-sns-twitter")} placement="bottom">
                <div className="d-inline-block">
                  <TwitterShareButton url={ogUrl} className="sns-share-icon" hashtags={documentData.tags}
                                      title={documentData.title}>
                    <img src={require("assets/image/sns/ic-sns-twitter-color.png")} alt="twitter sns icon"/>
                  </TwitterShareButton>
                </div>
              </Tooltip>


              {documentData.cc &&
              <Tooltip title={psString("viewer-page-cc-title")}
                       placement="bottom">
                <a className="float-right" href="http://creativecommons.org/licenses/by-nc-nd/2.0/kr/"
                   target="_blank" rel="license noopener noreferrer">
                  <img alt="Creative Commons License" className="cc-img"
                       src={require("assets/image/cc/" + (getIsMobile ? "m-" : "") + documentData.cc + ".svg")}/>
                </a>
              </Tooltip>
              }
            </div>


            <div className="hr mb-3"/>

            <div className="view_content-desc mb-5">
              {documentData.forceTracking && emailFlag ?
                <div className="view-content-desc-warning">{psString("vp-email-warning")}</div> :
                <Linkify properties={{
                  title: psString("Link to this URL"),
                  rel: "nofollow",
                  target: "_blank",
                  style: { color: "#0d73f8", fontWeight: "400" }
                }}>{documentText[page - 1]}</Linkify>
              }
            </div>
          </div>

          {update === false && <ContentViewComment/>}

        </div>


      </article>
    )
      ;
  }
}

export default ContentViewFullScreen;
