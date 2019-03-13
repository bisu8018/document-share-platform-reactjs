import React from "react";
import "react-tabs/style/react-tabs.css";
import { Link, withRouter } from "react-router-dom";
import LinesEllipsis from "react-lines-ellipsis";

import MainRepository from "../../../redux/MainRepository";
import Common from "../../../common/Common";
import Tooltip from "@material-ui/core/Tooltip";

class AudienceTrackingDetail extends React.Component {
  state = {
    resultList: [],
    textList: []
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
      this.getText();
    });
  };

  getImgUrl = (page) => {
    const { location } = this.props;
    return Common.getThumbnail(location.state.document.documentId, page);
  };

  getText = () => {
    const { location } = this.props;
    let page = location.state.document.totalPages;
    let arr = [];
    for (let i = 0; i < page; i++) {
      Common.getText(location.state.document.documentId, i + 1, (result) => {
        arr[i] = result;
        if (i === page - 1) {
          this.setState({ textList: arr });
        }
      }, (err) => {
        this.setState({ textList: null });
      });
    }
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
        <div className="col-sm-12 col-lg-10 offset-lg-1 u__center profile-center tracking-detail-container">

          <div className="back-btn " onClick={history.goBack}>
            <i className="material-icons ml-2">keyboard_backspace</i>
            Back to visitor list
          </div>

          <div className="profile_top">
            <Link to={"/author/" + data.accountId}>
              <div className="thumb_image">
                <img src={require("assets/image/tempImg/profile.jpg")} alt="profile" className="img-fluid"/>
              </div>
              <div className="profile_info_name">
                {data.nickname ? data.nickname : data.accountId} <br/>
                {data.nickname ? "(" + data.accountId + ")" : ""}
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
                        <strong
                          title={Common.timestampToDate(result.viewTimestamp)}> {Common.timestampToDate(result.viewTimestamp)} </strong>
                      </div>
                      <div className="tfl_desc ">
                        <dl>
                          {result.viewTracking.sort((a, b) => a.t - b.t).map((_result, idx) => (
                            <dd key={idx}>
                              <div className="d-flex">
                                <span className="time"
                                      title={Common.timestampToTime(_result.t)}> {Common.timestampToTime(_result.t)} </span>
                                <div className="d-inline-block mr-3">
                                  <span className="tracking-status">{_result.ev}</span>
                                </div>
                                {_result.ev !== "leave" &&

                                <div className="d-inline-block mr-3">
                                  <Tooltip
                                    title={
                                      <img src={this.getImgUrl(_result.n)} alt="thumbnail" className="w-100"/>
                                    }
                                    disableFocusListener
                                    disableTouchListener
                                    className="tooltip-style"
                                    placement="bottom">
                                    <span className="info-btn">i</span>
                                  </Tooltip>
                                </div>
                                }
                                {_result.ev !== "leave" &&
                                <div className="d-flex">
                                  {this.state.textList &&
                                  <LinesEllipsis
                                    text={this.state.textList[_result.n - 1]}
                                    maxLine='1'
                                    ellipsis="..."
                                    trimRight
                                    basedOn='letters'
                                    className=""
                                  />
                                  }
                                {/*  <Link to={"/content/view/" + data.documentId} title="link to document">
                                    <i className="material-icons link-arrow-btn">call_made</i>
                                  </Link>*/}

                                </div>
                                }
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
