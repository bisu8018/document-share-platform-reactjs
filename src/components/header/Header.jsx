import React from "react";
import history from "apis/history/history";
import MainRepository from "../../redux/MainRepository";
import MenuContainer from "../../container/header/MenuContainer";
import ProfileCardContainer from "../../container/common/ProfileCardContainer";
import AdsContainer from "../../container/ads/AdsContainer";
import { psString } from "../../config/localization";
import { APP_PROPERTIES } from "properties/app.properties";
import log from "../../config/log";
import PrivateDocumentCountModal from "../common/modal/PrivateDocumentCountModal";
import common_view from "../../common/common_view";
import { Link } from "react-router-dom";
import CategoryContainer from "../../container/header/CategoryContainer";
import AutoSuggestInputContainer from "../../container/common/AutoSuggestInputContainer";
import Tooltip from "@material-ui/core/Tooltip";


class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountId: null,
      prevScrollPos: null,
      searchBar: false,
      profileCardShow: false,
      adShow: true,
      mobileOpen: false,
      path: null,
      awayTime: 0
    };
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
  }


  // init
  init = () => {
    if (APP_PROPERTIES.ssr) return;

    log.Header.init();
    this.setState({ prevScrollPos: window.pageYOffset, path: common_view.getPath() }, () => {
      this.clickEventListener();
      this.mouseMoveEventListener();
      this.keyDownEventListener();
      this.checkAwayTime();
    });
  };


  // 헤더 네비 카테고리 클래스 삭제
  removeClass = () => {
    const navElByClass = document.getElementsByClassName("nav-menu-link");
    for (let i = 0; i < navElByClass.length; ++i) {
      navElByClass[i].classList.remove("on");
    }
  };


  // 자리비움 시간 체크 (15 분 지날 시 자리비움)
  checkAwayTime = () => {
    //const { setAway } = this.props;

    let t = 60000;  // 1 min

    this.setInterval = setInterval(() =>
      this.setState({ awayTime: Number(this.state.awayTime + t) }, () => {
        if (this.state.awayTime >= t * 15) {
          history.push('/');
          // setAway(true);   // 백엔드 작업 전까지 보류
        }
      }), t);
  };


  // 경로 체크
  checkPath = () => {
    // path name set
    if (this.state.path !== common_view.getPath())
      this.setState({ path: common_view.getPath() });

    // 광고 표시 관리
    if (this.state.adShow !== null)
      this.setState({ adShow: common_view.getPath() === "" });
  };


  // 검색바 보임
  showSearchBar = () => this.setState({ searchBar: true });


  // 검색 바 종료
  closeSearchBar = () => this.setState({ searchBar: false });


  // 키다운 이벤트 리스너
  keyDownEventListener = () => document.addEventListener("keydown", () => this.setAwayTime());


  // 마우스 무브 이벤트 리스너
  mouseMoveEventListener = () => document.addEventListener("mousemove", () => this.setAwayTime());


  // 클릭 이벤트 리스너
  clickEventListener = () => {
    document.addEventListener("click", e => {
        const { getMyInfo } = this.props;

        // 자리비움 체크
        this.setAwayTime();

        // clicked element
        let targetElement = e.target;

        this.checkPath();

        // 프로필 카드
        const profileCard = document.getElementById("profileCard");
        const headerAvatar = document.getElementById("header-avatar");
        if (profileCard && !profileCard.contains(targetElement) && !headerAvatar.contains(targetElement))
          this.profileCardHide();

        // 뷰어페이지 옵션창
        const viewerOptionBtn = document.getElementById("viewer-option-btn");
        const viewerOptionTable = document.getElementById("viewer-option-table");
        if (viewerOptionBtn && !viewerOptionBtn.contains(targetElement))
          viewerOptionTable.classList.add("d-none");


        // 프로필 카드 프로필 버튼
        const profileCardMyAccountBtn = document.getElementById("profileCardMyAccountBtn");
        if (profileCardMyAccountBtn && profileCardMyAccountBtn.contains(targetElement)) {
          history.push("/@" + getMyInfo.username);
          this.setState({ adShow: false, path: "@" + getMyInfo.username });
          this.profileCardHide();
        }

        // 검색 input
        const headerAutoSuggest = document.getElementById("headerSearchBar");
        if (headerAutoSuggest &&
          !headerAutoSuggest.contains(targetElement) &&
          "headerSearchBtnWrapper" !== targetElement.id &&
          "mainUploadBtnSearch" !== targetElement.id &&
          targetElement.classList[0] !== "react-autosuggest__input" &&
          targetElement.classList[0] !== "react-autosuggest__suggestion"
        ) this.closeSearchBar();
      }
    );
  };


  // 자동완성 선택 시, 페이지 이동
  onSuggestionSelected = tag => {
    this.closeSearchBar();
    this.setState({ path: "latest", adShow: false });
    history.push("/latest/" + tag._id);
  };


  // 프로필 카드 보임
  profileCardShow = () => this.setState({ profileCardShow: true });


  // 프로필 카드 숨김
  profileCardHide = () => this.setState({ profileCardShow: false });


  // GET subtitle
  getSubTitle = () => {
    const paths = common_view.getPaths();
    if (paths.length === 2 && (paths[1] === "latest" || paths[1] === "featured" || paths[1] === "popular" || paths[1] === "mylist" || paths[1] === "history")) {
      return psString("main-category-" + paths[1]);
    } else if (paths.length > 2 && paths[1] === "latest") {
      if (!paths[2]) return psString("main-category-" + paths[1]);
      return paths[2];
    } else {
      return null;
    }
  };


  // 자리비움 시간 SET
  setAwayTime = () => {
    const { getAway, setAway } = this.props;
    if (this.state.awayTime > 0) this.setState({ awayTime: 0 });
    if (getAway) setAway(false);
  };


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


  // 스크롤 관리
  handleScroll = () => {
    const { path, prevScrollPos } = this.state;

    if (APP_PROPERTIES.ssr) return false;

    let currentScrollPos = window.pageYOffset;
    let headerMainNav = document.getElementById("header__main-nav");
    let headerCategoryWrapper = document.getElementById("headerCategoryWrapper");

    // main 이외 페이지에서 헤더 숨길/표시 처리
    if (path) {
      headerMainNav.style.marginBottom = "0px";
      if (prevScrollPos > currentScrollPos || currentScrollPos <= 0)
        headerMainNav.style.top = "0px";
      else
        headerMainNav.style.top = "-60px";
    }

    // main 페이지, 테그 헤더 위치 처리
    if (!path && headerCategoryWrapper) {
      if (headerCategoryWrapper.offsetTop < currentScrollPos) {
        if (headerCategoryWrapper.style.position !== "fixed")
          headerCategoryWrapper.style.position = "fixed";
        if (headerCategoryWrapper.style.borderBottom !== "1px solid #b3b3b3")
          headerCategoryWrapper.style.borderBottom = "1px solid #b3b3b3";
        if (headerCategoryWrapper.style.marginBottom !== "45px")
          headerMainNav.style.marginBottom = "45px";
      }
      if (headerMainNav.offsetTop + 60 >= currentScrollPos) {
        if (headerCategoryWrapper.style.borderBottom !== "none")
          headerCategoryWrapper.style.borderBottom = "none";
        if (headerCategoryWrapper.style.position !== "relative")
          headerCategoryWrapper.style.position = "relative";
        if (headerCategoryWrapper.style.marginBottom !== "0px")
          headerMainNav.style.marginBottom = "0px";
      }
    }

    this.setState({ prevScrollPos: currentScrollPos });
  };


  // 뒤로가기 버튼 관리
  handlePopstate = e => {
    let path = common_view.getPath();
    // 광고 및 카테고리 element 표시
    if (e.state && e.state.key) {
      if (this.state.adShow !== null) this.setState({ adShow: !path });
      this.setState({ path: path });
    }
  };


  componentWillMount() {
    this.init();
  }


  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("popstate", this.handlePopstate);
    window.addEventListener("resize", this.handleResize);
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
    const { getMyInfo, getTempEmail, getIsMobile, setModal } = this.props;

    return (

      <header id='header'>
        {path && <div className='ad-dummy'/>}
        {adShow && !path && <AdsContainer close={() => this.handleAdClose()}/>}

        <nav
          className={"navbar navbar-default navbar-expand-lg fixed-top " + (path ? "position-fixed" : "")}
          id='header__main-nav'>

          <div className='container-fluid container'>
            <div className='col-4 col-sm-3 mt-1 align-items-center d-flex'>
              <Link to="/" className='navbar-brand' onClick={() => common_view.scrollTop()} rel="nofollow">
                <div className={'header-logo' + (getIsMobile || this.getSubTitle() ? '-cut' : '')}/>
                {/*<img src={APP_PROPERTIES.domain().static + "/image/logo.svg"} alt='POLARIS SHARE'/>*/}
              </Link>
              {(!getIsMobile || (!searchBar && getIsMobile)) &&
              <div className='main-category-sub-title ml-2'>{this.getSubTitle()}</div>}
            </div>


            <div className='header-bar col-sm-9 col-8'>
              {path !== "ca" &&
              <div className="header-search-wrapper">
                <div
                  className={"header-search-input " + (searchBar ? "header-search-input-on" : "header-search-input-off")}
                  id="headerSearchBar">
                  <AutoSuggestInputContainer search={this.onSuggestionSelected} type={"tag"}/>
                </div>
                <div className='web-header-search-btn-wrapper ml-1'>
                  <div className='web-header-search-btn' id='headerSearchBtnWrapper'
                       onClick={() => this.showSearchBar()}/>
                </div>
              </div>}

              {getMyInfo.privateDocumentCount >= 5 ?
                <PrivateDocumentCountModal {...this.props} /> :
                (path !== "ca" && (!getIsMobile || (!searchBar && getIsMobile))) &&
                <div className="ml-2">
                  <Tooltip title="Share your contents" placement="bottom">
                    <div className="add-btn" onClick={() => setModal("upload", {})}>
                      <i className="material-icons">add</i>
                    </div>
                  </Tooltip>
                </div>
              }

              {(MainRepository.Account.isAuthenticated() || getTempEmail) && !getIsMobile &&
              <div className='header-avatar-wrapper ml-3' onClick={() => this.profileCardShow()}>
                {MainRepository.Account.isAuthenticated() ?
                  getMyInfo.picture.length > 0 ?
                    <img src={getMyInfo.picture} id='header-avatar' className='avatar' alt='Link to my profile'
                         onError={(e) => {
                           e.target.onerror = null;
                           e.target.src = require("assets/image/icon/i_profile-default.png");
                         }}/> :
                    <img src={require("assets/image/icon/i_profile-default.png")} className='avatar'
                         alt='Link to my profile' /> :
                  <div className='avatar-init-menu'>
                    <div className='avatar-name-init-menu'>{getTempEmail[0]}</div>
                  </div>}
                {profileCardShow && <ProfileCardContainer/>}
              </div>}

              {!MainRepository.Account.isAuthenticated() && !getTempEmail && !getIsMobile &&
              <div className='d-flex login-btn ml-2 ml-sm-3' onClick={() => this.handleLogin()}>
                {psString("header-login")}
              </div>}
              {(!getIsMobile || (!searchBar && getIsMobile)) && <MenuContainer {...this.props} />}
            </div>
          </div>
        </nav>


        <CategoryContainer path={path}/>


        {prevScrollPos > 100 &&
        <div className='scroll-top-btn' onClick={() => common_view.scrollTop()}>
          <img src={APP_PROPERTIES.domain().static + "/image/icon/i_backtotop.svg"} alt='back to top'/>
        </div>}
      </header>
    );
  }
}

export default Header;
