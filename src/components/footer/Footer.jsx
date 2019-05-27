import React from "react";
import { Link } from "react-router-dom";
import { APP_PROPERTIES } from "properties/app.properties";

class Footer extends React.Component {

  render() {
    return (

      <footer id="footer">
        <div className="container p-4 row">
          <div className="footer-logo col-sm-3">
            <a href={"/"} title="Link to main page">
              <img src={require("assets/image/logo-mono.svg")} alt="POLARIS SHARE"/>
            </a>
            <div className="copyright">
              Copyrightⓒ 2019 POLARIS SHARE
            </div>
          </div>
          <div className="footer-legal col-sm-6 row">
            <div className="footer-nav footer-nav-divider mb-2">About US</div>
            <Link to="/faq">
              <div className="footer-nav footer-nav-divider mb-2">FAQ</div>
            </Link>
            <div className="footer-nav footer-nav-divider mb-2">User Guide</div>
            <a href={APP_PROPERTIES.domain().mainHost + "/legal/policy.html"} target="_blank" rel="noopener noreferrer">
              <div className="footer-nav footer-nav-divider  mb-2">Policies</div>
            </a>
            <a href={APP_PROPERTIES.domain().mainHost + "/legal/privacy.html"} target="_blank" rel="noopener noreferrer">
              <div className="footer-nav">Privacy</div>
            </a>
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