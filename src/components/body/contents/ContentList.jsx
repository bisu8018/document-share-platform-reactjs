import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Helmet } from "react-helmet";
import { psString } from "../../../config/localization";
import log from "../../../config/log";
import MainRepository from "../../../redux/MainRepository";
import ContentListItemContainer from "../../../container/body/contents/ContentListItemContainer";
import NoDataIcon from "../../common/NoDataIcon";
import common_view from "../../../common/common_view";
import ContentListItemMock from "../../common/mock/ContentListItemMock";
import { APP_PROPERTIES } from "../../../properties/app.properties";
import history from "apis/history/history";


class ContentList extends Component {
  state = {
    resultList: [],
    pageNo: 1,
    isEndPage: false,
    tag: null,
    totalViewCountInfo: null,
    path: null,
    loading: false,
    tagSearchFlag: false
  };


  constructor(props) {
    super(props);
    this.handleCategories = this.handleCategories.bind(this);
  }


  // 초기화
  init = () => {
    if (APP_PROPERTIES.ssr) return this.fetchSsrDocuments();

    log.ContentList.init();
    this.setFetch().then(res => this.fetchDocuments(res));
    this.setTagList();
  };


  // 로그인 체크
  checkLogin = () => {
    const { setAlertCode } = this.props;

    if (!MainRepository.Account.isAuthenticated()) {
      setAlertCode(2002);
      return history.push("/");
    }
    return true;
  };

  // 무한 스크롤 두번째 데이터 GET
  fetchMoreData = () => {
    const { pageNo, tag, path, resultList } = this.state;

    let _pageNo = (resultList.length === 0 ? 1 : pageNo + 1);

    this.fetchDocuments({
      pageNo: _pageNo,
      tag: tag,
      path: path
    });
  };


  // document 데이터 in SSR fetch
  fetchSsrDocuments = () => {
    const { getDocumentList } = this.props;
    return new Promise((resolve, reject) => {
      if (!getDocumentList || !getDocumentList.resultList || this.state.path !== "latest") resolve(false);

      this.setState({
        resultList: getDocumentList.resultList,
        pageNo: getDocumentList.pageNo,
        totalViewCountInfo: getDocumentList.totalViewCountInfo && !this.state.totalViewCountInfo ? getDocumentList.totalViewCountInfo : null
      }, () => {
        resolve();
      });
    });
  };


  // document 데이터 fetch
  fetchDocuments = args => {
    const { path, pageNo } = this.state;
    const params = {
      pageNo: pageNo,
      tag: args.tag,
      path: args.path ? args.path : path
    };

    this.setState({ loading: true });

    // 경로별 문서 GET API 분기 처리
    switch (path) {
      case "mylist" :
        this.checkLogin();
        return this.getMyList(params);

      case "history" :
        this.checkLogin();
        return this.getHistory(params);

      default :
        return this.getDocumentList(params);
    }
  };


  // GET my list
  getMyList = params => MainRepository.Document.getMyList({
    userId: MainRepository.Account.getMyInfo().sub,
    skip: (params.pageNo - 1) * 10
  }).then(res => this.handleGetDocumentData({ resultList: res, pageNo: params.pageNo + 1 }))
    .catch(err => this.handleError(err, params));


  // GET history
  getHistory = params => MainRepository.Document.getHistory({
    userId: MainRepository.Account.getMyInfo().sub,
    skip: (params.pageNo - 1) * 10
  }).then(res => this.handleGetDocumentData({ resultList: res, pageNo: params.pageNo + 1 }))
    .catch(err => this.handleError(err, params));


  // GET document list
  getDocumentList = params => MainRepository.Document.getDocumentList(params)
    .then(res => this.handleGetDocumentData({ resultList: res.resultList, pageNo: params.pageNo + 1 }))
    .catch(err => this.handleError(err, params));


  // fetch 진행
  setFetch = () => {
    let path = common_view.getPath(), tag = common_view.getTag();

    return new Promise(resolve => this.setState({
        resultList: [],
        pageNo: 1,
        isEndPage: false,
        tag: tag,
        path: path,
        tagSearchFlag: true
      }, () => resolve({ tag: tag, path: path })
    ));
  };


  //태그 리스트 GET
  setTagList = () => {
    const { setTagList, getTagList } = this.props;

    let path = common_view.getPath();

    if (getTagList.path !== path)
      MainRepository.Document.getTagList(path)
        .then(result => setTagList(result.resultList))
        .then(log.ContentList.setTagList())
        .catch(err => {
          log.ContentList.setTagList(err);
          this.setTimeout = setTimeout(() => {
            this.setTagList();
            clearTimeout(this.setTimeout);
          }, 8000);
        });
  };


  // GET 한 문서 데이터 관리
  handleGetDocumentData = res => {
    const { resultList, tagSearchFlag } = this.state;

    this.setState({ loading: false });
    log.ContentList.fetchDocuments();

    const _resultList = res.resultList ? res.resultList : [];
    const pageNo = res.pageNo;

    if (_resultList.length > 0) {
      if (resultList.length > 0 && !tagSearchFlag) {
        this.setState({
          resultList: resultList.concat(_resultList),
          pageNo: pageNo
        });
      } else {
        this.setState({
          resultList: _resultList,
          pageNo: pageNo,
          tagSearchFlag: false
        });
      }
    } else this.setState({ isEndPage: true });

    if (res && res.totalViewCountInfo && !this.state.totalViewCountInfo) this.setState({ totalViewCountInfo: res.totalViewCountInfo });
  };


  // 문서 GET 에러 관리
  handleError = (err, params) => {
    this.setState({ loading: false });

    log.ContentList.fetchDocuments(err);

    this.setTimeout = setTimeout(() => clearTimeout(this.setTimeout), 8000);
  };


  // 카테고리 관리
  handleCategories = () => {
    let path = common_view.getPath(), sec_path = common_view.getTag();
    this.props.history.push("/" + path + "/" + sec_path);
  };


  componentDidUpdate = () => {
    let pathArr = window.location.pathname.split("/");
    if (pathArr.length > 2 && pathArr[2] !== "" && decodeURI(pathArr[2]) !== this.state.tag)
      this.setFetch().then(res => this.fetchDocuments(res));
  };


  componentWillMount() {
    this.init();
  }


  render() {
    const { isEndPage, getIsMobile } = this.props;
    const { resultList, totalViewCountInfo, path } = this.state;

    return (
      <div className="row container">
        <Helmet>
          <title>{psString("helmet-title-" + path) + " | Polaris Share"}</title>
        </Helmet>


        <section
          className={"col-12 u__center-container " + (this.state.loading ? "u__center-container-mock" : "")}>
          {resultList.length > 0 &&
          <InfiniteScroll
            className={(getIsMobile ? "overflow-initial " : "") + "u__center content-list-wrapper"}
            dataLength={resultList.length}
            next={this.fetchMoreData}
            hasMore={!isEndPage}>
            {resultList.map(result => (
              <ContentListItemContainer key={result.documentId + result.accountId} result={result}
                                        totalViewCountInfo={totalViewCountInfo}/>))}
          </InfiniteScroll>
          }

          {this.state.loading &&
          <div>
            <ContentListItemMock/>
            <ContentListItemMock order={2}/>
            <ContentListItemMock order={3}/>
          </div>}
          {!this.state.loading && ((resultList && resultList.length === 0) || !resultList) &&
          <NoDataIcon className="no-data">No data</NoDataIcon>}

        </section>

      </div>
    );
  }
}

export default ContentList;
