import React from "react";
import { Link } from "react-router-dom";
import history from "apis/history/history";
// import Bounty from "./Bounty";
import MainRepository from "../../redux/MainRepository";
import Common from "../../util/Common";
import UploadDocumentModalContainer from "../../container/modal/UploadDocumentModalContainer";
import MenuContainer from "../../container/header/MenuContainer";
import AutoSuggestInputContainer from "../../container/common/AutoSuggestInputContainer";
import ProfileCardContainer from "../../container/common/ProfileCardContainer";
import AdsContainer from "../../container/ads/AdsContainer";

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      accountId: null,
      prevScrollPos: null,
      searchBar: false,
      profileCardShow: false,
      selectedTag: null,
      selectedCategory: "/latest",
      adShow: true,
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

  onSuggestionSelected = (tag) => {
    const { selectedCategory } = this.state;
    this.setState({ selectedTag: tag._id }, () => {
      history.push((selectedCategory || "/latest") + "/" + tag._id);
    });
  };

  getCollectPath = () => {
    let path = window.location.pathname;
    if (path === "/latest" || path === "/featured" || path === "/popular") return path;
    else return "/latest";
  };

  addClass = () => {
    let pathname = window.location.pathname.split("/")[1];

    if (pathname === "callback") {
      pathname = "";
    }

    if (pathname === "latest" || pathname === "featured" || pathname === "popular") {
      let _pathname = (pathname === "callback" ? "" : pathname) + "NavLink";
      const navElById = document.getElementById(_pathname);
      navElById.classList.add("on");
    }
  };

  showSearchBar = () => {
    this.setState({ searchBar: true }, () => {
      const autoSuggestEle = document.getElementById("headerAutoSuggest").firstChild.firstChild;
      autoSuggestEle.onMouseOut = function() {
        alert("Clicked");
      };
      autoSuggestEle.focus();
    });
  };

  closeSearchBar = () => {
    this.setState({ searchBar: false });
  };

  clickEventListener = () => {
    document.addEventListener("click", (e) => {
        let targetElement = e.target; // clicked element

        // 프로필 카드
        const profileCard = document.getElementById("profileCard");
        if (profileCard && !profileCard.contains(targetElement)) {
          this.profileCardHide();
        }

        // 프로필 카드 프로필 버튼
        const profileCardMyAccountBtn = document.getElementById("profileCardMyAccountBtn");
        if (profileCardMyAccountBtn && profileCardMyAccountBtn.contains(targetElement)) {
          this.profileCardHide();
        }

        // 검색 input
        const headerAutoSuggest = document.getElementById("headerAutoSuggest");
        if (headerAutoSuggest && !headerAutoSuggest.contains(targetElement)) {
          this.closeSearchBar();
        }

      }
    );
  };

  profileCardShow = () => {
    this.setState({ profileCardShow: true });
  };

  profileCardHide = () => {
    this.setState({ profileCardShow: false });
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

  handleCategories = (data) => {
    let category = data.target.value;
    let main = category.split("/")[1];
    MainRepository.Document.getTagList(main,result => {
      this.setState({ selectedCategory: category }, () => {
        this.props.setCurrentTagList(result.resultList);
      });
    });
  };

  handleNavMenuLink = (e) => {
    this.removeClass();
    let path = e.target.innerHTML.toLowerCase();

    history.push("/" + path + "/" + Common.getTag());
    e.target.classList.add("on");
  };

  handleClose = () => {
    this.setState({adShow : false});
  };

  componentWillMount() {
    this.setState({ prevScrollPos: window.pageYOffset });
    this.clickEventListener();
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.addClass();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  render() {
    const { prevScrollPos, searchBar, profileCardShow, adShow } = this.state;
    const { getMyInfo } = this.props;

    let pathname = history.location.pathname.split("/")[1];

    return (

      <header id="header">
        {adShow && !pathname && (window.pageYOffset <= "55") && <AdsContainer close={()=>this.handleClose()}/>}
        <nav className={"navbar navbar-default navbar-expand-lg fixed-top " + (adShow && !pathname && (window.pageYOffset <= "55") ? "ad-effective" : "")}
             id="header__main-nav">
          <div className="container-fluid container">
            <div className="col-4 col-lg-3 mt-1">
              <a className="navbar-brand" href={"/"} title="Link to main page">
                <img src={require("assets/image/logo.svg")} alt="POLARIS SHARE"/>
              </a>
            </div>

            <div className="navbar-menu col-lg-6 d-none d-lg-block">
              {!searchBar ?
                <div className="d-inline-block">
                  <div className="nav-menu-link" id="latestNavLink"
                       onClick={(e) => this.handleNavMenuLink(e)}>LATEST
                  </div>
                  <div className="nav-menu-link" id="featuredNavLink"
                       onClick={(e) => this.handleNavMenuLink(e)}>FEATURED
                  </div>
                  <div className="nav-menu-link" id="popularNavLink"
                       onClick={(e) => this.handleNavMenuLink(e)}>POPULAR
                  </div>
                  <div className="header-search-btn" onClick={() => this.showSearchBar()}>
                    <i className="material-icons">search</i>
                  </div>
                </div>
                :
                <div className="header-search-wrapper" id="headerAutoSuggest">
                  <AutoSuggestInputContainer search={this.onSuggestionSelected} type={"currentTag"}/>
                  <select className="header-select-custom" onChange={(value) => this.handleCategories(value)}
                  >
                    <option value="/latest">LATEST</option>
                    <option value="/featured">FEATURED</option>
                    <option value="/popular">POPULAR</option>
                  </select>

                  <Link to={this.getCollectPath() + "/" + (this.state.selectedTag ? this.state.selectedTag : "")}>
                    <div className="header-search-btn-active" onClick={() => this.closeSearchBar()}>
                      <i className="material-icons">search</i>
                    </div>
                  </Link>
                </div>
              }
            </div>


            <div className="navbar-menu tar  col-8 col-lg-3">
              {/*<div className="d-inline-block d-sm-none" onClick={() => this.closeSearchBar()}>
                <i className="material-icons">search</i>
              </div>*/}

              <UploadDocumentModalContainer {...this.props} />

              {MainRepository.Account.isAuthenticated() &&
              <span className="d-none d-sm-inline-block ml-4" onClick={() => this.profileCardShow()}>
                {getMyInfo.picture.length > 0 ?
                  <img src={getMyInfo.picture} className="avatar" alt="Link to my profile"/> :
                  <img src={require("assets/image/common/i_anonymous.png")} className="avatar"
                       alt="Link to my profile"/>
                }

                {profileCardShow &&
                <ProfileCardContainer/>
                }

                </span>
              }

              {!MainRepository.Account.isAuthenticated() &&
              <div className="d-none d-sm-inline-block login-btn ml-2" onClick={this.handleOpen.bind(this)}
                   title="login">
                Login
              </div>
              }
              <MenuContainer {...this.props} />
            </div>
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