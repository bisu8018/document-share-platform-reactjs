import React, { Component } from "react";
import { APP_PROPERTIES } from "properties/app.properties";
import { Link } from "react-router-dom";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton
} from "react-share";
import Common from "../../../../common/common";
import log from "../../../../config/log";
import Tooltip from "@material-ui/core/Tooltip";
import MainRepository from "../../../../redux/MainRepository";
import EditDocumentModalContainer from "../../../../container/common/modal/EditDocumentModalContainer";
import ContentViewCarouselContainer
  from "../../../../container/body/contents/contentsView/ContentViewCarouselContainer";
import RegBlockchainBtnContainer from "../../../../container/body/contents/contentsView/RegBlockchainBtnContainer";
import VoteDocumentModalContainer from "../../../../container/common/modal/VoteDocumentModalContainer";
import PayoutCard from "../../../common/card/PayoutCard";
import { psString } from "../../../../config/localization";
import PublishModalContainer from "../../../../container/common/modal/PublishModalContainer";
import DeleteDocumentModalContainer from "../../../../container/common/modal/DeleteDocumentModalContainer";
import CopyModalContainer from "../../../../container/common/modal/CopyModalContainer";
import ContentViewComment from "./ContentViewComment";
import { FadingCircle } from "better-react-spinkit";
import common_view from "../../../../common/common_view";
import PublishCompleteModalContainer from "../../../../container/common/modal/PublishCompleteModalContainer";


class ContentViewFullScreen extends Component {

  state = {
    carouselClass: null,
    text: "",
    error: null,
    eventId: null,
    emailFlag: false,
    reward: 0,
    downloadLoading: false,
    completeModalOpen: false,
    isPublic: this.props.documentData.isPublic || false,
    isRegistry: this.props.documentData.isRegistry || false,
    bookmarkFlag: false
  };


  // 초기화
  init = () => {
    if (APP_PROPERTIES.ssr) return;

    log.ContentViewFullscreen.init();
    this.getReward();
    this.checkBookmark();
  };


  // 리워드 정보 표시
  showRewardInfo = id => {
    if (document.getElementById(id)) document.getElementById(id).style.display = "block";
  };


  // 리워드 정보 숨김
  hideRewardInfo = id => {
    if (document.getElementById(id)) document.getElementById(id).style.display = "none";
  };


  // 등록 버튼 트리거
  triggerRegisterBtn = () => document.getElementById("RegBlockchainBtn").click();


  // 찜하기
  checkBookmark = () => {
    const { getMyList, documentData } = this.props;

    let flag;

    if (getMyList.resultList) {
      flag = getMyList.resultList.filter(v => v._id === documentData._id).length > 0;
    } else {
      flag = false;
    }

    this.setState({ bookmarkFlag: flag });
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
    const { getWeb3Apis, documentData } = this.props;
    getWeb3Apis.getNDaysRewards(documentData.documentId, 7).then(res => {
      log.ContentViewFullscreen.getReward();
      let reward = Common.toEther(res);
      this.setState({ reward: reward });
    }).catch(err => log.ContentViewFullscreen.getReward(err));
  };


  //  문서 정보 state의 isPublish 업데이트
  setIsPublish = () => {
    return new Promise((resolve) => {
      this.setState({ isPublic: true }, () => {
        resolve();
      });
    });
  };


  //  문서 정보 state의 isRegistry 업데이트
  setIsRegistry = () => {
    return new Promise((resolve) => {
      this.setState({ isRegistry: true }, () => {
        resolve();
      });
    });
  };


  // publish completed modal 종료 관리
  handleCompleteModalOpen = () => this.setState({ completeModalOpen: true });


  // publish completed modal 종료 관리
  handleCompleteModalClose = () => this.setState({ completeModalOpen: false });


  // 설정창 관리
  handleSetting = () => document.getElementById("viewer-option-table").classList.remove("d-none");


  // 퍼블리시 완료 후 관리
  handleAfterPublish = () => this.setIsPublish()
    .then(() => this.handleCompleteModalOpen())
    .then(() => this.triggerRegisterBtn());


  // 체인 등록 완료 후 관리
  handleAfterRegistered = () => this.setIsRegistry();


  //이메일 입력 여부 Flag
  handleEmailFlag = flag => this.setState({ emailFlag: flag });


