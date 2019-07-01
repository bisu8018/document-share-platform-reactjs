import React from "react";
import history from "apis/history/history";
import MainRepository from "../../redux/MainRepository";
import Common from "../../util/Common";
import UploadDocumentModalContainer from "../../container/modal/UploadDocumentModalContainer";
import MenuContainer from "../../container/header/MenuContainer";
import ProfileCardContainer from "../../container/common/ProfileCardContainer";
import AdsContainer from "../../container/ads/AdsContainer";
import SearchBarContainer from "../../container/header/SearchBarContainer";

//import Bounty from "./Bounty";

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


  // 클릭 이벤트 리스터
  clickEventListener = () => {
    const {setDropdownShow} = this.props;

    document.addEventListener("click", (e) => {
        let targetElement = e.target; // clicked element

        // 프로필 카드
        const profileCard = document.getElementById("profileCard");
        if (profileCard && !profileCard.contains(targetElement)) {
          this.profileCardHide();
        }

        // 헤더 검색 카테고리 드롭다운
        const dropdownList = document.getElementById("dropdownList");
        if (dropdownList && !dropdownList.contains(targetElement)) {
          setDropdownShow(false);
        }

        // 프로필 카드 프로필 버튼
        const profileCardMyAccountBtn = document.getElementById("profileCardMyAccountBtn");
        if (profileCardMyAccountBtn && profileCardMyAccountBtn.contains(targetElement)) {
          this.profileCardHide();
        }

        // 검색 input
        const headerAutoSuggest = document.getElementById("headerAutoSuggest");
        if (headerAutoSuggest &&
          !headerAutoSuggest.contains(targetElement) &&
          "headerAutoSuggest" !== targetElement.id &&
          "headerSearchIcon" !== targetElement.id &&
          "headerSearchSelectBar" !== targetElement.id &&
          targetElement.classList[0] !== "react-autosuggest__input" &&
          targetElement.classList[0] !== "react-autosuggest__suggestion"
        ) {
          this.closeSearchBar();
        }

      }
    );
  };


  // 프로필 카드 보임
  profileCardShow = () => {
    this.setState({ profileCardShow: true });
  };


  // 프로필 카드 숨김
  profileCardHide = () => {
    this.setState({ profileCardShow: false });
  };


  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  handleLogin = () => {
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
    Common.scrollTop();
  };


  handleClose = () => {
    this.setState({ adShow: false });
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
    window.removeEventListener("scroll", () =>{});
    window.removeEventListener("click", () =>{});
  }


  render() {
    const { prevScrollPos, searchBar, profileCardShow, adShow } = this.state;
    const { getMyInfo, getTempEmail, getIsMobile } = this.props;
    let pathname = history.location.pathname.split("/")[1];

    return (

      <header id="header">
        {adShow && !pathname && (window.pageYOffset === 0) &&
        <div className="ad-dummy"/>
        }

        <nav
          className={"navbar navbar-default navbar-expand-lg fixed-top " + (adShow && !pathname && (window.pageYOffset <= "55") ? "ad-effective" : "")}
          id="header__main-nav">
          <div className="container-fluid container">
            {adShow && !pathname && (window.pageYOffset <= "55") &&
            <AdsContainer close={() => this.handleClose()}/>
            }
            <div className="col-4 col-md-3 mt-1">
              <a className="navbar-brand" href={"/"}>
                <img src={require("assets/image/logo.svg")} alt="POLARIS SHARE"/>
              </a>
            </div>


            <div className="navbar-menu col-md-6 d-none d-md-block">
              {!searchBar ?
                <div className="nav-menu-link-wrapper">
                  <div className="nav-menu-link" id="latestNavLink"
                       onClick={(e) => this.handleNavMenuLink(e)}>LATEST
                  </div>
                  <div className="nav-menu-link" id="featuredNavLink"
                       onClick={(e) => this.handleNavMenuLink(e)}>FEATURED
                  </div>
                  <div className="nav-menu-link" id="popularNavLink"
                       onClick={(e) => this.handleNavMenuLink(e)}>POPULAR
                  </div>
                  <div className="mobile-header-search-btn-wrapper">
                    <div className="web-header-search-btn" onClick={() => this.showSearchBar()}/>
                  </div>
                </div>
                :
                <SearchBarContainer closeSearchBar={() => this.closeSearchBar()} />
              }
            </div>


            <div className="header-bar   col-8 col-md-3">
              <div className="mobile-header-search-btn d-inline-block d-sm-none" onClick={() => this.showSearchBar()}/>
              {/*<Bounty/>*/}
              <UploadDocumentModalContainer {...this.props} />


              {(MainRepository.Account.isAuthenticated() || getTempEmail) &&
              <span className="d-none d-sm-inline-block ml-4" onClick={() => this.profileCardShow()}>

                {MainRepository.Account.isAuthenticated() ?
                  getMyInfo.picture.length > 0 ?
                    <img src={getMyInfo.picture} className="avatar" alt="Link to my profile"/> :
                    <img src={require("assets/image/icon/i_anonymous.png")} className="avatar"
                         alt="Link to my profile"/>

                  :

                  <div className="avatar-init-menu">
                    <div className="avatar-name-init-menu">{getTempEmail[0]}</div>
                  </div>
                }


                {profileCardShow && <ProfileCardContainer/>}

                </span>
              }


              {!MainRepository.Account.isAuthenticated() && !getTempEmail &&
              <div className="d-none d-sm-inline-block login-btn ml-2" onClick={() => this.handleLogin()}>
                Login
              </div>
              }


              <MenuContainer {...this.props} />

            </div>


            {searchBar &&
            <div className="mobile-header-search-bar-wrapper d-flex d-sm-none">
              <SearchBarContainer closeSearchBar={() => this.closeSearchBar()}/>
            </div>
            }


          </div>
        </nav>

        {searchBar && getIsMobile &&
        <div className="header-search-blur-wrapper"/>
        }

        {prevScrollPos > 100 &&
        <div className="scroll-top-btn" onClick={() => Common.scrollTop()}>
          <img src={require("assets/image/icon/i_backtotop.svg")} alt="back to top"/>
        </div>
        }
      </header>

    );
  }
}

export default Header;
