import React from "react";
import { NavLink } from "react-router-dom";
import Common from "../../../common/Common";

class ContentTags extends React.Component {

  render() {
    const { categories, path } = this.props;
    return (

      <div className="u__left d-none d-lg-block">
        <div className="tags_menu_search_container">
          <div className="tags_menu_search_wrapper">
          <input type="text" placeholder="Tag Search . . ."/>
          <button><i className="material-icons">search</i></button>
          </div>
        </div>
        <ul className="tags_menu">
          <li className="tags_menu_all_tags">
            <NavLink exact to={path + "/"} activeClassName="on" onClick={Common.handleOnClick}>All Tags</NavLink>
          </li>
          {
            categories.map((category, idx) => {
              return (
                <li key={idx}>
                  <NavLink to={path + "/" + category} activeClassName="on"
                           onClick={Common.handleOnClick}>{category}</NavLink>
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
