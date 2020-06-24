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
            <NavLink to="/latest/marketing" activeClassName="on" rel="nofollow"
                     onClick={common_view.scrollTop}>marketing</NavLink>
          </li>
          <li>
            <NavLink to="/latest/business" activeClassName="on" rel="nofollow"
                     onClick={common_view.scrollTop}>business</NavLink>
          </li>
          <li>
            <NavLink to="/latest/technology" activeClassName="on" rel="nofollow"
                     onClick={common_view.scrollTop}>technology</NavLink>
          </li>
          <li>
            <NavLink to="/latest/health" activeClassName="on" rel="nofollow"
                     onClick={common_view.scrollTop}>health</NavLink>
          </li>
          <li>
            <NavLink to="/latest/food" activeClassName="on" rel="nofollow"
                     onClick={common_view.scrollTop}>food</NavLink>
          </li>
          <li>
            <NavLink to="/latest/education" activeClassName="on" rel="nofollow"
                     onClick={common_view.scrollTop}>education</NavLink>
          </li>
          <li>
            <NavLink to="/latest/design" activeClassName="on" rel="nofollow"
                     onClick={common_view.scrollTop}>design</NavLink>
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
