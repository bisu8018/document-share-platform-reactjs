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
            <NavLink to="/" activeClassName="on" rel="nofollow"
                     onClick={common_view.scrollTop}>home</NavLink>
          </li>
          <li>
            <NavLink to="/latest" activeClassName="on" rel="nofollow"
                     onClick={common_view.scrollTop}>latest</NavLink>
          </li>
          <li>
            <NavLink to="/featured" activeClassName="on" rel="nofollow"
                     onClick={common_view.scrollTop}>featured</NavLink>
          </li>
          <li>
            <NavLink to="/popular" activeClassName="on" rel="nofollow"
                     onClick={common_view.scrollTop}>popular</NavLink>
          </li>
          <li>
            <NavLink to="/more" activeClassName="on"
                     onClick={common_view.scrollTop}>more</NavLink>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Category;
