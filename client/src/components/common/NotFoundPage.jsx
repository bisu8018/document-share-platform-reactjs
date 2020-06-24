import React from "react";
import history from "apis/history/history";

class NotFoundPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      time: 5
    };
  }


  // 시간 5초 후 메인페이지 이동
  setTime = () => {
    this.setInterval = setInterval(() => {
      let t = this.state.time;
      this.setState({ time: t - 1 }, () => {
        if (this.state.time <= 0) {
          clearInterval(this.setInterval);
          history.push("/");
        }
      });
    }, 1000);
  };


  componentWillMount(): void {
    this.setTime();
  }


  render() {
    const { errMessage, location } = this.props;

    return (
      <div className="not-found-page-wrapper">
        <div className="no-data-icon container">
          <i className="material-icons">report</i>

          <br/>

          {errMessage || (location.state && location.state.errMessage) || "Not Found Page."}

          <br/>

          Go to main page after
          <span>{this.state.time}</span>
          seconds.
        </div>
      </div>
    );
  }
}

export default NotFoundPage;