  //문서 다운로드 전 데이터 SET
  handleDownloadContent = () => {
    const { documentData, getMyInfo, setAlertCode } = this.props;

    if (!documentData) return setAlertCode(2091);
    if (!MainRepository.Account.isAuthenticated() && !getMyInfo.email) return setAlertCode(2003);

    const accountId = documentData.accountId,
      documentId = documentData.documentId,
      documentName = documentData.documentName;

    this.getContentDownload(accountId, documentId, documentName);
  };


  // 북마크 버튼 클릭 관리
  handleBookmark = () => {
    const { documentData, setAlertCode, getMyList, setMyList } = this.props;

    this.setState({ bookmarkFlag: true });
    let myList = getMyList;
    myList.resultList.push(documentData);
    setMyList(myList);

    return MainRepository.Mutation.addMyList(documentData.documentId)
      .then(() => setAlertCode(2121))
      .catch(err => setAlertCode(2122));
  };


  // 북마크 삭제 버튼 클릭 관리
  handleBookmarkRemove = () => {
    const { documentData, setAlertCode, getMyList, setMyList } = this.props;

    this.setState({ bookmarkFlag: false });
    let myList = getMyList;
    let idx = getMyList.resultList.findIndex(x => x._id === documentData.documentId);
    myList.resultList.slice(idx, 1);
    setMyList(myList);

    return MainRepository.Mutation.removeMyList(documentData.documentId)
      .then(() => setAlertCode(2123))
      .catch(err => setAlertCode(2124));
  };


  componentWillMount(): void {
    this.init();
  }


