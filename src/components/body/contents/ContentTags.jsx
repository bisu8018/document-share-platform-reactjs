import React from "react";
import { NavLink } from "react-router-dom";
import common_view from "../../../common/common_view";

class ContentTags extends React.Component {

  render() {
    const { getTagList, path } = this.props;
    return (

      <nav className="col-lg-3  overflow-hidden u__left d-none d-lg-block">
        <ul className="tags_menu">
          <li className="tags_menu_all_tags">
            <NavLink exact to={"/" + path + "/"} activeClassName="on" onClick={() => common_view.scrollTop()}>#All Tags</NavLink>
          </li>
          {getTagList.length > 0 && getTagList.sort((a, b) => b.value - a.value).map((rst, idx) => {
            return (idx < 100 &&
              <li key={idx}>
                <NavLink to={"/" + path + "/" + rst._id} activeClassName="on"
                         onClick={common_view.scrollTop}>{rst._id}</NavLink>
              </li>
            );
          })
          }
        </ul>
      </nav>

    );
  }
}

export default ContentTags;
