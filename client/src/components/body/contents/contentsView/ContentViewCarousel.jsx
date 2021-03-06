import React from "react";
import { Carousel } from "react-responsive-carousel";
import TrackingApis from "apis/TrackingApis";
import Common from "../../../../common/common";
import MainRepository from "../../../../redux/MainRepository";
import EmailModalContainer from "../../../../container/common/modal/EmailModalContainer";
import UserInfo from "../../../../redux/model/UserInfo";
import { psString } from "../../../../config/localization";
import common_view from "../../../../common/common_view";
import { APP_PROPERTIES } from "../../../../properties/app.properties";
import ContentViewPortraitContainer
  from "../../../../container/body/contents/contentsView/ContentViewPortraitContainer";

class ContentViewCarousel extends React.Component {

  state = {
    dataKey: null,
    totalPages: 0,
    readPage: null,
    autoSlideFlag: false,
    slideOptionFlag: false,
    audienceEmail: null,
    emailFlag: false,   // true : 메일 수집 모달 표시
    emailFlagTemp: true,   // true : 메일 수집 모달 표시
    loginTrackingFlag: false,
    pageChangedFlag: null,
    stayTime: null,
    ratio: null
  };


  // init
  init = () => {
    let pageNum = common_view.getPageNum() > this.props.getDocument.document.totalPages ? 0 : common_view.getPageNum();

    if (!APP_PROPERTIES.ssr) this.getImgInfo();

    if (MainRepository.Account.isAuthenticated()) {
      return this.postTrackingConfirm(pageNum)
        .then(() => this.handleTracking(pageNum))
        .catch(() => APP_PROPERTIES.env === "local" ? this.handleTracking(pageNum) : false);
    } else {
      return this.handleTracking(pageNum);
    }
  };

  // 특정 시간 동안 머문 후 트랙킹 시작
  checkStayTime = page => {
    const { stayTime, readPage } = this.state;

    if (readPage === null) return false;

    let st = 3000;
    let tmpTime = Date.now();

    if (!stayTime || (stayTime && tmpTime >= stayTime + st))
      return this.handleTracking(page);
    else if (stayTime && tmpTime < stayTime + st)
      this.checkTrackingQualified(page).then(() => true).catch(() => false);
  };


  // 트랙킹 자격 체크
  checkTrackingQualified = page => {
    const { getDocument, handleEmailFlag } = this.props;
    const { readPage } = this.state;

    return new Promise((resolve, reject) => {
      if ((page === null || page === undefined) && getDocument.document.forceTracking)
        this.setState({ emailFlag: false }, () => handleEmailFlag(false));

      // 같은 페이지 일 경우
      if (page === readPage) reject();

      // url 페이지 파라미터 값 변경
      this.setState({ readPage: page, stayTime: Date.now() }, () => {
        this.handleUrl();
        resolve();
      });
    });
  };


  // 로그인 시, cid ~ email 싱크 작업
  postTrackingConfirm = async () => {
    const { getDocument, getMyInfo } = this.props;
    let trackingInfo = await TrackingApis.setTrackingInfo().then(res => res);

    let data = {
      "cid": trackingInfo.cid,
      "sid": trackingInfo.sid,
      "email": getMyInfo.email,
      "documentId": getDocument.document.documentId
    };

    return MainRepository.Tracking.postTrackingConfirm(data);
  };


  // Tracking API POST
  postTracking = (page, type) =>
    TrackingApis.tracking({
      id: this.props.getDocument.document.documentId,
      n: page + 1,
      ev: type
    }, true).then(res => res);


  // 이미지 정보 GET
  getImgInfo = () => {
    const { getDocument } = this.props;
    let imgUrl = Common.getThumbnail(getDocument.document.documentId, 320, 1, getDocument.document.documentName),
      img = new Image();

    img.src = imgUrl;
    img.onload = () => {
      let height = img.height;
      let width = img.width;
      this.setState({ ratio: (width / height) });
    };
  };


  // URL 관리
  handleUrl = () => {
    const { readPage } = this.state;
    const { getDocument, getPageNum } = this.props;

    let pathName = window.location.pathname.split("/"),
      url = window.location.origin + "/" + pathName[1] + "/" + pathName[2] + "/",
      _readPage = readPage + 1,
      _documentText = "";

    if (getDocument.text && getDocument.text.length > 0 && getDocument.text[readPage])
      _documentText = getDocument.text[readPage].substr(0, 10).trim().replace(/([^A-Za-z0-9 ])+/g, "").replace(/([ ])+/g, "-");
    if (_documentText.length > 0)
      _documentText = "-" + _documentText;

    window.history.replaceState({}, _readPage + _documentText, url + _readPage + _documentText);
    getPageNum(_readPage);  //Parent 인 ContentView 로 pathName 전달, page 에 따른 문서 설명 전환 용. redux 로 대체 가능

  };


  // 이메일 플래그 관리
  handleFlag = async page => {
    const { handleEmailFlag, getMyInfo, getTempEmail } = this.props;
    const { emailFlagTemp } = this.state;

    return new Promise((resolve) => {
      let ss = getTempEmail;

      this.setState({ emailFlag: false }, () => {
        handleEmailFlag(false);

        // email 입력 모달 on/off 함수
        if (page > 0 && !getMyInfo.email && emailFlagTemp && !ss) {
          this.setState({ emailFlag: true }, () => {
            handleEmailFlag(true);
            resolve(false);
          });
        } else {
          resolve(true);
        }
      });
    });
  };


