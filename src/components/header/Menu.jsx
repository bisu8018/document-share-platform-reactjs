import React from "react";
import MainRepository from "../../redux/MainRepository";
import UserInfo from "../../redux/model/UserInfo";
import { Link } from "react-router-dom";
import Common from "../../util/Common";

class Menu extends React.Component {
  state = {
    menuShow: false
  };

  menuShow = () => {
    this.setState({ menuShow: true });
  };

  menuHide = () => {
    this.setState({ menuShow: false });
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

    MainRepository.Account.logout(() => {
      setMyInfo(new UserInfo());
    });
  };

  render() {
    const { menuShow } = this.state;
    const { getMyInfo } = this.props;

    let identification = getMyInfo.username.length && getMyInfo.username.length > 0 ? getMyInfo.username : getMyInfo.email;

    return (
      <div className="d-inline-block ">

        <div className="menu-btn d-inline-block " onClick={() => this.menuShow()}/>


        {menuShow &&
        <div className="menu-wrapper">
          <i className="material-icons menu-close-btn" onClick={() => this.menuHide()}>clear</i>

          {MainRepository.Account.isAuthenticated() &&
          <div className="d-black d-sm-none">
            <Link to={"/" + identification}
                  onClick={() => this.menuClick()}>
              {getMyInfo.picture.length > 0 ?
                <img src={getMyInfo.picture} className="avatar-menu" alt="Link to my profile"/> :
                <img src={require("assets/image/icon/i_anonymous.png")} className="avatar"
                     alt="Link to my profile"/>
              }
              <span className="avatar-name-menu">{identification}</span>
            </Link>
          </div>
          }

          <div className="menu-content-list">
            <a href="/about.html" title="Link to about us page">
              <div className="menu-content-item">About Us</div>
            </a>
            <div className="menu-content-item">User Guide</div>
            <Link to="/faq">
              <div className="menu-content-item" onClick={() => this.menuClick()}>FAQ</div>
            </Link>
            <div className="menu-content-item">Connect With Us</div>
            <div className="menu-content-item-sub">Official Linkedin<br/>Whitepaper</div>
          </div>

          {!MainRepository.Account.isAuthenticated() ?
            <div className="menu-login-btn d-flex d-sm-none" onClick={() => this.handleLogin()}>Login</div> :
            <div className="menu-logout-btn d-flex d-sm-none" onClick={() => this.handleLogout()}>Sign out</div>
          }
        </div>
        }


      </div>
    );
  }
}


export default Menu;