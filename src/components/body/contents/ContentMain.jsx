import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";

import MainRepository from "../../../redux/MainRepository";
import DocumentCardContainer from "../../../container/common/DocumentCardContainer";

class ContentMain extends Component {
  state = {
    latestDocuments: null,
    featuredDocuments: null,
    popularDocuments: null

  };

  getDocuments = (path) => {
    const params = {
      path: path
    };

    MainRepository.Document.getDocumentList(params, (res) => {
      if (path === "latest") this.setState({ latestDocuments: res });
      else if (path === "featured") this.setState({ featuredDocuments: res });
      else if (path === "popular") this.setState({ popularDocuments: res });
    });
  };

  getList = (path) => {
    const { latestDocuments, featuredDocuments, popularDocuments } = this.state;
    return path === "latest" ? latestDocuments : path === "featured" ? featuredDocuments : popularDocuments;
  };

  handleUploadBtn = () => {
    document.getElementById("uploadBtn").click();
  };

  componentWillMount() {
    this.getDocuments("latest");
    this.getDocuments("featured");
    this.getDocuments("popular");
  }

  render() {

    const subject = [
      "Realization of Value via Sharing",
      "Content Free",
      "Grow Your Audience"
    ];

    const content = [
      "Polaris Share values ​​the content you share.\nShare your content and get a transparent monetary reward.\n Join now as a creator ",
      "Meet advanced content produced by creator. \n Just vote for your favorite document and you'll be rewarded.\n Sign up now ",
      "Upload your slides and share them on high-quality channels.\n Track lead activity and collect contacts.\n"
    ];

    const category = [
      "latest", "featured", "popular"
    ];

    return (
      <div className="row">
        <div className="main-banner" id="mainBanner">
          <Carousel
            useKeyboardArrows={false}
            autoPlay={false}
            showThumbs={false}
            howThumbs={false}
            showStatus={false}
            swipeable
            interval={5000}
          >
            {subject.map((arr, idx) => (
              <div className="main-banner-text" key={idx}>
                <div className="main-banner-subject d-inline-block">{arr}</div>
                <div className="main-banner-content mb-4">
                  {content[idx].split("\n").map((line, idx) => (
                    <span key={idx}>{line}<br/></span>)
                  )}
                </div>
                <div className="main-upload-btn mr-2 ml-2 mb-3" onClick={() => this.handleUploadBtn()}>Upload now</div>
                <Link to="/faq">
                  <div className="main-learn-more-btn ml-2 mr-2">Learn more</div>
                </Link>
                <img src={require("assets/image/banner/img-banner-0" + (idx + 1) + ".png")} alt=""/>
              </div>
            ))}
          </Carousel>

        </div>

        <div className="main-banner-dummy"/>

        <div className="col-12 u__center-container">
          <div className="u__center">
            {category.map((arr, idx) => (
              <div className="main-category" key={idx}>

                <div className="mb-3">
                  <span className="main-category-name">{arr}</span>
                  <Link to={"/" + arr}>
                    <span className="main-category-see-all">See All
                      <i className="material-icons">keyboard_arrow_right</i></span>
                  </Link>
                </div>

                <div className="row main-category-card-wrapper">
                  {this.getList(arr) && this.getList(arr).resultList.map((res, idx) => {
                    return (idx < 4 &&
                      <DocumentCardContainer key={idx} idx={idx} path={arr} documentData={res} totalViewCountInfo={this.getList(arr).totalViewCountInfo}/>
                    );
                  })}
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    );
  }
}

export default ContentMain;
