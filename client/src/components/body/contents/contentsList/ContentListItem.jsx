import React from "react";
import { Link } from "react-router-dom";
import LinesEllipsis from "react-lines-ellipsis";
import responsiveHOC from "react-lines-ellipsis/lib/responsiveHOC";
import Common from "../../../../common/common";
import PayoutCard from "../../../common/card/PayoutCard";
import common_view from "../../../../common/common_view";
import { APP_PROPERTIES } from "../../../../properties/app.properties";
import Tooltip from "@material-ui/core/Tooltip";
import { psString } from "../../../../config/localization";
import MainRepository from "../../../../redux/MainRepository";
import DocumentInfo from "../../../../redux/model/DocumentInfo";
import UserAvatar from "../../../common/avatar/UserAvatar";


const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

class ContentListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      documentData: new DocumentInfo(),
      bookmarkFlag: false
    };
  }


  //초기화
  init = () => {
    if (APP_PROPERTIES.ssr) return false;

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


  // 찜하기
  checkBookmark = () => {
    const { getMyList } = this.props;
    let flag;

    if (getMyList.resultList.length > 0) {
      flag = getMyList.resultList.filter(v => v._id === this.props.result._id).length > 0;
    } else {
      flag = false;
    }

    this.setState({ bookmarkFlag: flag });
  };


  // 북마크 버튼 클릭 관리
  handleBookmark = () => {
    const { result, setAlertCode, getMyList, setMyList } = this.props;

    this.setState({ bookmarkFlag: true });
    let myList = getMyList;
    myList.resultList.push(result);
    setMyList(myList);

    return MainRepository.Mutation.addMyList(result.documentId)
      .then(() => setAlertCode(2121))
      .catch(err => setAlertCode(2122));
  };


  // 북마크 삭제 버튼 클릭 관리
  handleBookmarkRemove = () => {
    const { result, setAlertCode, getMyList, setMyList } = this.props;

    this.setState({ bookmarkFlag: false });
    let myList = getMyList;
    let idx = myList.resultList.findIndex(x => x._id === result.documentId);
    myList.resultList.splice(idx, 1);
    setMyList(myList);

    return MainRepository.Mutation.removeMyList(result.documentId)
      .then(() => setAlertCode(2123))
      .catch(err => setAlertCode(2124));
  };


  componentWillMount(): void {
    this.init();
  }


  render() {
    const { result, getCreatorDailyRewardPool, totalViewCountInfo, getIsMobile } = this.props;
    const { bookmarkFlag } = this.state;

    let vote = result.latestVoteAmount ? Common.toEther(Object.values(result.latestVoteAmount)[0]) : 0,
      reward = Common.toEther(common_view.getAuthorNDaysReward(result, getCreatorDailyRewardPool, totalViewCountInfo, 7)),
      view = result.latestPageview || 0,
      imageUrl = Common.getThumbnail(result.documentId, (getIsMobile ? 640 : 320), 1, result.documentName),
      profileUrl = result.author ? result.author.picture : null,
      croppedArea = result.author ? result.author.croppedArea : null,
      identification = result.author ? (result.author.username && result.author.username.length > 0 ? result.author.username : result.author.email) : result.accountId;

    return (
      <div className="row col-12 u_center_inner" key={result.seoTitle}>
        <div className="col-thumb-list">
          <Link to={"/@" + identification + "/" + result.seoTitle} rel="nofollow">
            <div className="thumb_image" onClick={() => common_view.scrollTop()}>
              <img src={imageUrl} alt={result.title}
                   className="main-category-card-img"
                   onError={(e) => {
                     e.target.onerror = null;
                     e.target.src = APP_PROPERTIES.domain().static + "/image/logo-cut.png";
                   }}/>
            </div>
          </Link>
        </div>

        <div className="col-details_info details_info">
          <div className="mb-1 detail-title">
            <Link to={"/@" + identification + "/" + result.seoTitle} onClick={() => common_view.scrollTop()}
                  title={result.title}>
              <ResponsiveEllipsis
                text={result.title ? result.title : result.documentName}
                maxLine={2}
                ellipsis='...'
                trimRight
                basedOn='words'
              />
            </Link>
          </div>
          <div className="mb-1">
            <Link to={"/@" + identification} className="info_name" title={identification} rel="nofollow">
              <UserAvatar picture={profileUrl} croppedArea={croppedArea} size={26}/>
              <div className='ml-2'>{identification}</div>
            </Link>
            <div className="info_date float-right d-inline-block">
              {common_view.dateTimeAgo(result.created)}
            </div>
          </div>

          <div className="details-info-desc-wrapper">
            <Link to={"/@" + identification + "/" + result.seoTitle} className="info_desc" title={result.desc}
                  onClick={() => common_view.scrollTop()} rel="nofollow">
              {result.desc &&
              <ResponsiveEllipsis
                text={result.desc}
                maxLine={2}
                ellipsis='...'
                trimRight
                basedOn='words'
              />
              }
            </Link>
          </div>

          <div className="info-detail-wrapper">
            <span className={"info-detail-reward mr-3 " + (result.isRegistry ? "" : "color-not-registered")}
                  onMouseOver={() => this.showRewardInfo(result.seoTitle + "reward")}
                  onMouseOut={() => this.hideRewardInfo(result.seoTitle + "reward")}>
              $ {Common.deckToDollar(reward)}
              <img className="reward-arrow"
                   src={APP_PROPERTIES.domain().static + "/image/icon/i_arrow_down_" + (result.isRegistry ? "blue" : "grey") + ".svg"}
                   alt="arrow button"/>
            </span>
            <span className="info-detail-view mr-3">{view}</span>
            <span className="info-detail-vote mr-3">{Common.deckStr(vote)}</span>
            {MainRepository.Account.isAuthenticated() && bookmarkFlag &&
            <Tooltip title={psString("bookmark-remove")} placement="bottom">
              <span className="info-detail-bookmark-checked" onClick={() => this.handleBookmarkRemove()}>
                   <i className="material-icons">bookmark</i>
              </span>
            </Tooltip>}
            {MainRepository.Account.isAuthenticated() && !bookmarkFlag &&
            <Tooltip title={psString("bookmark-add")} placement="bottom">
              <span className="info-detail-bookmark" onClick={() => this.handleBookmark()}>
                   <i className="material-icons">bookmark_border</i>
              </span>
            </Tooltip>
            }
          </div>

          {reward > 0 && <PayoutCard reward={reward} data={result}/>}

        </div>
      </div>
    );
  }
}

export default ContentListItem;
