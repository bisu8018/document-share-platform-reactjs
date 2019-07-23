import React from "react";
import MainRepository from "../../redux/MainRepository";
import UserInfo from "../../redux/model/UserInfo";
import { Link } from "react-router-dom";
import Common from "../../config/common";
import { psString } from "../../config/localization";

class Menu extends React.Component {
  state = {
    menuShow: false
  };

  menuShow = () => {
    this.setState({ menuShow: true }, () => {
      Common.setBodyStyleLock();
    });
  };

  menuHide = () => {
    this.setState({ menuShow: false }, () => {
      Common.setBodyStyleUnlock();
    });
  };

  menuClick = () => {
    this.menuHide();
    Common.scrollTop();
  };

  handleLogin = () => {
    MainRepository.Account.login();
  };

  handleLogout = () => {
    const { setMyInfo } = this.props;

    if (MainRepository.Account.isAuthenticated()) {
      MainRepository.Account.logout(() => {
        setMyInfo(new UserInfo());
      });
    } else {
      window.location.reload();
    }
  };

  render() {
    const { menuShow } = this.state;
    const { getMyInfo, getTempEmail, getIsMobile } = this.props;

    let identification = getMyInfo.username.length && getMyInfo.username.length > 0 ? getMyInfo.username : getMyInfo.email;

    return (
      <div className="d-inline-block ">
        <div className="menu-btn d-inline-block " onClick={() => this.menuShow()}/>


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
              <Link to={"/" + identification}
                    onClick={() => this.menuClick()}>
                {getMyInfo.picture.length > 0 ?
                  <img src={getMyInfo.picture} className="avatar-menu" alt="Link to my profile"/> :
                  <img src={require("assets/image/icon/i_anonymous.png")} className="avatar"
                       alt="Link to my profile"/>}
                <span className="avatar-name-menu">{identification}</span>
              </Link>
              :

              <div className="avatar-init-menu">
                <div className="avatar-name-init-menu">{getTempEmail[0]}</div>
              </div>
            }
          </div>
          }


          <div className="menu-content-list">
            <Link to="/about">
              <div className="menu-content-item" onClick={() => this.menuClick()}>{psString("menu-1")}</div>
            </Link>
            <Link to="/guide">
              <div className="menu-content-item" onClick={() => this.menuClick()}>{psString("menu-2")}</div>
            </Link>
            <Link to="/faq">
              <div className="menu-content-item" onClick={() => this.menuClick()}>FAQ</div>
            </Link>
            <a href="http://www.decompany.io/" target="_blank" rel="noopener noreferrer">
              <div className="menu-content-item">{psString("menu-5")}</div>
            </a>
            <a href="https://www.linkedin.com/in/decompany-io-720812178/" target="_blank" rel="noopener noreferrer">
              <div className="menu-content-item-sub">{psString("menu-3")}</div>
            </a>
            <div className="menu-content-item-sub">{psString("menu-4")}</div>
          </div>


          {!MainRepository.Account.isAuthenticated() ?
            <div className="menu-login-btn d-flex d-sm-none"
                 onClick={() => this.handleLogin()}>{psString("menu-login")}</div> :
            <div className="menu-logout-btn d-flex d-sm-none"
                 onClick={() => this.handleLogout()}>{psString("menu-sign-out")}</div>
          }
          {getTempEmail &&
          <div className="menu-logout-btn d-flex d-sm-none"
               onClick={() => this.handleLogout()}>{psString("menu-sign-out")}</div>}

          <div className="header-version">{Common.getVersion()}</div>
        </div>
        }

      </div>
    );
  }
}


export default Menu;
