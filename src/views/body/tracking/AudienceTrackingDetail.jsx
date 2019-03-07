import React from "react";
import "react-tabs/style/react-tabs.css";
import { Link, withRouter } from "react-router-dom";
import MainRepository from "../../../redux/MainRepository";
import Common from "../../../common/Common";

class AudienceTrackingDetail extends React.Component {
  state = {
    resultList: []
  };

  handleClick = (e) => {
    const parentElement = e.currentTarget.parentElement;
    if (parentElement.children[0].classList.length > 1) {
      parentElement.children[0].classList.remove("on");
      parentElement.children[1].classList.remove("scroll-out");
      parentElement.children[1].classList.add("scroll-up");
    } else {
      parentElement.children[0].classList.add("on");
      parentElement.children[1].classList.remove("scroll-up");
      parentElement.children[1].classList.add("scroll-out");
    }
  };

  printDetail = () => {
    const { location } = this.props;
    let cid = location.state.cid;
    MainRepository.Document.getTrackingInfo(cid, location.state.document.documentId, (res) => {
      let resData = res;
      this.setState({ resultList: resData.resultList ? resData.resultList : [] });
      console.log(this.state.resultList);

    });
  };

  componentWillMount() {
    this.printDetail();
  }

  render() {
    const { location, history } = this.props;
    const rst = this.state.resultList;
    const data = location.state.document;
    return (

      <div className="row">
        <div className="col-sm-12 col-lg-10 offset-lg-1 u__center profile-center">

          <div className="back-btn" onClick={history.goBack}>
            <i className="material-icons">keyboard_backspace</i>
            Back to visitor list
          </div>

          <div className="  profile_top">
            <Link to={"/author/" + data.accountId}>
              <div className="thumb_image">
                <img src={require("assets/image/tempImg/profile.jpg")} alt="profile" className="img-fluid"/>
              </div>
              <div className="profile_info_name tac">
                <strong>
                  {data.nickname ? data.nickname + " (" + data.accountId + ")" : data.accountId}
                </strong>
              </div>
            </Link>
          </div>

          <div className="row tracking_inner">
            <div className="col-sm-12 col-md-12">
              <div className="tracking_top">
                <h3 className="u_title">Views</h3>
              </div>

              <div className="tracking_fulldown_list">
                {rst.map((result, idx) => (
                  <ul key={idx}>
                    <li>
                      <div className="tfl_title" onClick={this.handleClick}>
                        <i><img src={require("assets/image/common/i_faq.png")} alt="dropdown icon"/></i>
                        <strong> {Common.timestampToDate(result.viewTiemstamp)} </strong>
                      </div>
                      <div className="tfl_desc ">
                        <dl>
                          {result.viewTracking.map((_result, idx) => (
                            <dd>
                              <span className="time"> { Common.timestampToTime(_result.t) } </span>
                              <div className="text-uppercase">
                                { _result.ev }
                              </div>
                            </dd>
                          ))}
                        </dl>
                      </div>
                    </li>
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default withRouter(AudienceTrackingDetail);
