import React from "react";
import { Link, NavLink } from "react-router-dom";
import Common from "../../../util/Common";
import history from "apis/history/history";
import AutoSuggestInputContainer from "../../../container/common/AutoSuggestInputContainer";

class ContentTags extends React.Component {
  state = {
    selectedTag: null
  };

  onSuggestionSelected = (tag) => {
    const { path } = this.props;
    this.setState({selectedTag : tag._id});
    history.push(path + "/" + tag._id);
  };

  handleClick = () => {
    Common.scrollTop();
    document.getElementsByClassName("react-autosuggest__input")[0].value  = "";
  };

  render() {
    const { getTagList, path } = this.props;
    return (

      <div className="u__left d-none d-lg-block">
        <div className="tags_menu_search_container tags-menu-search-container-width" id="tagsMenuSearchContainer">
            <AutoSuggestInputContainer search={this.onSuggestionSelected} type={"tag"}/>
            <Link to={path + "/" + (this.state.selectedTag ? this.state.selectedTag : "")}>
              <div className="search-btn">
                <i className="material-icons">search</i>
              </div>
            </Link>
        </div>
        <ul className="tags_menu">
          <li className="tags_menu_all_tags">
            <NavLink exact to={path + "/"} activeClassName="on" onClick={() => {this.handleClick()}}># All Tags</NavLink>
          </li>
          {getTagList.length > 0 && getTagList.sort((a, b) => b.value - a.value ).map((rst, idx) => {
            return (idx < 100 &&
              <li key={idx}>
                <NavLink to={path + "/" + rst._id} activeClassName="on"
                         onClick={Common.scrollTop}>{rst._id}</NavLink>
              </li>
            );
          })
          }
        </ul>
      </div>

    );
  }
}

export default ContentTags;
