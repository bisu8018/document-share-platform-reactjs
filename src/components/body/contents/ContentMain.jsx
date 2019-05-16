import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThreeBounce } from 'better-react-spinkit'
import { Link } from "react-router-dom";

import MainRepository from "../../../redux/MainRepository";
import Common from "../../../util/Common";
import ContentTagsContainer from "../../../container/body/contents/ContentTagsContainer";
import AutoSuggestInputContainer from "../../../container/common/AutoSuggestInputContainer";
import ContentListItemContainer from "../../../container/body/contents/ContentListItemContainer";

class ContentMain extends Component {
  state = {
    resultList: [],
    pageNo: 1,
    isEndPage: false,
    tag: null,
    totalViewCountInfo: null,
    path: null,
    loading: false,
    selectedTag: null,
    tagSearchFlag: false
  };

  constructor(props) {
    super(props);
    this.handleCategories = this.handleCategories.bind(this);
  }

  fetchMoreData = () => {
    const { pageNo, tag, path, resultList } = this.state;

    let _pageNo = (resultList.length === 0 ? 1 : pageNo +1);
    this.setState({ loading: true }, () => {
      this.fetchDocuments({
        pageNo: _pageNo,
        tag: tag,
        path: path
      });
    });
  };

  fetchDocuments = (args) => {
    const { path, resultList, tagSearchFlag } = this.state;
    const params = {
      pageNo: args.pageNo,
      tag: args.tag,
      path: args.path ? args.path : path
    };

    MainRepository.Document.getDocumentList(params, (res) => {
      this.setState({ loading: false });
      const _resultList = res.resultList ? res.resultList : [];
      const pageNo = res.pageNo;

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
    }, () => {
      this.setState({ loading: false });
    });
  };

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

  onSuggestionSelected = (tag) => {
    this.setState({ selectedTag: tag._id });
  };

  handleClickClose = () => {
    document.getElementById("mainBanner").classList.remove("d-md-block");
  };

  handleCategories = () => {
    let path = Common.getPath();
    let sec_path = Common.getTag();

    this.props.history.push("/" + path + "/" + sec_path);
  };

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
  }

  render() {
    const { match, isEndPage, selectedTag } = this.props;
    const { resultList, totalViewCountInfo } = this.state;

    let matchPath = Common.getPath();
    let matchTag = Common.getTag();

    return (
      <div className="row">
        <div className="main-banner d-none d-md-block" id="mainBanner">
          <div className="main-banner-wrapper">
            <div className="main-banner-text mr-3">
              <div className="main-banner-close-btn" onClick={() => this.handleClickClose()} title="close banner">
                <i className="material-icons">clear</i>
              </div>
              <div className="h1 d-inline-block">Grow your audience.</div>
              <div className="h4">Upload your slides and share them on high-quality channels.</div>
              <div className="h4 mb-4">Track lead activity and collect contacts.</div>
              <div className="main-upload-btn mb-2" onClick={() => this.handleUploadBtn()}>Upload now</div>
              <Link to="/faq">
                <div className="main-learn-more-btn">Learn more</div>
              </Link>
            </div>
          </div>
          <div className="main-banner-dummy"/>
        </div>

        <div className="col-lg-3 ">
          <ContentTagsContainer path={match.path} url={match.url} {...this.props}/>
        </div>

        <div className="col-sm-12 col-lg-9 u__center-container">
          <div className="u__center">
            <h3 className="d-none d-lg-block text-uppercase font-weight-bold mx-3 list-inline-item">
              {matchPath || "latest"}
              <span className="h4 text-lowercase ml-2 font-weight-bold-light"># {matchTag || "All Tags"}</span>
            </h3>

            <div className="u__center_mobile d-lg-none mt-3 mt-sm-0">
              <div className="left_menu_list col-4">
                <select className="select-custom" value={matchPath} id="exampleFormControlSelect1"
                        onChange={this.handleCategories}>
                  <option value="latest">Latest</option>
                  <option value="featured">Featured</option>
                  <option value="popular">Popular</option>
                </select>
              </div>
              <div className="left_menu_list col-8">
                <div className="tags_menu_search_container">
                  <AutoSuggestInputContainer search={this.onSuggestionSelected} type={"tag"}
                                             bindValue={matchTag}/>
                  <Link to={"/" + matchPath + "/" + (selectedTag ? selectedTag : "")}>
                    <div className="search-btn">
                      <i className="material-icons">search</i>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <hr className="d-none d-md-block"/>

            <InfiniteScroll
              className="overflow-hidden"
              dataLength={resultList.length}
              next={this.fetchMoreData}
              hasMore={!isEndPage}
            >
              {resultList.length > 0  && resultList.map((result) => (
                <ContentListItemContainer key={result.documentId + result.accountId} result={result} totalViewCountInfo = {totalViewCountInfo} />
              ))}
            </InfiniteScroll>
            {this.state.loading &&
            <div className="spinner"><ThreeBounce name="ball-pulse-sync"/></div>
            }
          </div>
        </div>

      </div>
    );
  }
}

export default ContentMain;
