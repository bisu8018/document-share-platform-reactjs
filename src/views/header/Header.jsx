import React from "react";
import UploadDocument from "../../components/modal/UploadDocument";
import { Link, NavLink } from "react-router-dom";
// import Bounty from "./Bounty";
import Menu from "../../components/common/Menu";
import MainRepository from "../../redux/MainRepository";

class Header extends React.Component {
  state = {
    accountId: null,
    prevScrollPos: null,
    tag: ""
  };

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
    MainRepository.Account.login();
  };

  handleScroll = () => {
    let currentScrollPos = window.pageYOffset;
    if (this.state.prevScrollPos > currentScrollPos || currentScrollPos <= 0) {
      document.getElementById("header__main-nav").style.top = "0";
    } else {
      document.getElementById("header__main-nav").style.top = "-60px";
    }
    this.setState({ prevScrollPos: currentScrollPos });
  };

  componentWillMount() {
    let pathname = window.location.pathname;
    if (pathname === "/") {
      window.location.pathname += "latest";
    }
    this.setState({ prevScrollPos: window.pageYOffset });
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  render() {
    let userInfo = MainRepository.Account.getUserInfo();
    return (

      <header id="header">
        <nav className="navbar navbar-default navbar-expand-lg fixed-top" id="header__main-nav">
          <div className="container-fluid">
            <div className="col-4 col-lg-4 mt-1">
              <a className="navbar-brand" href="/">
                <img src={require("assets/image/logo.png")} alt="DECOMPANY"/>
              </a>
            </div>

            <div className="navbar-menu col-lg-4 d-none d-lg-block">
              <NavLink to="/latest" className="nav-menu-link"
                       activeClassName="on">Latest</NavLink>
              <NavLink to="/featured" className="nav-menu-link"
                       activeClassName="on">Featured</NavLink>
              <NavLink to="/popular" className="nav-menu-link"
                       activeClassName="on">Popular</NavLink>
            </div>

            <div className="navbar-menu tar  col-8 col-lg-4">
              <UploadDocument {...this.props} />
              {MainRepository.Account.isAuthenticated() ?
                <span className="d-none d-sm-inline-block">
                    <Link to={"/author/" + userInfo.sub}>
                      <div className="avatar">{userInfo.nickname[0]}</div>
                    </Link>
                  </span>
                :
                <div className="d-none d-sm-inline-block login-btn" onClick={this.handleOpen.bind(this)} title="login">
                  <i className="material-icons">edit</i>
                  Log-in
                </div>
              }
              <Menu {...this.props} />
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

        {/*<Bounty {...this.props} />*/}

      </header>

    );
  }
}

export default Header;