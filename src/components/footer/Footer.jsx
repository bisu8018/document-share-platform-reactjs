import React from "react";
import { Link } from "react-router-dom";
import Common from "../../config/common";
import { psString } from "../../config/localization";

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
              <div className="footer-nav footer-nav-divider mb-2" onClick={() => Common.scrollTop()}>{psString("footer-1")}</div>
            </Link>
            <Link to="/faq">
              <div className="footer-nav footer-nav-divider mb-2" onClick={() => Common.scrollTop()}>FAQ</div>
            </Link>
            <Link to="/guide">
              <div className="footer-nav footer-nav-divider footer-nav-divider-ug mb-2"
                   onClick={() => Common.scrollTop()}>{psString("footer-2")}
              </div>
            </Link>
            <div className="footer-br"/>
            <Link to="/terms">
              <div className="footer-nav footer-nav-divider  mb-2" onClick={() => Common.scrollTop()}>{psString("footer-3")}
              </div>
            </Link>
            <Link to="/privacy">
              <div className="footer-nav" onClick={() => Common.scrollTop()}>{psString("footer-4")}</div>
            </Link>
          </div>
          <div className="footer-sns col-sm-3 row">
            <div className="footer-sns-wrapper">
              <a target="_blank" href={"https://www.facebook.com/polarishare/"} rel="noopener noreferrer">
                <img className="mr-3 c-pointer" src={require("assets/image/sns/ic-sns-facebook.svg")} alt="Facebook Page"/>
              </a>
              <a target="_blank" href={"https://twitter.com/Polarishare"} rel="noopener noreferrer">
                <img className="mr-3 c-pointer" src={require("assets/image/sns/ic-sns-twitter.svg")} alt="Twitter Page"/>
              </a>
              <a target="_blank" href={"https://www.instagram.com/polarishare.io/"} rel="noopener noreferrer">
              <img className="mr-3 c-pointer" src={require("assets/image/sns/ic-sns-insta.svg")} alt="Instagram Page"/>
              </a>
              <a target="_blank" href={"https://www.linkedin.com/in/decompany-io-720812178/"} rel="noopener noreferrer">
                <img className="c-pointer" src={require("assets/image/sns/ic-sns-linkedin.svg")} alt="Linkedin Page"/>
              </a>
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
