import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";

import MainRepository from "../../../redux/MainRepository";
import DocumentCardContainer from "../../../container/common/DocumentCardContainer";
import Common from "../../../config/common";
import { psString } from "../../../config/localization";

class ContentMain extends Component {
  state = {
    latestDocuments: null,
    featuredDocuments: null,
    popularDocuments: null,
    latestListMany: 4
  };


// 문서 목록 GET
  getDocuments = (path) => {
    const params = {
      path: path
    };

    MainRepository.Document.getDocumentList(params, (res) => {
      if (path === "latest") this.setState({ latestDocuments: res });
      else if (path === "featured") this.setState({ featuredDocuments: res });
      else if (path === "popular") this.setState({ popularDocuments: res });
    }, err => {
      console.error(err);
      this.setTimeout = setTimeout(() => {
        this.getDocuments(path);
      },8000);
    });
  };


  // 사이트 path 체크
  getList = (path) => {
    const { latestDocuments, featuredDocuments, popularDocuments } = this.state;
    return path === "latest" ? latestDocuments : path === "featured" ? featuredDocuments : popularDocuments;
  };


  // 로그인
  handleLogin = () => {
    MainRepository.Account.login();
  };


  // 업로드 버튼
  handleUploadBtn = () => {
    document.getElementById("uploadBtn").click();
  };


  // see more 트리거 버튼
  handelTrigger = (arr) => {
    document.getElementById(arr + "NavLink").click();
  };


  // 스크롤 이벤트 리스너
  handleResize = (e) => {
    let countCards = (window.innerWidth > 1293 || window.innerWidth < 993) ? 4 : 6;
    this.setState({latestListMany : countCards});
  };


  componentDidMount(): void {
    window.addEventListener("resize", this.handleResize);
  }


  componentWillMount() {
    this.getDocuments("latest");
    this.getDocuments("featured");
    this.getDocuments("popular");
    this.handleResize();
  }


  componentWillUnmount() {
    window.removeEventListener("resize", () => {
    });
  }


  render() {
    const { getIsMobile } = this.props;
    const { latestListMany } = this.state;

    //배너 제목
    const subject = [
      psString("main-banner-subj-1"),
      psString("main-banner-subj-2"),
      psString("main-banner-subj-3")
    ];

    //배너 버튼 텍스트
    const buttonText = [
      psString("Join Now"),
      psString("Sign up"),
      psString("Upload now")
    ];

    // 배너 내용
    const content = [
      psString("main-banner-explain-1"),
      psString("main-banner-explain-2"),
      psString("main-banner-explain-3")
    ];


    // path 카테고리
    const category = [
      psString("latest"), psString("featured"), psString("popular")
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
            swipeable={!!getIsMobile}
            interval={5000}
          >
            {subject.map((arr, idx) => (
              <div className="main-banner-text" key={idx}>

                <div className="main-banner-wrapper">
                  <div>
                    <div className="main-banner-subject d-inline-block">{arr}</div>
                    <div className="main-banner-content mb-4">
                      {content[idx].split("\n").map((line, idx) => (
                        <div key={idx}>{line}</div>)
                      )}
                    </div>
                    {idx === 3 ?
                      <div className="main-upload-btn mr-2 ml-2 mb-3"
                           onClick={() => this.handleUploadBtn()}>{buttonText[3]}</div> :
                      <div className="main-upload-btn mr-2 ml-2 mb-3"
                           onClick={() => this.handleLogin()}>{buttonText[idx]}</div>
                    }
                    <Link to="/faq">
                      <div className="main-learn-more-btn ml-2 mr-2" onClick={() => Common.scrollTop()}>{psString("Learn more")}</div>
                    </Link>
                  </div>
                </div>

                <div className={"main-banner-img-wrapper main-banner-img" + (idx + 1)}/>

                <img src="" data-src={require("assets/image/banner/img-banner-0" + (idx + 1) + ".png")} alt=""/>
              </div>
            ))}
          </Carousel>

        </div>

        <div className="main-banner-dummy"/>

        <div className="col-12 content-main-container">
          <div className="u__center">
            {category.map((arr, idx) => (
              <div className="main-category" key={idx}>

                <div className="mb-3">
                  <span className="main-category-name">{arr}</span>
                  <span className="main-category-see-all" onClick={() => this.handelTrigger(arr)}>{psString("See All")}
                      <i className="material-icons">keyboard_arrow_right</i></span>

                </div>

                <div className="row main-category-card-wrapper">
                  {this.getList(arr) && this.getList(arr).resultList.map((res, idx) => {
                    return (idx < latestListMany &&
                      <DocumentCardContainer key={idx} idx={idx} path={arr} documentData={res} countCards={latestListMany}
                                             totalViewCountInfo={this.getList(arr).totalViewCountInfo}/>
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
