import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import TrackingApis from "apis/TrackingApis";
import Common from "../../../../util/Common";
import MainRepository from "../../../../redux/MainRepository";
import EmailModal from "../../../modal/EmailModal";

class ContentViewCarousel extends React.Component {

  state = {
    dataKey: null,
    totalPages: 0,
    readPage: null,
    autoSlideFlag: false,
    slideOptionFlag: false,
    audienceEmail: null,
    emailFlag: false,
    emailFlagTemp: false,
  };

  handleUrl = () => {
    const { readPage } = this.state;
    const { documentText, getPageNum } = this.props;

    let pageNum = window.location.pathname.split("/");
    let url = window.location.origin + "/" + pageNum[1] + "/" + pageNum[2] + "/";
    let _readPage = readPage + 1;

    let _documentText= "";
    if(documentText && documentText.length > 0) _documentText= documentText[readPage].substr(0, 10).trim().replace(/([^A-Za-z0-9 ])+/g, "").replace(/([ ])+/g, "-");
    if(_documentText.length >0) _documentText= "-" + _documentText;

    if (pageNum !== _readPage) {
      window.history.replaceState({}, _readPage + _documentText , url + (_readPage === 1 ? "" : _readPage + _documentText));
      getPageNum(_readPage);  //Parent 인 ContentView 로 pageNum 전달, page 에 따른 문서 설명 전환 용. redux 로 대체 가능
    }
  };

  // 이메일 강제 입력 on/off
  handleForceTracking = () => {
    const { target } = this.props;
    if(!target.forceTracking)  this.setState({emailFlagTemp : true});
  };

  // 문서 옵션 useTracking true 일때만
  handleTracking = (page) => {
    const { target } = this.props;
    const { emailFlagTemp, readPage } = this.state;

    if (page === readPage) return;

    this.setState({ readPage: page }, () => {
      this.handleUrl();
    });

    if (target.useTracking) {
      let emailFromAuth = this.props.getMyInfo.email;
      let emailFromSession = Common.getCookie("tracking_email");
      let temp = emailFromAuth || emailFromSession || null;

      if(target.forceTracking) this.setState({ emailFlag: false });

      this.setState({ audienceEmail: temp  }, () => {
        TrackingApis.tracking({
          id: target.documentId,
          n: page + 1,
          e: this.state.audienceEmail,
          ev: "view"
        }, true);

        // email 입력 모달 on/off 함수
        if (page > 0 && !this.state.audienceEmail && !emailFlagTemp) {
          this.setState({ emailFlag: true });
          return false;
        }
      });
    }
  };

  // 슬라이드 옵션 창 on/off
  handleOptionBarClickEvent = (e) => {
    this.setState({ slideOptionFlag: !this.state.slideOptionFlag });
  };

  // 자동 슬라이드 설정 on/off
  handleOptionBtnClickEvent = (e) => {
    this.setState({ autoSlideFlag: !this.state.autoSlideFlag });
  };

  componentWillMount() {
    const { tracking } = this.props;
    let pageNum = window.location.pathname.split("/")[3];
    if (tracking) this.handleTracking(pageNum && pageNum !== "0" ? Number(pageNum.substr(0,1)) - 1 : 0);
  }

  componentWillUnmount() {
    const { target } = this.props;
    let documentId = target.documentId;
    try {
      TrackingApis.tracking({
        id: documentId,
        n: -1,
        ev: "leave"
      }, false, true);
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const { target, documentText } = this.props;
    const { emailFlag } = this.state;

    const arr = [target.totalPages];
    for (let i = 0; i < target.totalPages; i++) {
      arr[i] = Common.getThumbnail(target.documentId, 1024,i + 1);
    }

    return (
      <div className="card card-raised">
        <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel" data-interval="3000">
          <div className="screen-option-bar">
            <i className="material-icons" onClick={this.handleOptionBarClickEvent.bind(this)}
               title="Slide option button">more_vert</i>
            <div className={"screen-option" + (this.state.slideOptionFlag ? "" : " d-none")}>
              <div title={this.state.autoSlideFlag ? "Switch to Manual Slide Mode" : "Switch to Auto Slide Mode"}
                   onClick={this.handleOptionBtnClickEvent.bind(this)}>
                {this.state.autoSlideFlag ? "Auto Mode" : "Manual Mode"}
              </div>
            </div>
          </div>
          <Carousel
            showThumbs={false}
            showStatus={false}
            showIndicators={false}
            autoPlay={this.state.autoSlideFlag}
            interval={5000}
            swipeable
            selectedItem={this.state.readPage || 0}
            useKeyboardArrows={true}
            onChange={this.handleTracking.bind(this.index)}
          >
            {arr.length > 0 ? arr.map((addr, idx) => (
              <img key={idx} title={target.title} src={addr} alt={documentText[idx]} data-small="" data-normal=""
                   data-full="" className={"landscape-show " + (target.forceTracking && emailFlag? "img-cloudy" : "")}/>
            )) : "no data"}
          </Carousel>
        </div>


        <div className="landscape-warning-message">
          This viewer is only viewable in landscape mode.
        </div>

        {!MainRepository.Account.isAuthenticated() && emailFlag && target.useTracking &&
        <EmailModal handleTracking={() => this.handleTracking()} forceTracking={() => this.handleForceTracking()}/>
        }
      </div>
    );
  }
}

export default ContentViewCarousel;
