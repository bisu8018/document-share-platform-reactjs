import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";

import MainRepository from "../../../redux/MainRepository";
import DocumentCardContainer from "../../../container/common/DocumentCardContainer";
import { psString } from "../../../config/localization";
import log from "../../../config/log";
import { APP_PROPERTIES } from "../../../properties/app.properties";
import common_view from "../../../common/common_view";
import ContentMainListMock from "../../common/mock/ContentMainListMock";

class ContentMain extends Component {
  state = {
    latestDocuments: null,
    featuredDocuments: null,
    popularDocuments: null,
    latestListMany: 4
  };


  // 초기화
  init = () => {
    if (APP_PROPERTIES.ssr) return;

    log.ContentMain.init();
    // 추천문서 목록 GET
    this.getDocuments("featured")
    // 최신문서 목록 GET
      .then(this.getDocuments("latest"))
      // 인기문서 목록 GET
      .then(this.getDocuments("popular"))
      // 스크롤 이벤트 리스너
      .then(this.handleResize());
  };


// 문서 목록 GET
  getDocuments = (path) => {
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


  // 카테고리 영어 return
  getEngPath = (path) => {
    let _path = path;
    if (path === "최신문서" || path === "최신") _path = "latest";
    else if (path === "추천문서" || path === "추천") _path = "featured";
    else if (path === "인기문서" || path === "인기") _path = "popular";

    return _path;
  };


  // 사이트 path 체크
  getList = path => {
    const { latestDocuments, featuredDocuments, popularDocuments } = this.state;
    let _path = this.getEngPath(path);
    return _path === "latest" ? latestDocuments : _path === "featured" ? featuredDocuments : popularDocuments;
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


  // 업로드 버튼
  handleUploadBtn = () => document.getElementById("uploadBtn").click();


  // see more 트리거 버튼
  handelTrigger = (arr) => document.getElementById(this.getEngPath(arr) + "NavLink").click();


  // 스크롤 이벤트 리스너 시작
  handleResize = (e) => {
    let countCards = (window.innerWidth > 1293 || window.innerWidth < 993) ? 4 : 6;
    this.setState({ latestListMany: countCards }, () => log.ContentMain.handleResize());
  };


  // 스크롤 이벤트 리스너 종료
  handleResizeEnd = (e) => {
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
      psString("main-category-2"),
      psString("main-category-1"),
      psString("main-category-3")
    ];

    return (
      <section className="row container">
        <div className="main-banner" id="mainBanner">
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
                      <div className="main-upload-btn mr-2 ml-2 mb-3"
                           onClick={() => this.handleUploadBtn()}>{buttonText[idx]}</div>
                    }
                    <Link to="/faq">
                      <div className="main-learn-more-btn ml-2 mr-2"
                           onClick={() => common_view.scrollTop()}>{psString("main-banner-btn-4")}</div>
                    </Link>
                  </div>
                </div>

                <div className={"main-banner-img-wrapper main-banner-img" + (idx + 1)}/>

                <img src="" data-src={require("assets/image/banner/img-banner-0" + (idx + 1) + ".png")} alt=""/>
              </div>
            ))}
          </Carousel>

        </div>

        <div className="main-banner-dummy"/>

        <div className="col-12 content-main-container">
          <div className="u__center">
            {category.map((arr, idx) =>
              this.getList(arr) ? this.getList(arr).resultList.length > 0 &&
                <div className="main-category" key={idx}>
                  <div className="mb-3">
                    <span className="main-category-name">{arr}</span>
                    <span className="main-category-see-all"
                          onClick={() => this.handelTrigger(arr)}>{psString("main-see-all")}
                      <i className="material-icons">keyboard_arrow_right</i></span>
                  </div>

                  <div className="row main-category-card-wrapper">
                    {this.getList(arr).resultList.map((res, idx) => {
                      return (idx < latestListMany &&
                        <DocumentCardContainer key={idx} idx={idx} path={arr} documentData={res}
                                               countCards={latestListMany}
                                               totalViewCountInfo={this.getList(arr).totalViewCountInfo}/>
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