  // 문서 옵션 useTracking true 일때만
  handleTracking = async page => {
    const { getDocument, getMyInfo, setMyInfo } = this.props;
    const { emailFlagTemp, emailFlag } = this.state;

    let checkTracking = await this.checkTrackingQualified(page).then(() => true).catch(() => false);
    if (!checkTracking) return false;

    // 트래킹 / 강제 트래킹 분기처리
    if (getDocument.document.useTracking) {
      if (getDocument.document.forceTracking && !await this.handleFlag(page))
        return false;

      return this.postTracking(page, "view").then(res => {
        if (res.user && res.user.e) {
          // 비로그인 상태에서 email로 로그인 시, 트래킹 위한 redux 저장
          if (getMyInfo.email === "") {
            let userInfo = new UserInfo();
            userInfo.email = res.user.e;
            setMyInfo(userInfo);
          }

          if (emailFlag) this.setState({ emailFlag: false });
        } else if ((!res.user || (res.user && !res.use.e)) && page > 0 && emailFlagTemp) {
          this.setState({ emailFlag: true });
        }
      });
    } else return this.postTracking(page, "none").then(() => {
    });    // 오직 뷰 카운트만을 위한 트랙킹 기능

  };


  // 떠남 상태 관리
  handleTrackingLeave = documentId => {
    const { getDocument } = this.props;
    const { readPage } = this.state;

    if (!readPage) return false;

    try {
      TrackingApis.tracking({
        id: documentId || getDocument.document.documentId,
        n: -1,
        ev: "leave"
      }, false, true);
    } catch (e) {
      console.error(e);
    }
  };


  // see also 통한 페이지 전환 시, readPage 값 0으로 초기화
  handlePageChanged = () => {
    const { pageChangedFlag } = this.state;
    const { getDocument } = this.props;

    let documentId = getDocument.document.documentId;

    if (!documentId || documentId.length === 0 || pageChangedFlag === documentId) return;
    if (pageChangedFlag !== null) {
      this.handleTrackingLeave(pageChangedFlag);
      this.setState({ readPage: 0 });
    }
    this.setState({ pageChangedFlag: documentId });
  };


  // 이메일 비강제 입력 모달 종료 시 플래그 조정
  handleUseTrackingFlag = () => this.setState({ emailFlagTemp: false });


  // 이메일 강제 입력 모달 종료 시 플래그 조정
  handleForceTrackingFlag = () =>
    this.setState({ readPage: 0, emailFlag: false }, () => {
      this.props.handleEmailFlag(false);
      this.handleUrl();
    });


  // 슬라이드 옵션 창 on/off
  handleOptionBarClickEvent = () => this.setState({ slideOptionFlag: !this.state.slideOptionFlag });


  // 자동 슬라이드 설정 on/offsns-share-icon-wrapper mb-3
  handleOptionBtnClickEvent = () => this.setState({ autoSlideFlag: !this.state.autoSlideFlag });


  componentWillMount() {
    this.init();
  }


  componentWillUnmount() {
    this.handleTrackingLeave();
  }


  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    this.handlePageChanged();
  }


  render() {
    const { getDocument } = this.props;
    const { emailFlag, ratio } = this.state;
    const arr = [getDocument.document.totalPages];

    for (let i = 0; i < getDocument.document.totalPages; i++) arr[i] = Common.getThumbnail(getDocument.document.documentId, 2048, i + 1);

    return (
      <div className="card card-raised">
        <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel" data-interval="3000">
          <div className="screen-option-bar">
            <i className="material-icons" onClick={this.handleOptionBarClickEvent.bind(this)}>more_vert</i>
            <div className={"screen-option" + (this.state.slideOptionFlag ? "" : " d-none")}>
              <div
                title={this.state.autoSlideFlag ? psString("viewer-page-carousel-slide-mode-manual") : psString("viewer-page-carousel-slide-mode-auto")}
                onClick={this.handleOptionBtnClickEvent.bind(this)}>
                {this.state.autoSlideFlag ? "Auto Mode" : "Manual Mode"}
              </div>
            </div>
          </div>

          {!ratio || (ratio && ratio >= 1) ?
            <Carousel
              showThumbs={false}
              showStatus={false}
              showIndicators={false}
              autoPlay={this.state.autoSlideFlag}
              interval={5000}
              swipeable={false}
              selectedItem={this.state.readPage || 0}
              useKeyboardArrows={true}
              onChange={index => this.checkStayTime(index)}>
              {arr.length > 0 ? arr.map((addr, idx) => (
                <img key={idx}
                     title={getDocument.document.title}
                     src={addr}
                     alt={getDocument.text[idx]}
                     data-small=""
                     data-normal=""
                     data-full=""
                     className={(getDocument.document.forceTracking && emailFlag && !MainRepository.Account.isAuthenticated() ? "img-cloudy" : "")}/>
              )) : "no data"}
            </Carousel> :
            (ratio && ratio <= 1 && arr &&
              <ContentViewPortraitContainer
                onChange={index => this.checkStayTime(index)}
                arr={arr}
                ratio={ratio}
                emailFlag={emailFlag}
              />
            )
          }
        </div>


        {!MainRepository.Account.isAuthenticated() && emailFlag && getDocument.document.useTracking &&
        <EmailModalContainer handleTracking={page => this.handleTracking(page)} documentData={getDocument.document}
                             useTracking={() => this.handleUseTrackingFlag()}
                             forceTracking={() => this.handleForceTrackingFlag()}
                             documentId={getDocument.document.documentId}/>
        }
      </div>
    );
  }
}

export default ContentViewCarousel;
