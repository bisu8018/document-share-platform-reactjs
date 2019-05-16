import React from "react";
import { Link } from "react-router-dom";
import history from "apis/history/history";
// import Bounty from "./Bounty";
import MainRepository from "../../redux/MainRepository";
import Common from "../../util/Common";
import UploadDocumentModalContainer from "../../container/modal/UploadDocumentModalContainer";
import MenuContainer from "../../container/header/MenuContainer";

class Header extends React.Component {
  state = {
    accountId: null,
    prevScrollPos: null
  };

  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false
    };
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
  }

  removeClass = () => {
    const navElByClass = document.getElementsByClassName("nav-menu-link");
    for (let i = 0; i < navElByClass.length; ++i) {
      navElByClass[i].classList.remove("on");
    }
  };

  addClass = () => {
    let pathname = window.location.pathname.split("/")[1];

    if (pathname === "callback") {
      pathname = "latest";
    }

    if (pathname === "latest" || pathname === "featured" || pathname === "popular") {
      let _pathname = (pathname === "callback" ? "latest" : pathname) + "NavLink";
      const navElById = document.getElementById(_pathname);
      navElById.classList.add("on");
    }
  };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

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

  handleNavMenuLink = (e) => {
    this.removeClass();
    let path = e.target.innerHTML.toLowerCase();

    history.push("/" + path + "/" + Common.getTag());
    e.target.classList.add("on");
  };

  componentWillMount() {
    let pathname = window.location.pathname;
    if (pathname === "/") {
      //window.location.pathname += "latest";
    }
    this.setState({ prevScrollPos: window.pageYOffset });
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.addClass();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  render() {
    const { prevScrollPos } = this.state;
    const { getMyInfo } = this.props;
    return (

      <header id="header">
        <nav className="navbar navbar-default navbar-expand-lg fixed-top" id="header__main-nav">
          <div className="container-fluid">
            <div className="col-4 col-lg-4 mt-1">
              <a className="navbar-brand" href={"/latest"}>
                <img src={require("assets/image/logo.png")} alt="DECOMPANY"/>
              </a>
            </div>

            <div className="navbar-menu col-lg-4 d-none d-lg-block">
              <div className="nav-menu-link" id="latestNavLink" onClick={(e) => this.handleNavMenuLink(e)}>LATEST</div>
              <div className="nav-menu-link" id="featuredNavLink" onClick={(e) => this.handleNavMenuLink(e)}>FEATURED
              </div>
              <div className="nav-menu-link" id="popularNavLink" onClick={(e) => this.handleNavMenuLink(e)}>POPULAR
              </div>
            </div>

            <div className="navbar-menu tar  col-8 col-lg-4">

              <UploadDocumentModalContainer {...this.props} />

              {MainRepository.Account.isAuthenticated() &&
              <span className="d-none d-sm-inline-block ml-4">
                {getMyInfo.picture.length > 0 ?
                  <Link
                    to={"/" + (getMyInfo.username.length && getMyInfo.username.length > 0 ? getMyInfo.username : getMyInfo.email)}>
                    <img src={getMyInfo.picture} className="avatar" alt="Link to my profile"/>
                  </Link> :
                  <Link
                    to={"/" + (getMyInfo.username.length && getMyInfo.username.length > 0 ? getMyInfo.username : getMyInfo.email)}>
                    <img src={require("assets/image/common/i_anonymous.png")} className="avatar"
                         alt="Link to my profile"/>
                  </Link>
                }
                </span>
              }

              {!MainRepository.Account.isAuthenticated() && Common.getCookie("tracking_email") &&
              <span className="d-none d-sm-inline-block ml-4">
                  <div className="avatar">
                    <div className="avatar-guest">
                      { Common.getCookie("tracking_email").substr(0,1) }
                    </div>
                  </div>
                </span>
              }

              {!MainRepository.Account.isAuthenticated() && !Common.getCookie("tracking_email") &&
              <div className="d-none d-sm-inline-block login-btn ml-4" onClick={this.handleOpen.bind(this)}
                   title="login">
                <i className="material-icons">edit</i>
                Login
              </div>
              }
              <MenuContainer {...this.props} />
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

        {prevScrollPos > 100 &&
        <div className="scroll-top-btn" onClick={() => Common.scrollTop()}><i
          className="material-icons">keyboard_arrow_up</i></div>
        }
      </header>

    );
  }
}

export default Header;