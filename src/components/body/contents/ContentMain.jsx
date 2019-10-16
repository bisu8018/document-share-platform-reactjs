import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import history from "apis/history/history";

import MainRepository from "../../../redux/MainRepository";
import DocumentCardContainer from "../../../container/common/DocumentCardContainer";
import { psString } from "../../../config/localization";
import log from "../../../config/log";
import { APP_PROPERTIES } from "../../../properties/app.properties";
import common_view from "../../../common/common_view";
import ContentMainListMock from "../../common/mock/ContentMainListMock";


//배너 제목
const subject = [
  psString("main-banner-subj-1"),
  psString("main-banner-subj-2"),
  psString("main-banner-subj-3")
];

//배너 버튼 텍스트
const buttonText = [
  psString("main-banner-btn-1"),
  psString("main-banner-btn-2"),
  psString("main-banner-btn-3")
];

// 배너 내용
const content = [
  psString("main-banner-explain-1"),
  psString("main-banner-explain-2"),
  psString("main-banner-explain-3")
];


// path 카테고리
const category = [
  "myList",
  "featured",
  "latest",
  "popular",
  "history"
];


class ContentMain extends Component {
  state = {
    latestDocuments: null,
    featuredDocuments: null,
    popularDocuments: null,
    myListDocuments: null,
    myHistoryDocuments: null,
    latestListMany: 4
  };


  // 초기화
  init = () => {
    if (APP_PROPERTIES.ssr) return;

    log.ContentMain.init();
    // 추천문서 목록 GET
    this.getMyList()
    // 히스토리 목록 GET
      .then(this.getHistory())
      // 최신문서 목록 GET
      .then(this.getDocuments("latest"))
      // 인기문서 목록 GET
      .then(this.getDocuments("popular"))
      // 찜 목록 GET
      .then(this.getDocuments("featured"))
      // 스크롤 이벤트 리스너
      .then(this.handleResize());
  };


// 문서 목록 GET
  getDocuments = path => {
    return MainRepository.Document.getDocumentList({ path: path }).then(res => {
      log.ContentMain.getDocuments(null, path);
      if (path === "latest") this.setState({ latestDocuments: res });
      else if (path === "featured") this.setState({ featuredDocuments: res });
      else if (path === "popular") this.setState({ popularDocuments: res });
    }).catch(err => {
      this.props.setAlertCode(2001);
      log.ContentMain.getDocuments(err, path);
      this.setTimeout = setTimeout(() => {
        this.getDocuments(path);
        clearTimeout(this.setTimeout);
      }, 8000);
    });
  };


  // 찜 목록 GET
  getMyList = () => Promise.resolve(this.setState({ myListDocuments: this.props.getMyList }));


  // 히스토리 목록 GET
  getHistory = () => Promise.resolve(this.setState({ myHistoryDocuments: this.props.getHistory }));


  // 사이트 path 체크
  getList = path => {
    const { latestDocuments, featuredDocuments, popularDocuments, myListDocuments, myHistoryDocuments } = this.state;

    switch (path) {
      case "latest" :
        return latestDocuments;
      case "featured" :
        return featuredDocuments;
      case "popular" :
        return popularDocuments;
      case "myList" :
        return myListDocuments;
      case "history" :
        return myHistoryDocuments;
      default :
        return;
    }
  };


  // 로그인
  handleLogin = () => {
    if (!MainRepository.Account.isAuthenticated()) MainRepository.Account.login();
  };


  // 검색 버튼 트리거
  handleTagClick = () => {
    const ele = document.getElementById("headerSearchBtnWrapper");
    return ele ? ele.click() : false;
  };


  // see more 트리거 버튼
  handelTrigger = arr => {
    common_view.scrollTop();
    history.push("/" + arr);
  };


  // 스크롤 이벤트 리스너 시작
  handleResize = e => {
    let countCards = (window.innerWidth > 1293 || window.innerWidth < 993) ? 4 : 6;
    this.setState({ latestListMany: countCards }, () => log.ContentMain.handleResize());
  };


  // 스크롤 이벤트 리스너 종료
  handleResizeEnd = e => {
    log.ContentMain.handleResizeEnd();
    window.removeEventListener("resize", () => {
    });
  };


  componentDidMount(): void {
    window.addEventListener("resize", this.handleResize);
  }


  componentWillMount() {
    this.init();
  }


  componentWillUnmount() {
    this.handleResizeEnd();
  }


  render() {
    const { getIsMobile } = this.props;
    const { latestListMany } = this.state;

    return (
      <section className="row container">
        <div className="main-banner" id="mainBanner">
          <div/>
          <Carousel
            useKeyboardArrows={false}
            autoPlay={false}
            showThumbs={false}
            howThumbs={false}
            showStatus={false}
            swipeable={!getIsMobile}
            interval={5000}
          >
            {subject.map((arr, idx) => (
              <div className="main-banner-text" key={idx}>
                <div className="main-banner-wrapper">
                  <div>
                    <div className="main-banner-subject d-inline-block">{arr}</div>
                    <div className="main-banner-content mb-4">
                      {content[idx].split("\n").map((line, idx) => (
                        <div key={idx}>{line}</div>)
                      )}
                    </div>
                    {idx !== 2 ?
                      (idx === 1 ?
                          <div className="main-upload-btn mr-2 ml-2 mb-3"
                               onClick={() => this.handleLogin()}>{buttonText[idx]}</div>
                          :
                          <div className="main-upload-btn mr-2 ml-2 mb-3" id="mainUploadBtnSearch"
                               onClick={() => this.handleTagClick()}>{buttonText[idx]}</div>
                      )
                      :
                      <Link to='/ca' rel="nofollow">
                        <div className="main-upload-btn mr-2 ml-2 mb-3">{buttonText[idx]}</div>
                      </Link>
                    }
                    <Link to="/f" rel="nofollow">
                      <div className="main-learn-more-btn ml-2 mr-2"
                           onClick={() => common_view.scrollTop()}>{psString("main-banner-btn-4")}</div>
                    </Link>
                  </div>
                </div>

                <div className={"main-banner-img-wrapper main-banner-img" + (idx + 1)}/>
              </div>
            ))}
          </Carousel>

        </div>

        <div className="main-banner-dummy"/>

        <div className="col-12 content-main-container">
          <div className="u__center">
            {category.map((arr, idx) =>
              this.getList(arr) ? ((this.getList(arr).resultList && this.getList(arr).resultList.length > 0) || (!this.getList(arr).resultList && this.getList(arr).length > 0)) &&
                <div className="main-category" key={idx}>
                  <div className="mb-3 d-flex">
                    <div className="main-category-name"
                         onClick={() => arr !== "myList" && arr !== "history" ? this.handelTrigger(arr) : false}>
                      {psString("main-category-" + arr)}
                    </div>
                    {arr !== "myList" && arr !== "history" &&
                    <div className="main-category-see-all">{psString("main-see-all")}
                      <i className="material-icons">keyboard_arrow_right</i></div>
                    }
                  </div>

                  <div className="row main-category-card-wrapper">
                    {this.getList(arr).resultList.map((res, idx) => {
                      return (idx < latestListMany &&
                        <DocumentCardContainer key={idx} idx={idx} path={arr} documentData={res}
                                               countCards={latestListMany}
                                               totalViewCountInfo={this.getList(arr).totalViewCountInfo || null}/>
                      );
                    })}
                  </div>
                </div> :
                <ContentMainListMock key={idx}/>
            )}
          </div>

        </div>
      </section>
    );
  }
}

export default ContentMain;
