import React from "react";
import { Link } from "react-router-dom";
import history from "apis/history/history";
import MainRepository from "../../redux/MainRepository";
import AutoSuggestInputContainer from "../../container/common/AutoSuggestInputContainer";

class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchBar: false,
      selectedTag: null,
      selectedCategory: "/latest",
    };
  }

  onSuggestionSelected = (tag) => {
    const { selectedCategory } = this.state;
    this.setState({ selectedTag: tag._id }, () => {
      history.push((selectedCategory || "/latest") + "/" + tag._id);
    });
  };

  getCollectPath = () => {
    let path = window.location.pathname;
    if (path === "/latest" || path === "/featured" || path === "/popular") return path;
    else return "/latest";
  };

  handleCategories = (data) => {
    let category = data.target.value;
    let main = category.split("/")[1];
    MainRepository.Document.getTagList(main, result => {
      this.setState({ selectedCategory: category }, () => {
        this.props.setCurrentTagList(result.resultList);
      });
    });
  };


  render() {
    const { selectedTag } = this.state;
    return (

      <div className="header-search-wrapper" id="headerAutoSuggest">
        <select className="header-select-custom" onChange={(value) => this.handleCategories(value)}>
          <option value="/latest">LATEST</option>
          <option value="/featured">FEATURED</option>
          <option value="/popular">POPULAR</option>
        </select>

        <AutoSuggestInputContainer search={this.onSuggestionSelected} type={"currentTag"}/>

        <Link to={this.getCollectPath() + "/" + (selectedTag ? selectedTag : "")} className="mobile-header-search-btn-wrapper">
          <div className="mobile-header-search-btn mb-2" onClick={() => this.props.closeSearchBar()}/>
        </Link>
      </div>

    );
  }
}

export default SearchBar;