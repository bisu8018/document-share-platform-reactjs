import React, { Component } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "react-spinkit";
import { Link } from "react-router-dom";

import ContentTags from "./ContentTags";
import ContentListItem from "./ContentListItem";
import AutoSuggestInput from "../../../components/common/AutoSuggestInput";
import MainRepository from "../../../redux/MainRepository";

class ContentContainer extends Component {
  state = {
    resultList: [],
    pageNo: 1,
    isEndPage: false,
    tag: null,
    totalViewCountInfo: null,
    path: null,
    loading: false,
    selectedTag: null
  };

  constructor(props) {
    super(props);
    this.handleCategories = this.handleCategories.bind(this);
  }

  fetchMoreData = () => {
    this.fetchDocuments({
      pageNo: this.state.pageNo + 1,
      tag: this.state.tag,
      path: this.state.path
    });
  };

  fetchDocuments = (args) => {
    if (this.state.loading) return;
    this.setState({ loading: true });
    const params = {
      pageNo: args.pageNo,
      tag: args.tag,
      path: args.path ? args.path : this.state.path
    };

    MainRepository.Document.getDocumentList(params, (res) => {
      //console.log("Fetch Document end", res);
      this.setState({ loading: false });
      const resultList = res.resultList ? res.resultList : [];
      const pageNo = res.pageNo;

      if (resultList.length > 0) {
        if (this.state.resultList && this.state.resultList.length > 0) {
          this.setState({ resultList: this.state.resultList.concat(resultList), pageNo: pageNo });
        } else {
          this.setState({ resultList: resultList, pageNo: pageNo });
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
    const { match, location } = this.props;
    const pathArr = location.pathname.split("/");
    let tag = "";

    if (pathArr.length > 2) {
      tag = pathArr[2];
    }

    this.setState({
      resultList: [],
      pageNo: null,
      isEndPage: false,
      tag: tag,
      path: match.url
    });

    this.fetchDocuments({
      tag: tag,
      path: match.url
    });
  };

  handleCategories = ( e ) => {
    const { location } = this.props;
    let path = e.target.value;
    let sec_path = location.pathname.split("/").length > 2 ? location.pathname.split("/")[2] : null;

    if (sec_path) this.props.history.push("/" + path + "/" + sec_path);
    else this.props.history.push("/" + path + "/");
  };

  onSuggestionSelected = (tag) => {
    this.setState({selectedTag : tag._id});
  };

  componentDidUpdate = () => {
    const { location } = this.props;
    const pathArr = location.pathname.split("/");
    if (pathArr.length > 2 && pathArr[2] !== this.state.tag) {
      this.setFetch();
    }
  };

  componentWillMount() {
    this.setFetch();
  }

  render() {
    const { tagList, match, location, path, isEndPage, totalViewCountInfo, selectedTag, tag  } = this.props;
    const { resultList } = this.state;
    let matchPath = match.path.split("/")[1];
    let sec_path = location.pathname.split("/").length>2 ? location.pathname.split("/")[2] : null;
    let _title = "latest";

    if (path && (path.lastIndexOf("featured") > 0 || path.lastIndexOf("popular") > 0)) {
      _title = path.substring(1);
    }

    return (
      <div className="row">
        <div className="main-banner d-none d-md-block"/>
        <div className="main-banner-text col-12 d-none d-md-block">
          <div className="h2"><div className="d-inline-block">G r o w</div> &nbsp; <div className="d-inline-block">y o u r </div> &nbsp; <div className="d-inline-block">a u d i e n c e</div></div>
          <div className="h4">Track your readers and become more perfect. <br/> Share your document.</div>
        </div>

        <div className="col-lg-3 ">
          <ContentTags path={match.path} url={match.url} { ...this.props }/>
        </div>

        <div className="col-sm-12 col-lg-9 u__center-container">
          <div className="u__center">
            <h3 className="d-none d-lg-block text-uppercase font-weight-bold mx-3 list-inline-item">
              {_title}
              <span className="h4 text-lowercase font-weight-bold-light"># {tag ? tag : "All Tags"}</span>
            </h3>

            <div className="u__center_mobile d-lg-none">
              <div className="left_menu_list col-4">
                <select className="select-custom" value={matchPath} id="exampleFormControlSelect1" onChange={this.handleCategories}>
                  <option value="latest" >Latest</option>
                  <option value="featured" >Featured</option>
                  <option value="popular" >Popular</option>
                </select>
              </div>
              <div className="left_menu_list col-8">
                <div className="tags_menu_search_container">
                    <AutoSuggestInput dataList={tagList} search={this.onSuggestionSelected} type={"tag"} bindValue={sec_path}/>
                    <Link to={"/" +matchPath + "/" + (selectedTag ? selectedTag : "")}>
                      <div className="search-btn">
                        <i className="material-icons">search</i>
                      </div>
                    </Link>
                </div>
              </div>
            </div>

            <hr className="d-none d-sm-block"/>
            <InfiniteScroll
              dataLength={resultList.length}
              next={this.fetchMoreData}
              hasMore={!isEndPage}
              loader={<div className="spinner"><Spinner name="ball-pulse-sync"/></div>}>
              {resultList.map((result) => (
                <ContentListItem key={result.documentId + result.accountId} result={result}
                                 totalViewCountInfo={totalViewCountInfo} {...this.props} />
              ))}
            </InfiniteScroll>
          </div>
        </div>

      </div>
    );
  }
}

export default ContentContainer;
