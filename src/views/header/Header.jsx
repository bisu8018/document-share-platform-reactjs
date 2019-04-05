import React from "react";
import UploadDocumentModal from "../../components/modal/UploadDocumentModal";
import { Link, NavLink } from "react-router-dom";
// import Bounty from "./Bounty";
import Menu from "../../components/common/Menu";
import MainRepository from "../../redux/MainRepository";
import Common from "../../common/Common";

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
    const { myInfo } = this.props;
    const { prevScrollPos } = this.state;

    return (

      <header id="header">
        <nav className="navbar navbar-default navbar-expand-lg fixed-top" id="header__main-nav">
          <div className="container-fluid">
            <div className="col-4 col-lg-4 mt-1">
              <a className="navbar-brand" href="/latest">
                <img src={require("assets/image/logo.png")} alt="DECOMPANY"/>
              </a>
            </div>

            <div className="navbar-menu col-lg-4 d-none d-lg-block">
              <NavLink to={"/latest/" + Common.getTag()} className="nav-menu-link"
                       activeClassName="on">LATEST</NavLink>
              <NavLink to={"/featured/" + Common.getTag()} className="nav-menu-link"
                       activeClassName="on">FEATURED</NavLink>
              <NavLink to={"/popular/" + Common.getTag()} className="nav-menu-link"
                       activeClassName="on">POPULAR</NavLink>
            </div>

            <div className="navbar-menu tar  col-8 col-lg-4">
              <UploadDocumentModal {...this.props} />
              { myInfo.email.length > 0 &&
              <span className="d-none d-sm-inline-block">
                  <Link
                    to={"/" + (myInfo.username.length && myInfo.username.length > 0 ? myInfo.username : myInfo.email)}>
                    <img src={myInfo.picture} className="avatar" alt="user profile"/>
                  </Link>
                </span>
              }
              {!MainRepository.Account.isAuthenticated() &&
              <div className="d-none d-sm-inline-block login-btn" onClick={this.handleOpen.bind(this)} title="login">
                  <i className="material-icons">edit</i>
                  Login
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
        {prevScrollPos > 100 &&
        <div className="scroll-top-btn" onClick={() => Common.scrollTop()} title="scroll top button"><i
          className="material-icons">keyboard_arrow_up</i></div>
        }
      </header>

    );
  }
}

export default Header;