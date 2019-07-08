import React from "react";
import { Link } from "react-router-dom";
import Common from "../../config/common";

class Footer extends React.Component {

  render() {
    return (

      <footer id="footer">
        <div className="container p-4 row">
          <div className="footer-logo col-sm-3">
            <a href={"/"} title="Link to main page">
              <img className="footer-logo-img" src={require("assets/image/logo-mono.png")} alt="POLARIS SHARE"/>
            </a>
            <div className="copyright">
              Copyrightⓒ 2019 POLARIS SHARE
            </div>
          </div>
          <div className="footer-legal col-sm-6 row">
            <Link to="/about">
              <div className="footer-nav footer-nav-divider mb-2" onClick={() => Common.scrollTop()}>About US</div>
            </Link>
            <Link to="/faq">
              <div className="footer-nav footer-nav-divider mb-2" onClick={() => Common.scrollTop()}>FAQ</div>
            </Link>
            <Link to="/guide">
              <div className="footer-nav footer-nav-divider footer-nav-divider-ug mb-2" onClick={() => Common.scrollTop()}>User Guide</div>
            </Link>
            <div className="footer-br"/>
            <Link to="/terms">
              <div className="footer-nav footer-nav-divider  mb-2" onClick={() => Common.scrollTop()}>Terms of Service</div>
            </Link>
            <Link to="/policies">
              <div className="footer-nav footer-nav-divider  mb-2" onClick={() => Common.scrollTop()}>Policies</div>
            </Link>
            <Link to="/privacy">
              <div className="footer-nav" onClick={() => Common.scrollTop()}>Privacy</div>
            </Link>
          </div>
          <div className="footer-sns col-sm-3 row">
            <div className="m-auto">
              <img className="mr-3 c-pointer" src={require("assets/image/sns/ic-sns-facebook.svg")} alt="Facebook"/>
              <img className="mr-3 c-pointer" src={require("assets/image/sns/ic-sns-twitter.svg")} alt="Twitter"/>
              <img className="mr-3 c-pointer" src={require("assets/image/sns/ic-sns-insta.svg")} alt="Instagram"/>
              <img className="c-pointer" src={require("assets/image/sns/ic-sns-linkedin.svg")} alt="Linkedin"/>
            </div>
          </div>
          <div className="footer-copyright">
            Copyrightⓒ 2019 POLARIS SHARE
          </div>
        </div>
      </footer>

    );
  }
}

export default Footer;
