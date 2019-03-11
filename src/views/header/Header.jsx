import React from "react";
import UploadDocument from "../../components/modal/UploadDocument";
import { NavLink } from "react-router-dom";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false
    };
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
  }

  handleDrawerToggle() {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  }

  handleOpen = () => {
    const { auth } = this.props;
    auth.login();
  };

  componentWillMount() {
    const pathname = window.location.pathname;
    if (pathname === "/") {
      window.location.pathname += "latest";
    }
  }

  render() {
    const { auth } = this.props;

    return (

      <header id="header">
        <nav className="navbar navbar-default navbar-expand-lg fixed-top" id="header__main-nav">
          <div className="container-fluid">
            <div className="col-5 col-md-3">
              <a className="navbar-brand" href="/">
                <img src={require("assets/image/logo.png")} alt="DECOMPANY"/>
              </a>
            </div>

            <div className="navbar-menu col-md-6 d-none d-md-block">
              <ul>
                <li className="navbar-menu-latest" title="latest"><NavLink to="/latest" activeClassName="on">Latest</NavLink></li>
                <li className="navbar-menu-featured" title="featured"><NavLink to="/featured" activeClassName="on">Featured</NavLink>
                </li>
                <li className="navbar-menu-popular" title="popular"><NavLink to="/popular" activeClassName="on">Popular</NavLink></li>
              </ul>
            </div>

            <div className="navbar-menu  col-7 col-md-3">
              {auth.isAuthenticated() ?
                <ul className="float-right">
                  <li title="upload">
                    <UploadDocument {...this.props} />
                  </li>
                  <li onClick={auth.logout} title="logout">
                    <div className="avatar">
                      { auth.getUserInfo().nickname[0]}
                    </div>
                  </li>
                </ul>
                :
                <ul className="float-right">
                  <li className="login-btn" onClick={this.handleOpen} title="login">
                      Log-in
                  </li>
                </ul>
              }
            </div>


          </div>

          <div className="color-divider flex-row">
            <div className="color-section seafoam-regular"/>
            <div className="color-section teal-dark"/>
            <div className="color-section teal-light"/>
            <div className="color-section midnight-light"/>
            <div className="color-section wine-light"/>
            <div className="color-section yellow-dark"/>
          </div>

        </nav>
      </header>

    );
  }
}

export default Header;