  render() {
    const { documentData, documentText, author, getCreatorDailyRewardPool, totalViewCountInfo, getIsMobile, update } = this.props;
    const { isPublic, isRegistry, downloadLoading, completeModalOpen, bookmarkFlag } = this.state;

    let vote = Common.toEther(documentData.latestVoteAmount) || 0,
      reward = Common.toEther(common_view.getAuthorNDaysReward(documentData, getCreatorDailyRewardPool, totalViewCountInfo, 7)),
      view = documentData.latestPageview || 0,
      accountId = documentData.accountId || "",
      profileUrl = author ? author.picture : null,
      identification = author ? (author.username && author.username.length > 0 ? author.username : author.email) : documentData.accountId,
      ogUrl = APP_PROPERTIES.domain().embed + documentData.seoTitle;

    return (

      <article className="col-12 view_left u__view p-3">
        <div className="view_top mb-4">
          <ContentViewCarouselContainer id="pageCarousel" target={documentData} documentText={documentText}
                                        tracking={true} handleEmailFlag={this.handleEmailFlag}
                                        getPageNum={page => this.getPageNum(page)}/>
          <a className="view_screen" href={APP_PROPERTIES.domain().viewer + documentData.seoTitle} target="_blank"
             rel="noopener noreferrer nofollow">
            <i title="viewer button" className="material-icons">fullscreen</i>
          </a>
        </div>


        <div className="view_content">
          <div className="u_title mb-3">{documentData.title}</div>

          <div className="mb-3 position-relative">
            <div className="row">
              <Link to={"/@" + identification} title={"Go to profile page of " + identification}
                    rel="nofollow">
                {profileUrl ? <img src={profileUrl} alt="profile" className="content-view-img"
                                   onClick={() => common_view.scrollTop()}/> :
                  <i className="material-icons img-thumbnail" onClick={() => common_view.scrollTop()}>face</i>}
              </Link>

              <div className="d-inline-block ml-1">
                <Link to={"/@" + identification} title={"Go to profile page of " + identification} rel="nofollow">
                  <div className="info-name">{identification}</div>
                </Link>
                <div className="info-date-view d-inline-block">{Common.timestampToDate(documentData.created)}</div>
              </div>
            </div>

            <div className="content-view-fullscreen-info-detail">
              <span className={"info-detail-reward mr-3 " + (isRegistry ? "" : "color-not-registered")}
                    onMouseOver={() => this.showRewardInfo(documentData.seoTitle + "reward")}
                    onMouseOut={() => this.hideRewardInfo(documentData.seoTitle + "reward")}>
                $ {Common.deckToDollar(reward)}
                <img className="reward-arrow"
                     src={require("assets/image/icon/i_arrow_down_" + (isRegistry ? "blue" : "grey") + ".svg")}
                     alt="arrow button"/>
              </span>
              {reward > 0 && <PayoutCard reward={reward} data={documentData}/>}
              <span className="info-detail-view mr-3">{view}</span>
              <span className={"info-detail-vote " + (accountId === common_view.getMySub() ? "mr-5" : "mr-4")}>{Common.deckStr(vote)}</span>

              {accountId === common_view.getMySub() &&
              <div className="view-option-btn" id="viewer-option-btn">
                <i className="material-icons" onClick={() => this.handleSetting()}>more_horiz</i>
                <div className="option-table d-none" id="viewer-option-table">
                  <div className="option-table-btn" onClick={() => this.handleDownloadContent()}>
                    <i className="material-icons">save_alt</i>
                    {psString("download-btn")}
                  </div>
                  {MainRepository.Account.isAuthenticated() && bookmarkFlag ?
                    <div className="option-table-btn" onClick={() => this.handleBookmarkRemove()}>
                      <i className="material-icons">bookmark_border</i>
                      {psString("bookmark-remove")}
                    </div> :
                    <div className="option-table-btn" onClick={() => this.handleBookmark()}>
                      <i className="material-icons">bookmark</i>
                      {psString("bookmark-add")}
                    </div>
                  }
                  <EditDocumentModalContainer documentData={documentData}/>
                  {isRegistry === false && (accountId === common_view.getMySub()) &&
                  <DeleteDocumentModalContainer documentData={documentData}/>}
                </div>
              </div>
              }
            </div>
          </div>

          <div className="mb-3">
            {!isPublic &&
            <PublishModalContainer documentData={documentData} afterPublish={() => this.handleAfterPublish()}/>}
            {completeModalOpen && <PublishCompleteModalContainer documentData={documentData}
                                                                 completeModalClose={() => this.handleCompleteModalClose()}/>}
            {isPublic &&
            <VoteDocumentModalContainer documentData={documentData}/>}
            {isPublic && (accountId === common_view.getMySub() && documentData) &&
            <RegBlockchainBtnContainer documentData={documentData}
                                       afterRegistered={() => this.handleAfterRegistered()}/>}
            <CopyModalContainer documentData={documentData}/>
            {documentData.isDownload && accountId !== common_view.getMySub() &&
            <Tooltip title={psString("tooltip-download")} placement="bottom">
              <div className={"viewer-btn mb-1 " + (downloadLoading ? "btn-disabled" : "")}
                   onClick={() => this.handleDownloadContent()}>
                <i className="material-icons">save_alt</i>{psString("download-btn")}
                {downloadLoading &&
                <div className="loading-btn-wrapper"><FadingCircle color="#3681fe" size={17}/></div>}
              </div>
            </Tooltip>
            }
            {accountId === common_view.getMySub() &&
            <Tooltip title={psString("tooltip-tracking")} placement="bottom">
              <Link to={{
                pathname: "/tr/" + identification + "/" + documentData.seoTitle,
                state: {
                  documentData: documentData,
                  documentText: documentText,
                  totalViewCountInfo: totalViewCountInfo
                }
              }} rel="nofollow">
                <div className="viewer-btn" onClick={() => common_view.scrollTop()}>
                  <i className="material-icons">bar_chart</i> {psString("tracking-btn")}
                </div>
              </Link>
            </Tooltip>
            }
          </div>

          <div className="hr mb-3"/>

          <div className="view_desc">
            <div dangerouslySetInnerHTML={{ __html: documentData.desc }}/>
            <div className="view_tag mt-5 mb-3">
              {documentData.tags ? documentData.tags.map((tag, index) => (
                <Link title={"Link to " + tag + " tag"} to={"/latest/" + tag} key={index}
                      onClick={() => common_view.scrollTop()}
                      className="tag" rel="nofollow"> {tag} </Link>
              )) : ""}
            </div>

            <div>
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


              {documentData.cc && documentData.cc.length > 0 &&
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


            <div className="hr mb-3 mt-3"/>
          </div>

          {update === false && <ContentViewComment documentData={documentData}/>}

        </div>


      </article>
    )
      ;
  }
}

export default ContentViewFullScreen;
