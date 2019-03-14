import React from "react";
import UploadDocument from "../../components/modal/UploadDocument";
import { Link, NavLink } from "react-router-dom";
import Bounty from "./Bounty";
import Menu from "../../components/common/Menu";
import MainRepository from "../../redux/MainRepository";

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

  handleDrawerToggle() {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  }

  handleOpen = () => {
    const { auth } = this.props;
    auth.login();
  };

  getAccount = () => {
    MainRepository.Account.getAccountInfo((result) => {
      this.setState({ accountId: result.accountId });
    }, err => {
      this.setState({ accountId: null });
    });
  };

  handleScroll = () => {
    let currentScrollPos = window.pageYOffset;
    if (this.state.prevScrollPos > currentScrollPos) {
      document.getElementById("header__main-nav").style.top = "0";
    } else {
      document.getElementById("header__main-nav").style.top = "-60px";
    }
    this.setState({prevScrollPos : currentScrollPos});
  };

  componentWillMount() {
    const pathname = window.location.pathname;
    if (pathname === "/") {
      window.location.pathname += "latest";
    }
    this.setState({prevScrollPos : window.pageYOffset});
    this.getAccount();
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  render() {
    const { auth } = this.props;
    let userInfo = auth.getUserInfo();
    return (

      <header id="header">
        <nav className="navbar navbar-default navbar-expand-lg fixed-top" id="header__main-nav">
          <div className="container-fluid">
            <div className="col-4 col-lg-4">
              <a className="navbar-brand" href="/">
                <img src={require("assets/image/logo.png")} alt="DECOMPANY"/>
              </a>
            </div>

            <div className="navbar-menu col-lg-4 d-none d-lg-block">
              <ul>
                <li className="navbar-menu-latest" title="latest"><NavLink to="/latest"
                                                                           activeClassName="on">Latest</NavLink></li>
                <li className="navbar-menu-featured" title="featured"><NavLink to="/featured"
                                                                               activeClassName="on">Featured</NavLink>
                </li>
                <li className="navbar-menu-popular" title="popular"><NavLink to="/popular"
                                                                             activeClassName="on">Popular</NavLink></li>
              </ul>
            </div>


            <div className="navbar-menu  col-8 col-lg-4">
              <ul className="float-right">
                <li title="upload">
                  <UploadDocument {...this.props} />
                </li>
                {auth.isAuthenticated() ?
                  <li title="profile" className=" d-none d-sm-inline-block">
                    {this.state.accountId &&
                    <Link to={"/author/" + this.state.accountId} className="avatar">
                      {userInfo.nickname[0]}
                    </Link>
                    }
                    {!this.state.accountId &&
                    <Link to={"/author/" + this.state.accountId} className="avatar">
                      {userInfo.nickname[0]}
                    </Link>
                    }
                  </li>
                  :
                  <li className="d-none d-sm-inline-block login-btn" onClick={this.handleOpen} title="login">
                    <i className="material-icons">edit</i>
                    Log-in
                  </li>

                }
                <li title="menu">
                  <Menu {...this.props} />
                </li>
              </ul>
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

        <Bounty {...this.props} />

      </header>

    );
  }
}

export default Header;