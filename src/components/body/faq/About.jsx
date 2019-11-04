import React from "react";
import { Link } from "react-router-dom";
import { psString } from "../../../config/localization";
import { Helmet } from "react-helmet";
import common_view from "../../../common/common_view";
import { APP_PROPERTIES } from "../../../properties/app.properties";


class About extends React.Component {

  render() {

    return (
      <div className="container ">
        <Helmet>
          <title>{psString("helmet-title-about-us") + " | Polaris Share"}</title>
        </Helmet>

        <section className="col-12 row about-section-1-wrapper">
          <div className="about-section-1"/>

          <div className="col-12 col-md-6 order-last order-md-first">
            <div className="about-main-title ">
              {psString("about-main-subj")}
            </div>
            <div className="about-main-content ">
              {psString("about-main-explain")}
            </div>
            <div className="about-text-align">
              <Link to="/f" rel="nofollow">
                <div className="main-learn-more-btn tac" onClick={() => common_view.scrollTop()}
                     title="Link to FAQ">{psString("main-banner-btn-4")}</div>
              </Link>
            </div>
          </div>
          <div className="col-12 col-md-6 about-main-img order-first order-md-last">
            <img src={APP_PROPERTIES.domain().static + "/image/common/about-main.png"} alt="about us main"/>
          </div>
        </section>


        <section className=" row about-section-wrapper">
          <div className="col-12">
            <div className="about-sub-title ">
              {psString("about-first-section-subj")}
            </div>
            <div className="about-sub-content row">
              <div className="col-12 col-lg-6 p-0 mb-5">
                {psString("about-first-section-explain")}
              </div>
              <div className="col-12 col-lg-6 about-yt-wrapper">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/3sVNpNd4Z6A" title="About Decompany"
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen/>
              </div>
            </div>
          </div>
        </section>


        <section className="col-12 row about-section-3-wrapper">
          <div className="about-section-3"/>
          <div className="col-12 col-md-6">
            <div className="about-sub-title ">
              {psString("about-service")}
            </div>
            <div className="about-sub-content ">
              {psString("about-second-section-explain")}
            </div>
          </div>
          <div className="col-12 col-md-6 p-0">
            <div className="row">
              <div className="col-12 col-md-6 mt-md-0 mt-3">
                <div className="main-category-card d-inline-block m-auto">

                  <div className="main-category-card-img-wrapper">
                    <img className="main-category-card-img" src={APP_PROPERTIES.domain().static + "/image/common/about-sample-1.png"}
                         alt="sample 1"/>
                  </div>

                  <div className="main-category-card-content">
                    <div className="main-category-card-title c-pointer">Sample PPT 1</div>

                    <div className="main-category-card-profile pb-2">
                      <img src={APP_PROPERTIES.domain().static + "/image/common/about-sample-person-1.png"} alt="sample person 1"/>
                      <span className="main-category-card-name c-pointer">Anderson</span>
                      <span className="main-category-card-date">1 days ago</span>
                    </div>

                    <div className="main-category-card-count">
                      <span className="main-category-card-reward mt-2">
                        $32
                        <img className="reward-arrow" src={APP_PROPERTIES.domain().static + "/image/icon/i_arrow_down_blue.svg"}
                             alt="arrow button"/>
                      </span>
                      <span className="main-category-card-vote float-right mt-2">150</span>
                      <span className="main-category-card-view float-right mt-2">751</span>
                    </div>
                  </div>

                  <div className="main-category-card-reward-info d-inline-block">
                    {psString("profile-payout-txt-1")} <span
                    className="font-weight-bold">21 DECK</span> {psString("profile-payout-txt-2")}
                  </div>
                </div>
              </div>


              <div className="col-6 d-none d-xl-inline-block">
                <div className="main-category-card d-inline-block m-auto">

                  <div className="main-category-card-img-wrapper">
                    <img className="main-category-card-img" src={APP_PROPERTIES.domain().static + "/image/common/about-sample-2.png"}
                         alt="sample 1"/>
                  </div>

                  <div className="main-category-card-content">
                    <div className="main-category-card-title c-pointer">Sample PPT 2</div>

                    <div className="main-category-card-profile pb-2">
                      <img src={APP_PROPERTIES.domain().static + "/image/common/about-sample-person-2.png"} alt="sample person 1"/>
                      <span className="main-category-card-name c-pointer">Anya</span>
                      <span className="main-category-card-date">5 days ago</span>
                    </div>

                    <div className="main-category-card-count">
                      <span className="main-category-card-reward mt-2">
                        $201
                        <img className="reward-arrow" src={APP_PROPERTIES.domain().static + "/image/icon/i_arrow_down_blue.svg"} alt="arrow button"/>
                      </span>
                      <span className="main-category-card-vote float-right mt-2">7650</span>
                      <span className="main-category-card-view float-right mt-2">11801</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section className="col-12 row about-section-wrapper">
          <div className="col-12 mb-4 mb-md-5">
            <div className="about-sub-title ">
              {psString("about-vision")}
            </div>
            <div className="about-sub-content ">
              {psString("about-third-section-explain")}
            </div>
          </div>

          <div className="col-12 row">
            <div className="col-12 col-md-4 tac">
              <img src={APP_PROPERTIES.domain().static + "/image/common/about-vision-img-01.svg"}
                   alt="Value of knowledge"/>
              <div className="about-vision-title">
                {psString("about-third-section-chap-subj-1")}
              </div>
              <div className="about-vision-content">
                {psString("about-third-section-chap-explain-1")}
              </div>
            </div>
            <div className="col-12 col-md-4 tac">
              <img src={APP_PROPERTIES.domain().static + "/image/common/about-vision-img-02.svg"}
                   alt="No transaction fees"/>
              <div className="about-vision-title">
                {psString("about-third-section-chap-subj-2")}
              </div>
              <div className="about-vision-content">
                {psString("about-third-section-chap-explain-2")}
              </div>
            </div>
            <div className="col-12 col-md-4 tac">
              <img src={APP_PROPERTIES.domain().static + "/image/common/about-vision-img-03.svg"}
                   alt="Content shared"/>
              <div className="about-vision-title">
                {psString("about-third-section-chap-subj-3")}
              </div>
              <div className="about-vision-content">
                {psString("about-third-section-chap-explain-3")}
              </div>
            </div>
          </div>
        </section>


        <section className="col-12 row about-section-wrapper">
          <div className="about-section-5"/>
          <div className="about-sub-title col-12 ">  {psString("about-ps-team")}</div>


          <div className="row col-12 ">
            <div className="col-12 col-md-6 pl-0 pr-0 about-team-wrapper">
              <div className="position-relative mb-3">


                <div className="about-team-linkedin">
                  <a className="team-icon" href="https://www.linkedin.com/in/dalsam/" target="_blank"
                     rel="noopener noreferrer">
                    <img src={APP_PROPERTIES.domain().static + "/image/common/about-linkedin.svg"} alt="Linkedin icon"/>
                  </a>
                </div>

                <div className="ml-5">
                  <div className="about-team-name">Miles H. Lee</div>
                  <div className="about-team-position">Chief Executive Officer</div>
                </div>
              </div>

              <div className="about-team-info">
                Current CEO of Decompany <br/>
                Current CEO of INFRAWARE(KOSDAQ Listed) <br/>
                Former CFO of SELVAS Healthcare(KOSDAQ Listed) <br/>
                Strategy Planning Manager of INFRAWARE <br/>
                Lead Engineer of Mobile Browser Development <br/>
                Manager of Browser Sales Team <br/>
                Computer Science, Yonsei University
              </div>
            </div>


            <div className="col-12 col-md-6 pl-0 pr-0 about-team-wrapper">
              <div className="position-relative mb-3">

                <div className="about-team-linkedin">
                  <a className="team-icon" href="https://www.linkedin.com/in/eddie-kwak/" target="_blank"
                     rel="noopener noreferrer">
                    <img src={APP_PROPERTIES.domain().static + "/image/common/about-linkedin.svg"} alt="Linkedin icon"/>
                  </a>
                </div>

                <div className="ml-5">
                  <div className="about-team-name">Eddie M. Kwak</div>
                  <div className="about-team-position">Chief Strategy officer</div>
                </div>
              </div>

              <div className="about-team-info">
                Current CSO of Decompany <br/>
                Current Chairman of SELVAS Group <br/>
                : Consists of 3 KOSDAQ, 1 KNONEX Listed Company <br/>
                Founder of INFRAWARE(KOSDAQ Listed) <br/>
                MA, Computer Science, Hankuk University of Foreign Studies
              </div>
            </div>
          </div>


          <div className="row col-12">
            <div className="col-12 col-md-6 pl-0 pr-0 about-team-wrapper">
              <div className="position-relative mb-3">


                <div className="about-team-linkedin">
                  <a className="team-icon" href="https://www.linkedin.com/in/chris-lee-sw/" target="_blank"
                     rel="noopener noreferrer">
                    <img src={APP_PROPERTIES.domain().static + "/image/common/about-linkedin.svg"} alt="Linkedin icon"/>
                  </a>
                </div>

                <div className="ml-5">
                  <div className="about-team-name">Chris K. Lee</div>
                  <div className="about-team-position">Chief Technology Officer</div>
                </div>
              </div>

              <div className="about-team-info">
                Current CTO of Decompany <br/>
                Big Data, Cloud, Middleware Engineering & internet service application architecting <br/>
                Material Science & Engineering, Korea University
              </div>
            </div>


            <div className="col-12 col-md-6 pl-0 pr-0 mb-md-5">
              <div className="position-relative mb-3">

                <div className="about-team-linkedin">
                  <a className="team-icon" href="https://www.linkedin.com/in/richard-yoon" target="_blank"
                     rel="noopener noreferrer">
                    <img src={APP_PROPERTIES.domain().static + "/image/common/about-linkedin.svg"} alt="Linkedin icon"/>
                  </a>
                </div>

                <div className="ml-5">
                  <div className="about-team-name">Richard S. Yoon</div>
                  <div className="about-team-position">Chief Growth Officer</div>
                </div>
              </div>

              <div className="about-team-info">
                Current CGO of Decompany <br/>
                Current Vice President of SELVAS Group <br/>
                Former Softbank Finance group <br/>
                Former Merrill Lynch International <br/>
                Vocal Department, Seoul National University

              </div>
            </div>
          </div>


        </section>

      </div>

    );
  }
}

export default About;
