import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import { psString } from "../../../../config/localization";
import common_view from "../../../../common/common_view";


//배너 제목
const subject = [
  psString("main-banner-subj-1"),
  psString("main-banner-subj-2"),
  psString("main-banner-subj-3")
];

//배너 버튼 텍스트
const buttonText = [
  psString("main-banner-btn-1"),
  psString("main-banner-btn-2"),
  psString("main-banner-btn-3")
];

// 배너 내용
const content = [
  psString("main-banner-explain-1"),
  psString("main-banner-explain-2"),
  psString("main-banner-explain-3")
];


class ContentMainBanner extends Component {


  render() {
    const { getIsMobile } = this.props;

    return (
      <div className='w-100'>
        <div className="main-banner" id="mainBanner">
          <div/>
          <Carousel
            useKeyboardArrows={false}
            autoPlay={false}
            showThumbs={false}
            howThumbs={false}
            showStatus={false}
            swipeable={!getIsMobile}
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
                    {idx !== 2 ?
                      (idx === 1 ?
                          <div className="main-upload-btn mr-2 ml-2 mb-3"
                               onClick={() => this.handleLogin()}>{buttonText[idx]}</div>
                          :
                          <div className="main-upload-btn mr-2 ml-2 mb-3" id="mainUploadBtnSearch"
                               onClick={() => this.handleTagClick()}>{buttonText[idx]}</div>
                      )
                      :
                      <Link to='/ca' rel="nofollow">
                        <div className="main-upload-btn mr-2 ml-2 mb-3">{buttonText[idx]}</div>
                      </Link>
                    }
                    <Link to="/f" rel="nofollow">
                      <div className="main-learn-more-btn ml-2 mr-2"
                           onClick={() => common_view.scrollTop()}>{psString("main-banner-btn-4")}</div>
                    </Link>
                  </div>
                </div>

                <div className={"main-banner-img-wrapper main-banner-img" + (idx + 1)}/>
              </div>
            ))}
          </Carousel>

        </div>

        <div className="main-banner-dummy"/>
      </div>
    );
  }
}

export default ContentMainBanner;
