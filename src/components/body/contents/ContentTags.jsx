import React from "react";
import { NavLink } from "react-router-dom";
import Common from "../../../config/common";

class ContentTags extends React.Component {

  handleClick = () => {
    Common.scrollTop();
  };

  render() {
    const { getTagList, path } = this.props;
    return (

      <div className="u__left d-none d-lg-block">
        <ul className="tags_menu">
          <li className="tags_menu_all_tags">
            <NavLink exact to={path + "/"} activeClassName="on" onClick={() => {this.handleClick()}}>#All Tags</NavLink>
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
