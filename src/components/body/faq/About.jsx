import React from "react";
import { Link } from "react-router-dom";
import Common from "../../../util/Common";


class About extends React.PureComponent {


  render() {

    return (

      <div className="about-container">


        <div className="about-section-1">
          <div className="container row">
            <div className="col-6">
              <div className="about-main-title ">
                Sharing knowledge
                in new ways
              </div>
              <div className="about-main-content ">
                Polaris Share is a system that shares knowledge
                and is compensated by user's vote.
              </div>
              <Link to="/faq">
                <div className="main-learn-more-btn tac" onClick={() => Common.scrollTop()} title="Link to FAQ">Learn
                  more
                </div>
              </Link>
            </div>
            <div className="col-6 about-main-img">
              <img src={require("assets/image/common/about-main.png")} alt="about us main"/>
            </div>
          </div>
        </div>


        <div className="about-section-2">
          <div className="container row">
            <div className="col-12">
              <div className="about-sub-title ">
                Why Polaris Share?
              </div>
              <div className="about-sub-content ">
                Polaris Share connects knowledge creators and seekers to build a decentralized and incentive-based
                knowledge trading system.
                We create an environment that allows companies to work with people with most required skills from all
                around the world without hiring them, and at the same time, helps individuals work when and where they
                want and receive decent rewards without being hired by a certain company. We have realized that a wealth
                of knowledge and a good number of Knowledge Creators are not fully tapped. In order to solve this
                problem, we plan to create a Decentralized and Incentive-based knowledge trading system “Polaris Share.”
              </div>
            </div>
          </div>
        </div>


        <div className="about-section-3">
          <div className="container row">
            <div className="col-6">
              <div className="about-sub-title ">
                Service
              </div>
              <div className="about-sub-content ">
                Polaris Share service is a decentralized and incentivized knowledge trading system that connects a
                knowledge creator and an audience. This project goes beyond a simple document sharing service by grading
                the value of the knowledge and trading them so that the knowledge creators can get the compensation and
                the audience can get higher quality knowledge at a low cost.
              </div>
            </div>
            <div className="col-6 p-0">
              <div className="row">
                <div className="col-6 ">
                  <div className="main-category-card d-inline-block m-auto">

                    <div className="main-category-card-img-wrapper">
                      <img className="main-category-card-img" src={require("assets/image/common/about-sample-1.png")}
                           alt="sample 1"/>
                    </div>

                    <div className="main-category-card-content">
                      <div className="main-category-card-title c-pointer">Sample PPT First</div>

                      <div className="main-category-card-profile pb-2">
                        <img src={require("assets/image/common/about-sample-person-1.png")} alt="sample person 1"/>
                        <span className="main-category-card-name c-pointer">Anderson</span>
                        <span className="main-category-card-date">1 days ago</span>
                      </div>

                      <div className="main-category-card-count">
                      <span className="main-category-card-reward mt-2">
                        $32
                        <img className="reward-arrow" src={require("assets/image/icon/i_arrow_down_blue.svg")}
                             alt="arrow button"/>
                      </span>
                        <span className="main-category-card-vote float-right">150</span>
                        <span className="main-category-card-view float-right">751</span>
                      </div>
                    </div>


                    <div className="main-category-card-reward-info d-inline-block">
                      Creator payout <span className="font-weight-bold">21 DECK</span> in 7 days
                    </div>
                  </div>
                </div>


                <div className="col-6 tar">
                  <div className="main-category-card d-inline-block m-auto">

                    <div className="main-category-card-img-wrapper">
                      <img className="main-category-card-img" src={require("assets/image/common/about-sample-2.png")}
                           alt="sample 1"/>
                    </div>

                    <div className="main-category-card-content">
                      <div className="main-category-card-title c-pointer">Sample PPT Second</div>

                      <div className="main-category-card-profile pb-2">
                        <img src={require("assets/image/common/about-sample-person-2.png")} alt="sample person 1"/>
                        <span className="main-category-card-name c-pointer">Anya</span>
                        <span className="main-category-card-date">5 days ago</span>
                      </div>

                      <div className="main-category-card-count">
                      <span className="main-category-card-reward mt-2">
                        $201
                        <img className="reward-arrow" src={require("assets/image/icon/i_arrow_down_blue.svg")}
                             alt="arrow button"/>
                      </span>
                        <span className="main-category-card-vote float-right mt-2">7650</span>
                        <span className="main-category-card-view float-right mt-2">11801</span>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>


        <div className="about-section-4">
          <div className="container row">
            <div className="col-12 mb-5">
              <div className="about-sub-title ">
                Vision
              </div>
              <div className="about-sub-content ">
                Decentralized and Incentivized Professional Knowledge Trading System
              </div>
            </div>

            <div className="col-12 row">
              <div className="col-12 col-sm-4 tac">
                <img src={require("assets/image/common/about-vision-img-01.svg")}
                     alt="Value of knowledge"/>
                <div className="about-vision-title">
                  Value of knowledge
                </div>
                <div className="about-vision-content">
                  Polaris Share returns the value of knowledge stored in documents and network to Knowledge Creators and
                  other users.
                </div>
              </div>
              <div className="col-12 col-sm-4 tac">
                <img src={require("assets/image/common/about-vision-img-02.svg")}
                     alt="No transaction fees"/>
                <div className="about-vision-title">
                  No transaction fees
                </div>
                <div className="about-vision-content">
                  Knowledge Creators get rewards from sharing or selling documents on Polaris Share with no or with low
                  transaction fees
                </div>
              </div>
              <div className="col-12 col-sm-4 tac">
                <img src={require("assets/image/common/about-vision-img-03.svg")}
                     alt="Content shared"/>
                <div className="about-vision-title">
                  Content shared
                </div>
                <div className="about-vision-content">
                  Audiences will benefit from more and better content shared by Knowledge creators.
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="about-section-5">
          <div className="container row">


            <div className="col-12">
              <div className="about-sub-title ">Polaris Share Team</div>


              <div className="row about-team-wrapper">
                <div className="col-6 p-0">
                  <div className="position-relative mb-3">


                    <div className="about-team-linkedin">
                      <a className="team-icon" href="https://www.linkedin.com/in/dalsam/" target="_blank" rel="noopener noreferrer">
                        <img src={require("assets/image/common/about-linkedin.svg")} alt="Linkedin icon"/>
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


                <div className="col-6 p-0">
                  <div className="position-relative mb-3">

                    <div className="about-team-linkedin">
                      <a className="team-icon" href="https://www.linkedin.com/in/eddie-kwak/" target="_blank" rel="noopener noreferrer">
                        <img src={require("assets/image/common/about-linkedin.svg")} alt="Linkedin icon"/>
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


              <div className="row ">
                <div className="col-6 p-0">
                  <div className="position-relative mb-3">


                    <div className="about-team-linkedin">
                      <a className="team-icon" href="https://www.linkedin.com/in/chris-lee-sw/" target="_blank" rel="noopener noreferrer">
                        <img src={require("assets/image/common/about-linkedin.svg")} alt="Linkedin icon"/>
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


                <div className="col-6 p-0">
                  <div className="position-relative mb-3">

                    <div className="about-team-linkedin">
                      <a className="team-icon" href="https://www.linkedin.com/in/richard-yoon" target="_blank" rel="noopener noreferrer">
                        <img src={require("assets/image/common/about-linkedin.svg")} alt="Linkedin icon"/>
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


            </div>
          </div>
        </div>

      </div>

    );
  }
}

export default About;
