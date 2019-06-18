import React from "react";
import { Link } from "react-router-dom";
import history from "apis/history/history";
import MainRepository from "../../redux/MainRepository";
import AutoSuggestInputContainer from "../../container/common/AutoSuggestInputContainer";
import DropdownContainer from "../../container/common/DropdownContainer";

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
    if (path === "/latest" || path === "/featured" || path === "/popular") return path;
    else return "/latest";
  };


  // 드롭다운 카테고리 값 관리
  handleCategories = (data) => {
    let category = data.target ? data.target.value : "/" + data;
    let main = category.split("/")[1];

    MainRepository.Document.getTagList(main, result => {
      this.setState({ selectedCategory: category }, () => {
        this.props.setCurrentTagList(result.resultList);
      });
    });
  };


  render() {
    const { selectedTag } = this.state;
    const { getIsMobile } = this.props;

    const dataList = [["latest", "LATEST"], ["featured", "FEATURED"], ["popular", "POPULAR"]];


    return (

      <div className="header-search-wrapper" id="headerAutoSuggest">

        {getIsMobile ?
          <select className="header-select-custom" id="headerSearchSelectBar"
                  onChange={(value) => this.handleCategories(value)}>
            <option value="/latest">LATEST</option>
            <option value="/featured">FEATURED</option>
            <option value="/popular">POPULAR</option>
          </select>
          :
          <DropdownContainer dataList={dataList} selected={(value) => this.handleCategories(value)}/>
        }

        <span className="mr-4"/>

        <AutoSuggestInputContainer search={this.onSuggestionSelected} type={"currentTag"}/>

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