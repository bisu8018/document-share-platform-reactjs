import React from "react";
import { Carousel } from "react-responsive-carousel";
import TrackingApis from "apis/TrackingApis";
import Common from "../../../../util/Common";
import MainRepository from "../../../../redux/MainRepository";
import EmailModalContainer from "../../../../container/modal/EmailModalContainer";
import UserInfo from "../../../../redux/model/UserInfo";

class ContentViewCarousel extends React.Component {

  state = {
    dataKey: null,
    totalPages: 0,
    readPage: null,
    autoSlideFlag: false,
    slideOptionFlag: false,
    audienceEmail: null,
    emailFlag: false,
    emailFlagTemp: false
  };


// 로그인 시, cid ~ email 싱크 작업
  postTrackingConfirm = (pageNum) => {
    const { target, getMyInfo } = this.props;
    const trackingInfo = TrackingApis.setTrackingInfo();

    let data = {
      "cid": trackingInfo.cid,
      "sid": trackingInfo.sid,
      "email": getMyInfo.email,
      "documentId": target.documentId
    };

    MainRepository.Tracking.postTrackingConfirm(data).then(() => {
      this.handleTracking(pageNum);
    });
  };


  handleUrl = () => {
    const { readPage } = this.state;
    const { documentText, getPageNum } = this.props;

    let pageNum = window.location.pathname.split("/");
    let url = window.location.origin + "/" + pageNum[1] + "/" + pageNum[2] + "/";
    let _readPage = readPage + 1;

    let _documentText = "";
    if (documentText && documentText.length > 0) _documentText = documentText[readPage].substr(0, 10).trim().replace(/([^A-Za-z0-9 ])+/g, "").replace(/([ ])+/g, "-");
    if (_documentText.length > 0) _documentText = "-" + _documentText;

    if (pageNum !== _readPage) {
      window.history.replaceState({}, _readPage + _documentText, url + (_readPage === 1 ? "" : _readPage + _documentText));
      getPageNum(_readPage);  //Parent 인 ContentView 로 pageNum 전달, page 에 따른 문서 설명 전환 용. redux 로 대체 가능
    }
  };


  // 이메일 강제 입력 on/off
  handleForceTracking = () => {
    const { target } = this.props;
    if (!target.forceTracking) this.setState({ emailFlagTemp: true });
  };


  // 이메일 플래그 관리
  handleFlag = async (page) => {
    const { handleEmailFlag, getMyInfo } = this.props;
    const { emailFlagTemp } = this.state;

    return new Promise((resolve, reject) => {
      this.setState({ emailFlag: false }, () => {
        handleEmailFlag(false);

        // email 입력 모달 on/off 함수
        if (page > 0 && !getMyInfo.email && !emailFlagTemp) {
          this.setState({ emailFlag: true }, () => {
            handleEmailFlag(true);
            resolve(false);
          });
        } else {
          resolve(true);
        }
      });
    });
  };


  // 문서 옵션 useTracking true 일때만
  handleTracking = async (page) => {
    const { target, handleEmailFlag, getMyInfo, setMyInfo } = this.props;
    const { emailFlagTemp, readPage, emailFlag } = this.state;

    if ((page === null || page === undefined) && target.forceTracking) {
      return this.setState({ emailFlag: false }, () => {
        handleEmailFlag(false);
      });
    }
    if (page === readPage) return;

    this.setState({ readPage: page }, () => {
      this.handleUrl();
    });

    // 트래킹 사용
    if (target.useTracking) {

      // 강제 트래킹
      if (target.forceTracking) {
        let ft = await this.handleFlag(page);
        if (!ft) return false;
      } else if (!target.forceTracking && page > 0 && !getMyInfo.email && !emailFlagTemp) {
        this.setState({ emailFlag: true }, () => {
          handleEmailFlag(true);
        });
      }

      await TrackingApis.tracking({
        id: target.documentId,
        n: page + 1,
        ev: "view"
      }, true).then(res => {
        // 비로그인 상태에서 email로 로그인 시, 트래킹 위한 redux 저장
        if (res.user) {
          if (getMyInfo.email === "") {
            let userInfo = new UserInfo();
            userInfo.email = res.user.e;
            setMyInfo(userInfo);
          }
          if (emailFlag) this.setState({ emailFlag: false });
        }
      });
    } else {
      // 오직 뷰 카운트만을 위한 트랙킹 기능
      TrackingApis.tracking({
        id: target.documentId,
        n: page + 1,
        ev: "none"
      }, true);
    }
  };


  // 떠남 상태 관리
  handleTrackingLeave = () => {
    const { target } = this.props;
    const { readPage } = this.state;

    if (!readPage) return false;
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
  };


  // 슬라이드 옵션 창 on/off
  handleOptionBarClickEvent = () => {
    this.setState({ slideOptionFlag: !this.state.slideOptionFlag });
  };


  // 자동 슬라이드 설정 on/off
  handleOptionBtnClickEvent = () => {
    this.setState({ autoSlideFlag: !this.state.autoSlideFlag });
  };


  componentWillMount() {
    let pageNum = window.location.pathname.split("/")[3];
    pageNum = pageNum && pageNum > "1" ? Number(pageNum.split("-")[0]) - 1 : 0;

    if (MainRepository.Account.isAuthenticated()) this.postTrackingConfirm(pageNum);
    else this.handleTracking(pageNum);
  }


  componentWillUnmount() {
    this.handleTrackingLeave();
  }


  render() {
    const { target, documentText } = this.props;
    const { emailFlag } = this.state;

    const arr = [target.totalPages];
    for (let i = 0; i < target.totalPages; i++) {
      arr[i] = Common.getThumbnail(target.documentId, 1024, i + 1);
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
            onChange={index => this.handleTracking(index)}
          >
            {arr.length > 0 ? arr.map((addr, idx) => (
              <img key={idx} title={target.title} src={addr} alt={documentText[idx]} data-small="" data-normal=""
                   data-full=""
                   className={"landscape-show " + (target.forceTracking && emailFlag && !MainRepository.Account.isAuthenticated() ? "img-cloudy" : "")}/>
            )) : "no data"}
          </Carousel>
        </div>


        <div className="landscape-warning-message">
          This viewer is only viewable in landscape mode.
        </div>

        {!MainRepository.Account.isAuthenticated() && emailFlag && target.useTracking &&
        <EmailModalContainer handleTracking={() => this.handleTracking()}
                             forceTracking={() => this.handleForceTracking()} documentId={target.documentId}/>
        }
      </div>
    );
  }
}

export default ContentViewCarousel;
