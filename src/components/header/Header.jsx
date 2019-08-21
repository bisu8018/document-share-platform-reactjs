import React from "react";
import history from "apis/history/history";
import MainRepository from "../../redux/MainRepository";
import UploadDocumentModalContainer from "../../container/common/modal/UploadDocumentModalContainer";
import MenuContainer from "../../container/header/MenuContainer";
import ProfileCardContainer from "../../container/common/ProfileCardContainer";
import AdsContainer from "../../container/ads/AdsContainer";
import SearchBarContainer from "../../container/header/SearchBarContainer";
import { psGetLang, psSetLang, psString } from "../../config/localization";
import { APP_PROPERTIES } from "properties/app.properties";
import log from "../../config/log";
import PrivateDocumentCountModal from "../common/modal/PrivateDocumentCountModal";
import common_view from "../../common/common_view";

//import Bounty from './Bounty';

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
      mobileOpen: false,
      path: null
    };
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
  }


  // init
  init = () => {
    if (APP_PROPERTIES.ssr) return;

    log.Header.init();
    this.setState({ prevScrollPos: window.pageYOffset,path: common_view.getPath() }, () => {
      this.clickEventListener();
    });
  };


  // 헤더 네비 카테고리 클래스 삭제
  removeClass = () => {
    const navElByClass = document.getElementsByClassName("nav-menu-link");
    for (let i = 0; i < navElByClass.length; ++i) {
      navElByClass[i].classList.remove("on");
    }
  };


  // 헤더 네비 카테고리 클래스 추가
  addClass = () => {
    let pathname = window.location.pathname.split("/")[1];

    if (pathname === "callback") pathname = "";

    if (pathname === "latest" || pathname === "featured" || pathname === "popular") {
      let _pathname = (pathname === "callback" ? "" : pathname) + "NavLink";
      const navElById = document.getElementById(_pathname);
      navElById.classList.add("on");
    }
  };


  // 검색바 보임
  showSearchBar = () => {
    this.setState({ searchBar: true }, () => {
      /* const autoSuggestEle = document.getElementById('headerAutoSuggest').firstChild.firstChild;
       autoSuggestEle.onMouseOut = function() {
         alert('Clicked');
       };
       autoSuggestEle.focus();*/
    });
  };


  // 검색 바 종료
  closeSearchBar = () => this.setState({ searchBar: false });


  // 클릭 이벤트 리스너
  clickEventListener = () => {
    const { setDropdownShow, getMyInfo } = this.props;

    document.addEventListener("click", e => {
        // clicked element
        let targetElement = e.target;

        // 광고 표시 관리
        if (common_view.getPath() !== "") this.setState({ adShow: false });

        // 프로필 카드
        const profileCard = document.getElementById("profileCard");
        const headerAvatar = document.getElementById("header-avatar");
        if (profileCard && !profileCard.contains(targetElement) && !headerAvatar.contains(targetElement)) this.profileCardHide();

        // 헤더 검색 카테고리 드롭다운
        const dropdownList = document.getElementById("dropdownList");
        if (dropdownList && !dropdownList.contains(targetElement)) setDropdownShow(false);

        // 뷰어페이지 옵션창
        const viewerOptionBtn = document.getElementById("viewer-option-btn");
        const viewerOptionTable = document.getElementById("viewer-option-table");
        if (viewerOptionBtn && !viewerOptionBtn.contains(targetElement)) viewerOptionTable.classList.add("d-none");

        // 프로필 카드 프로필 버튼
        const profileCardMyAccountBtn = document.getElementById("profileCardMyAccountBtn");
        if (profileCardMyAccountBtn && profileCardMyAccountBtn.contains(targetElement)) {
          history.push("/" + getMyInfo.username);
          this.profileCardHide();
        }

        // 검색 input
        const headerAutoSuggest = document.getElementById("headerAutoSuggest");

        if (headerAutoSuggest &&
          !headerAutoSuggest.contains(targetElement) &&
          "headerAutoSuggest" !== targetElement.id &&
          "headerSearchIcon" !== targetElement.id &&
          "headerSearchSelectBar" !== targetElement.id &&
          "headerSearchBtnWrapper" !== targetElement.id &&
          targetElement.classList[0] !== "react-autosuggest__input" &&
          targetElement.classList[0] !== "react-autosuggest__suggestion"
        ) this.closeSearchBar();
      }
    );
  };


  // 프로필 카드 보임
  profileCardShow = () => this.setState({ profileCardShow: true });


  // 프로필 카드 숨김
  profileCardHide = () => this.setState({ profileCardShow: false });


  // 화면 크기 이벤트 리스너
  handleResize = e => {
    const { setIsMobile } = this.props;
    if (e.currentTarget.innerWidth < 576) setIsMobile(true);
    else setIsMobile(false);
  };


  // 메뉴바 토클 관리
  handleDrawerToggle = () => this.setState({ mobileOpen: !this.state.mobileOpen });


  // 로그인 관리
  handleLogin = () => MainRepository.Account.login();


  // 상단 광고 종료
  handleAdClose = () => this.setState({ adShow: null });


  // 언어 설정 관리
  handleLang = () => psGetLang() === "EN" ? psSetLang("KO") : psSetLang("EN");


  // 스크롤 관리
  handleScroll = () => {
    if (APP_PROPERTIES.ssr) return false;

    let currentScrollPos = window.pageYOffset;
    if (this.state.prevScrollPos > currentScrollPos || currentScrollPos <= 0) {
      document.getElementById("header__main-nav").style.top = "0";
    } else {
      document.getElementById("header__main-nav").style.top = "-60px";
    }
    this.setState({ prevScrollPos: currentScrollPos });
  };


  // 헤더 네비 카테고리 관리
  handleNavMenuLink = (e) => {
    this.removeClass();
    let path = e.target.innerHTML.toLowerCase();

    if (path === "최신") path = "latest";
    else if (path === "추천") path = "featured";
    else if (path === "인기") path = "popular";

    history.push("/" + path + "/" + common_view.getTag());
    e.target.classList.add("on");
    common_view.scrollTop();
  };


  componentWillMount() {
    this.init();
  }


  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("resize", this.handleResize);
    this.addClass();
  }


  componentWillUnmount() {
    window.removeEventListener("scroll", () => {
    });
    window.removeEventListener("click", () => {
    });
    window.removeEventListener("resize", () => {
    });
  }


  render() {
    const { prevScrollPos, searchBar, profileCardShow, adShow, path } = this.state;
    const { getMyInfo, getTempEmail, getIsMobile } = this.props;

    return (

      <header id='header'>
        {!APP_PROPERTIES.ssr && adShow === true && !path && (window.pageYOffset === 0) &&
        <div className='ad-dummy'/>}

        <nav
          className={"navbar navbar-default navbar-expand-lg fixed-top " + (!APP_PROPERTIES.ssr && adShow && !path && (window.pageYOffset <= "55") ? "ad-effective" : "")}
          id='header__main-nav'>
          <div className='container-fluid container'>
            {!APP_PROPERTIES.ssr && adShow && !path && (window.pageYOffset <= "55") &&
            <AdsContainer close={() => this.handleAdClose()}/>
            }
            <div className='col-4 col-md-3 mt-1'>
              {getIsMobile ?
                <a className='navbar-brand-mobile' href={"/"}>
                  <img src={require("assets/image/logo-cut.png")} alt='POLARIS SHARE'/>
                </a>
                :
                <a className='navbar-brand' href={"/"}>
                  <img src={require("assets/image/logo.svg")} alt='POLARIS SHARE'/>
                </a>
              }
            </div>


            <div className='navbar-menu col-md-6 d-none d-md-block'>
              {!searchBar ?
                <div className='nav-menu-link-wrapper'>
                  <div className={"nav-menu-link " + (path === "featured" ? "on" : "")}
                       id='featuredNavLink'
                       onClick={(e) => this.handleNavMenuLink(e)}>{psString("header-category-2")}
                  </div>
                  <div className={"nav-menu-link " + (path === "latest" ? "on" : "")}
                       id='latestNavLink'
                       onClick={(e) => this.handleNavMenuLink(e)}>{psString("header-category-1")}
                  </div>
                  <div className={"nav-menu-link " + (path === "popular" ? "on" : "")}
                       id='popularNavLink'
                       onClick={(e) => this.handleNavMenuLink(e)}>{psString("header-category-3")}
                  </div>
                  <div className='mobile-header-search-btn-wrapper'>
                    <div className='web-header-search-btn' id='headerSearchBtnWrapper'
                         onClick={() => this.showSearchBar()}/>
                  </div>
                </div>
                :
                <SearchBarContainer closeSearchBar={() => this.closeSearchBar()}/>
              }
            </div>


            <div className='header-bar   col-8 col-md-3'>
              <div className='language-btn' onClick={() => this.handleLang()}>
                <i className='material-icons'>language</i>
                {psGetLang() === "EN" ? "KR" : "EN"}
              </div>
              <div className='mobile-header-search-btn d-inline-block d-sm-none' onClick={() => this.showSearchBar()}/>
              {/*<Bounty/>*/}
              {getMyInfo.privateDocumentCount >= 5 ?
                <PrivateDocumentCountModal {...this.props} />
                :
                <UploadDocumentModalContainer {...this.props} path={path}/>
              }


              {(MainRepository.Account.isAuthenticated() || getTempEmail) &&
              <span className='d-none d-sm-inline-block ml-4' onClick={() => this.profileCardShow()}>

                {MainRepository.Account.isAuthenticated() ?
                  getMyInfo.picture.length > 0 ?
                    <img src={getMyInfo.picture} id='header-avatar' className='avatar' alt='Link to my profile'/> :
                    <img src={require("assets/image/icon/i_anonymous.png")} className='avatar'
                         alt='Link to my profile'/>

                  :

                  <div className='avatar-init-menu'>
                    <div className='avatar-name-init-menu'>{getTempEmail[0]}</div>
                  </div>
                }


                {profileCardShow && <ProfileCardContainer/>}

                </span>
              }


              {!MainRepository.Account.isAuthenticated() && !getTempEmail &&
              <div className='d-none d-sm-flex login-btn ml-2' onClick={() => this.handleLogin()}>
                {psString("header-login")}
              </div>
              }


              <MenuContainer {...this.props} />

            </div>


            {searchBar &&
            <div className='mobile-header-search-bar-wrapper d-flex d-sm-none'>
              <SearchBarContainer closeSearchBar={() => this.closeSearchBar()}/>
            </div>
            }


          </div>
        </nav>

        {searchBar && getIsMobile &&
        <div className='header-search-blur-wrapper'/>
        }

        {prevScrollPos > 100 &&
        <div className='scroll-top-btn' onClick={() => common_view.scrollTop()}>
          <img src={require("assets/image/icon/i_backtotop.svg")} alt='back to top'/>
        </div>
        }
      </header>

    );
  }
}

export default Header;
