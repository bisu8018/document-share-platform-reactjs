import React from "react";
import MainRepository from "../../redux/MainRepository";
import { Link } from "react-router-dom";
import Common from "../../common/common";
import { psGetLang, psSetLang, psString } from "../../config/localization";
import common_view from "../../common/common_view";

class Menu extends React.Component {
  state = {
    menuShow: false
  };


  // 메뉴 표시
  menuShow = () => {
    this.setState({ menuShow: true }, () => {
      common_view.setBodyStyleLock();
    });
  };


  // 메뉴 숨김
  menuHide = () => {
    this.setState({ menuShow: false }, () => {
      common_view.setBodyStyleUnlock();
    });
  };


  // 메뉴 클릭
  menuClick = () => {
    this.menuHide();
    common_view.scrollTop();
  };


  // 언어 설정 관리
  handleLang = () => psGetLang() === "EN" ? psSetLang("KO") : psSetLang("EN");


  render() {
    const { menuShow } = this.state;
    const { getMyInfo, getTempEmail, getIsMobile } = this.props;

    let identification = getMyInfo.username.length && getMyInfo.username.length > 0 ? getMyInfo.username : getMyInfo.email;

    return (
      <div className="ml-3">
        <div className="menu-btn-wrapper">
          <div className="menu-btn d-inline-block " onClick={() => this.menuShow()}/>
        </div>
        {menuShow &&
        <div className="menu-wrapper">
          <div className="container">
            <img className="menu-close-btn" onClick={() => this.menuHide()}
                 src={require("assets/image/icon/i_close_menu" + (getIsMobile ? "_mobile" : "") + ".svg")}
                 alt="menu close button"/>
          </div>

          {(MainRepository.Account.isAuthenticated() || getTempEmail) &&
          <div className="d-black d-sm-none">
            {MainRepository.Account.isAuthenticated() ?
              <Link to={"/@" + identification} onClick={() => this.menuClick()} rel="nofollow">
                {getMyInfo.picture.length > 0 ?
                  <img src={getMyInfo.picture} className="avatar-menu" alt="Link to my profile"/> :
                  <img src={require("assets/image/icon/i_anonymous.png")} className="avatar"
                       alt="Link to my profile"/>}
                <span className="avatar-name-menu">{identification}</span>
              </Link> :
              <div className="avatar-init-menu">
                <div className="avatar-name-init-menu">{getTempEmail[0]}</div>
              </div>}
          </div>}


          <div className="d-flex menu-content-list">
            <div>
              <Link to="/a" rel="nofollow">
                <div className="menu-content-item" onClick={() => this.menuClick()}>{psString("menu-1")}</div>
              </Link>
              <Link to="/g" rel="nofollow">
                <div className="menu-content-item" onClick={() => this.menuClick()}>{psString("menu-2")}</div>
              </Link>
              <Link to="/f" rel="nofollow">
                <div className="menu-content-item" onClick={() => this.menuClick()}>FAQ</div>
              </Link>
              <a href="http://www.decompany.io/" target="_blank" rel="noopener noreferrer nofollow">
                <div className="menu-content-item">{psString("menu-5")}</div>
              </a>
              <a href="https://www.linkedin.com/in/decompany-io-720812178/" target="_blank"
                 rel="noopener noreferrer nofollow">
                <div className="menu-content-item-sub">{psString("menu-3")}</div>
              </a>
              <div className="menu-content-item-sub">{psString("menu-4")}</div>
              <div className='menu-content-item-sub' onClick={() => this.handleLang()}>

                {psGetLang() === "EN" ? "Global" : "Korea"}
              </div>
            </div>
          </div>


          {!MainRepository.Account.isAuthenticated() ?
            <div className="menu-login-btn d-flex d-sm-none"
                 onClick={() => MainRepository.Account.login()}>{psString("menu-login")}</div> :
            <div className="menu-logout-btn d-flex d-sm-none"
                 onClick={() => MainRepository.Account.logout()}>{psString("menu-sign-out")}</div>}
          {getTempEmail &&
          <div className="menu-logout-btn d-flex d-sm-none"
               onClick={() => MainRepository.Account.logout()}>{psString("menu-sign-out")}</div>}

          <div className="header-version">{Common.getVersion()}</div>
        </div>}

      </div>
    );
  }
}


export default Menu;
