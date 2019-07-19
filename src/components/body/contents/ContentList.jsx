import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThreeBounce } from "better-react-spinkit";
import MainRepository from "../../../redux/MainRepository";
import Common from "../../../config/common";
import ContentTagsContainer from "../../../container/body/contents/ContentTagsContainer";
import ContentListItemContainer from "../../../container/body/contents/ContentListItemContainer";

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


  // 무한 스크롤 두번째 데이터 GET
  fetchMoreData = () => {
    const { pageNo, tag, path, resultList } = this.state;

    let _pageNo = (resultList.length === 0 ? 1 : pageNo + 1);
    this.setState({ loading: true }, () => {
      this.fetchDocuments({
        pageNo: _pageNo,
        tag: tag,
        path: path
      });
    });
  };


  // document 데이터 fetch
  fetchDocuments = (args) => {
    const { path, resultList, tagSearchFlag } = this.state;
    const params = {
      pageNo: args.pageNo,
      tag: args.tag,
      path: args.path ? args.path : path
    };

    MainRepository.Document.getDocumentList(params, (res) => {
      this.setState({ loading: false });
      const _resultList = res.resultList ? res.resultList : [],
        pageNo = res.pageNo;

      if (_resultList.length > 0) {
        if (resultList.length > 0 && !tagSearchFlag) {
          this.setState({ resultList: resultList.concat(_resultList), pageNo: pageNo });
        } else {
          this.setState({ resultList: _resultList, pageNo: pageNo, tagSearchFlag: false });
        }
      } else {
        this.setState({ isEndPage: true });
      }

      if (res && res.totalViewCountInfo && !this.state.totalViewCountInfo) {
        this.setState({ totalViewCountInfo: res.totalViewCountInfo });
      }
    }, (err) => {
      this.setState({ loading: false });
      console.error(err);
      this.setTimeout = setTimeout(() => {
        this.fetchDocuments(args);
        clearTimeout(this.setTimeout);
      }, 8000);
    });
  };


  // fetch 진행
  setFetch = () => {
    this.setState({
      resultList: [],
      pageNo: 1,
      isEndPage: false,
      tag: Common.getTag(),
      path: Common.getPath(),
      tagSearchFlag: true
    }, () => {
      this.fetchDocuments({
        tag: Common.getTag(),
        path: Common.getPath()
      });
    });
  };


  //태그 리스트 GET
  setTagList = () => {
    const { setTagList, getTagList } = this.props;

    let path = Common.getPath();
    if (getTagList.path !== path) {
      MainRepository.Document.getTagList(path, result => {
        setTagList(result.resultList);
      });
    }
  };


  // 카테고리 관리
  handleCategories = () => {
    let path = Common.getPath(), sec_path = Common.getTag();
    this.props.history.push("/" + path + "/" + sec_path);
  };


  // 업로드 버튼 관리
  handleUploadBtn = () => {
    document.getElementById("uploadBtn").click();
  };


  componentDidUpdate = () => {
    let pathArr = window.location.pathname.split("/");
    if (pathArr.length > 2 && decodeURI(pathArr[2]) !== this.state.tag) {
      this.setFetch();
    }
  };


  componentWillMount() {
    this.setFetch();
    this.setTagList();
  }


  render() {
    const { match, isEndPage, getIsMobile } = this.props;
    const { resultList, totalViewCountInfo } = this.state;

    return (
      <div className="row">
        <div className="col-lg-3  overflow-hidden">
          <ContentTagsContainer path={match.path} url={match.url} {...this.props}/>
        </div>

        <div className="col-sm-12 col-lg-9 u__center-container">

          <div className="d-block d-sm-none content-list-path">{Common.getPath()}</div>

          <div className="mt-0 mt-sm-4 pt-0 pt-sm-2 u__center content-list-wrapper">

            <InfiniteScroll
              className={getIsMobile ? "overflow-initial" : ""}
              dataLength={resultList.length}
              next={this.fetchMoreData}
              hasMore={!isEndPage}
            >
              {resultList.length > 0 && resultList.map((result) => (
                <ContentListItemContainer key={result.documentId + result.accountId} result={result}
                                          totalViewCountInfo={totalViewCountInfo}/>
              ))}
            </InfiniteScroll>
            {this.state.loading &&
            <div className="spinner"><ThreeBounce color="#3681fe" name="ball-pulse-sync"/></div>
            }
          </div>
        </div>

      </div>
    );
  }
}

export default ContentList;
