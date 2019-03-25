import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import TrackingApis from "apis/TrackingApis";
import Common from "../../../../common/Common";
import MainRepository from "../../../../redux/MainRepository";
import EmailModal from "../../../../components/modal/EmailModal";

class ContentViewCarousel extends React.Component {

  state = {
    isFull: false,
    dataKey: null,
    totalPages: 0,
    readPage: null,
    autoSlideFlag: false,
    slideOptionFlag: false,
    audienceEmail: null,
    emailFlag: false
  };

  handleTracking = (page) => {
    const { target } = this.props;

    // 문서 옵션 useTracking 일때만
    if(target.useTracking){
      let emailFromAuth = MainRepository.Account.getEmail();
      let emailFromSession = sessionStorage.getItem("tracking_email");

      if (emailFromAuth) this.setState({ audienceEmail: emailFromAuth });
      else if (emailFromSession) this.setState({ audienceEmail: emailFromSession });

      if (page > 0 && !this.state.audienceEmail) {       // email 입력 모달 출력 함수
        this.setState({ emailFlag: true });
        return false;
      }
    }

    if (page === this.state.readPage) return;
    this.setState({ readPage: page });

    TrackingApis.tracking({
      id: target.documentId,
      n: page + 1,
      e: this.state.audienceEmail,
      ev: "view"
    }, true);
  };

  handleOptionBarClickEvent = (e) => {
    this.setState({ slideOptionFlag: !this.state.slideOptionFlag });
  };

  handleOptionBtnClickEvent = (e) => {
    this.setState({ autoSlideFlag: !this.state.autoSlideFlag });
  };

  componentWillMount() {
    const { tracking } = this.props;
    if (tracking) this.handleTracking(0);
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
    const { target } = this.props;
    const { emailFlag } = this.state;

    const arr = [target.totalPages];
    for (let i = 0; i < target.totalPages; i++) {
      arr[i] = Common.getPageView(target.documentId, i + 1);
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
            {arr.length > 0 ? arr.map((addr, index) => (
              <img key={index} src={addr} alt={"carousel"} className="landscape-show"/>
            )) : "no data"}
          </Carousel>
        </div>


        <div className="landscape-warning-message">
          This viewer is only viewable in landscape mode.
        </div>

        {emailFlag && target.useTracking &&
        <EmailModal handleTracking={() => this.handleTracking()}/>
        }
      </div>
    );
  }
}

export default ContentViewCarousel;
