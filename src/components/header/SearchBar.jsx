import React from "react";
import { Link } from "react-router-dom";
import history from "apis/history/history";
import AutoSuggestInputContainer from "../../container/common/AutoSuggestInputContainer";
import common from "../../config/common";

class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchBar: false,
      selectedTag: null,
      selectedCategory: "/latest"
    };
  }


  // 자동완성 선택 시, 페이지 이동
  onSuggestionSelected = (tag) => {
    const { selectedCategory } = this.state;
    const { closeSearchBar } = this.props;
    this.setState({ selectedTag: tag._id }, () => {
      history.push((selectedCategory || "/latest") + "/" + tag._id);
      closeSearchBar();
    });
  };


  // 현재 카테고리 GET
  getCollectPath = () => {
    let path = window.location.pathname;
    if (path.split("/")[1] === "latest" || path.split("/")[1] === "featured" || path.split("/")[1] === "popular") return path.split("/")[1];
    else return "latest";
  };



  render() {
    const { selectedTag } = this.state;
    return (

      <div className="header-search-wrapper" id="headerAutoSuggest">
        <div className="header-category">{this.getCollectPath()}</div>

        <span className="mr-4"/>

        <AutoSuggestInputContainer search={this.onSuggestionSelected} type={"tag"}/>

        <Link to={this.getCollectPath() + "/" + (selectedTag ? selectedTag : "")}
              className="mobile-header-search-btn-wrapper">
          <div className="mobile-header-search-btn mb-2" id="headerSearchIcon"
               onClick={() => this.props.closeSearchBar()}/>
        </Link>

      </div>

    );
  }
}

export default SearchBar;
