import React from "react";

class Footer extends React.Component {

  render() {
    return (

      <footer id="footer">
        <div className="container p-4 row">
          <div className="footer-logo d-none d-sm-inline-block col-sm-3">
            <img src={require("assets/image/logo-mono.svg")} alt="POLARIS SHARE"/>
            <div className="copyright">
              Copyrightⓒ 2019 POLARIS SHARE
            </div>
          </div>
          <div className="col-12 col-sm-6 row">
            <div className="footer-nav footer-nav-divider">About US</div>
            <div className="footer-nav footer-nav-divider">FAQ</div>
            <div className="footer-nav footer-nav-divider">User Guide</div>
            <div className="footer-nav footer-nav-divider">Policies</div>
            <div className="footer-nav">Privacy</div>
          </div>
          <div className="col-12 col-sm-3 row">
            <img className="mr-3 c-pointer" src={require("assets/image/sns/ic-sns-facebook.svg")} alt="Facebook"/>
            <img className="mr-3 c-pointer" src={require("assets/image/sns/ic-sns-twitter.svg")} alt="Twitter"/>
            <img className="mr-3 c-pointer" src={require("assets/image/sns/ic-sns-insta.svg")} alt="Instagram"/>
            <img className="c-pointer" src={require("assets/image/sns/ic-sns-linkedin.svg")} alt="Linkedin"/>
          </div>
        </div>
      </footer>

    );
  }
}

export default Footer;