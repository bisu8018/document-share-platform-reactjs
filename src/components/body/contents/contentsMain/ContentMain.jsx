import React, { Component } from "react";
import history from "apis/history/history";

import MainRepository from "../../../../redux/MainRepository";
import DocumentCardContainer from "../../../../container/common/DocumentCardContainer";
import { psString } from "../../../../config/localization";
import log from "../../../../config/log";
import { APP_PROPERTIES } from "../../../../properties/app.properties";
import common_view from "../../../../common/common_view";
import ContentMainListMock from "../../../common/mock/ContentMainListMock";
import ContentMainBanner from "./ContentMainBanner";


// path 카테고리
const category = [
  "mylist",
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
  getList = path => ({
    "latest": this.state.latestDocuments,
    "featured": this.state.featuredDocuments,
    "popular": this.state.popularDocuments,
    "mylist": this.state.myListDocuments,
    "history": this.state.myHistoryDocuments
  }[path] || []);


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
    const { latestListMany } = this.state;

    return (
      <section className="row container">
        <ContentMainBanner/>

        <div className="col-12 content-main-container">
          <div className="u__center">
            {category.map((arr, idx) =>
              this.getList(arr) ? ((this.getList(arr).resultList && this.getList(arr).resultList.length > 0) || (!this.getList(arr).resultList && this.getList(arr).length > 0)) &&
                <div className="main-category" key={idx}>
                  <div className="p-3 pl-sm-0 pb-sm-3 d-flex">
                    <div className="main-category-name" onClick={() => this.handelTrigger(arr)}>
                      {psString("main-category-" + arr)}
                    </div>
                    <div className="main-category-see-all">{psString("main-see-all")}
                      <i className="material-icons">keyboard_arrow_right</i></div>
                  </div>

                  <div className="row main-category-card-wrapper">
                    {this.getList(arr).resultList && this.getList(arr).resultList.map((res, idx) => {
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
