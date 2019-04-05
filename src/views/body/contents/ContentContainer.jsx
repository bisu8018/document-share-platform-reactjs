import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "react-spinkit";
import { Link } from "react-router-dom";

import ContentTags from "./ContentTags";
import ContentListItem from "./ContentListItem";
import AutoSuggestInput from "../../../components/common/AutoSuggestInput";
import MainRepository from "../../../redux/MainRepository";
import Common from "../../../common/Common";

class ContentContainer extends Component {
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
    this.setState({ loading: true }, () => {
      this.fetchDocuments({
        pageNo: this.state.pageNo + 1,
        tag: this.state.tag,
        path: this.state.path
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
      // console.log("Fetch Document end", res);
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

  handleCategories = (e) => {
    let path = Common.getPath();
    let sec_path = Common.getTag();

    this.props.history.push("/" + path + "/" + sec_path);
  };

  onSuggestionSelected = (tag) => {
    this.setState({ selectedTag: tag._id });
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
    const { tagList, match, isEndPage, totalViewCountInfo, selectedTag } = this.props;
    const { resultList } = this.state;

    let matchPath = Common.getPath();
    let matchTag = Common.getTag();

    return (
      <div className="row">
        <div className="main-banner d-none d-md-block"/>
        <div className="main-banner-text col-12 d-none d-md-block">
          <div className="main-banner-wrapper">
            <div className="h2">
              <div className="d-inline-block mr-4">G r o w</div>
              <div className="d-inline-block mr-4">y o u r</div>
              <div className="d-inline-block">a u d i e n c e</div>
            </div>
            <div className="h4">Share your slides and and generate high quality leads.</div>
          </div>
        </div>

        <div className="col-lg-3 ">
          <ContentTags path={match.path} url={match.url} {...this.props}/>
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
                  <AutoSuggestInput dataList={tagList} search={this.onSuggestionSelected} type={"tag"}
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
              {resultList.length > 0 && resultList.map((result) => (
                <ContentListItem key={result.documentId + result.accountId} result={result}
                                 totalViewCountInfo={totalViewCountInfo} {...this.props} />
              ))}
            </InfiniteScroll>
            {this.state.loading &&
            <div className="spinner"><Spinner name="ball-pulse-sync"/></div>
            }
          </div>
        </div>

      </div>
    );
  }
}

export default ContentContainer;
