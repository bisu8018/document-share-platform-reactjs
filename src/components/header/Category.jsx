import React from "react";
import { NavLink } from "react-router-dom";
import common_view from "../../common/common_view";


class Category extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    const { path } = this.props;

    if (path) return false;

    return (

      <nav className="header-category-wrapper " id="headerCategoryWrapper">
        <ul className="tags_menu d-flex container">
          <li>
            <NavLink to="/" activeClassName="on"
                     onClick={common_view.scrollTop}>home</NavLink>
          </li>
          <li>
            <NavLink to="/latest" activeClassName="on"
                     onClick={common_view.scrollTop}>latest</NavLink>
          </li>
          <li>
            <NavLink to="/featured" activeClassName="on"
                     onClick={common_view.scrollTop}>featured</NavLink>
          </li>
          <li>
            <NavLink to="/popular" activeClassName="on"
                     onClick={common_view.scrollTop}>popular</NavLink>
          </li>
        {/*  {getTagList.length > 0 && getTagList.sort((a, b) => b.value - a.value).map((rst, idx) => {
            return (idx < 6 &&
              <li key={idx}>
                <NavLink to={"/category/" + rst._id} activeClassName="on"
                         onClick={common_view.scrollTop}>{rst._id}</NavLink>
              </li>
            );
          })}*/}
          <li>
            <NavLink to="/category" activeClassName="on"
                     onClick={common_view.scrollTop}>more</NavLink>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Category;
