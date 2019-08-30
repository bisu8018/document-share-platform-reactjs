import React from "react";
import { psString } from "../../../config/localization";
import { Wordpress } from "better-react-spinkit";
import common_view from "../../../common/common_view";
import TrackingApis from "../../../apis/TrackingApis";


class AwayModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      time: 10,
      mode: false
    };
  }

  // Tracking API POST
  postTracking = () =>
    TrackingApis.tracking({
      id: this.props.documentData.documentId,
      n: common_view.getPageNum(),
      ev: "away"
    }, true).then(res => res);


  // 시간 10초 후 로그아웃
  setTime = () => {
    this.setInterval = setInterval(() => {
      let t = this.state.time;
      this.setState({ time: t - 1 }, () => {
        if (this.state.time <= 0) {
          this.postTracking();
          this.setState({ mode: true });
          clearInterval(this.setInterval);
        }
      });
    }, 1000);
  };


  componentWillMount(): void {
    common_view.setBodyStyleLock();
    this.setTime();
  }


  componentWillUnmount(): void {
    common_view.setBodyStyleUnlock();
  }


  render() {

    return (
      <div>
        {!this.state.mode ?
          <div className="custom-modal-container">
            <div className="custom-modal-wrapper"/>
            <div className="custom-modal">
              <div className="custom-modal-title">
                <h3>{psString("away-modal-title")}</h3>
              </div>


              <div className="custom-modal-content away-modal-desc">
                {psString("away-modal-desc-1")}
                <span>{this.state.time}</span>
                {psString("away-modal-desc-2")}
              </div>
            </div>
          </div>
          :
          <div className="away-modal-on">
            <div className="away-modal-on-wrapper"/>
            <div className="away-modal-on-container">
              <p>{psString("away-modal-away-mode")}</p>
              <Wordpress size={30} color={"#3681fe"}/>
              <p>N</p>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default AwayModal;
