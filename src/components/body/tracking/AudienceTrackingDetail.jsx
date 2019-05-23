import React from "react";
import { Link, withRouter } from "react-router-dom";
import LinesEllipsis from "react-lines-ellipsis";

import MainRepository from "../../../redux/MainRepository";
import Common from "../../../util/Common";
import Tooltip from "@material-ui/core/Tooltip";
import { ThreeBounce } from 'better-react-spinkit';

class AudienceTrackingDetail extends React.Component {
  state = {
    resultList: [],
    textList: [],
    loading: false,
    error: null,
    eventId: null
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

  getTrackingInfo = () => {
    const { location, getIncludeOnlyOnePage, getShowAnonymous } = this.props;
    let cid = location.state.cid;
    this.setState({ loading: true });

    const params = {
      cid : cid,
      documentId : location.state.document.documentId,
      include : getIncludeOnlyOnePage,
      anonymous : getShowAnonymous
    };

    MainRepository.Tracking.getTrackingInfo(params, (res) => {
      let resData = res;
      this.setState({ loading: false });
      this.setState({ resultList: resData.resultList ? resData.resultList : [] });
    });
  };

  getImgUrl = (page) => {
    const { location } = this.props;
    return Common.getThumbnail(location.state.document.documentId, 320, page);
  };

  getSortedTime = (result) => {
    result.viewTracking.sort((a, b) => a.t - b.t);
    return Common.timestampToTime(result.viewTracking[0].t) + " ~ " + Common.timestampToTime(result.viewTracking[result.viewTracking.length-1].t)

  };

  componentWillMount() {
    this.getTrackingInfo();
  }

  render() {
    const { history, match, location } = this.props;
    const { loading, resultList } = this.state;

    const documentText = location.state.documentText;
    let email = location.state.email;
    let time = Common.timestampToDate(Number(location.state.time));

    return (

      <div className="row">
        <div className="col-sm-12 col-lg-10 offset-lg-1 u__center profile-center tracking-detail-container">

          <div className="back-btn " onClick={history.goBack}>
            <i className="material-icons ml-2">keyboard_backspace</i>
            Back to visitor list
          </div>

          <div className="row tracking_inner">
            <div className="col-sm-12 col-md-12 tracking_top">
              <div className="u_title h3 d-inline-block mr-5">
                <span className="mr-3">{email}</span>
                <span className="tracking-time d-block d-sm-inline-block">{time}</span>
              </div>

              <div className="tracking_fulldown_list">
                {resultList.length > 0 && resultList.map((result, idx) => (
                  <ul key={idx}>
                    <li>
                      <div className="tfl_title" onClick={this.handleClick}>
                        <i><img src={require("assets/image/common/i_faq.png")} alt="dropdown icon"/></i>
                        <strong title="">
                          {this.getSortedTime(result)}
                        </strong>
                      </div>
                      <div className="tfl_desc ">
                        <dl>
                          {result.viewTracking.sort((a, b) => a.t - b.t).map((_result, idx) => (
                            <dd key={idx}>
                              <div className="d-flex">
                                <span className="time"
                                      title={Common.timestampToTime(_result.t)}> {Common.timestampToTime(_result.t)} </span>

                                {_result.ev === "leave" &&
                                <div className="d-inline-block mr-3">
                                  <span
                                    className="tracking-status">{_result.ev}</span>
                                </div>
                                }
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
                                    <span className="info-btn"> {_result.n}</span>
                                  </Tooltip>
                                </div>
                                }

                                {_result.ev !== "leave" &&
                                <div className="d-flex w-100">
                                  {documentText &&
                                  <LinesEllipsis
                                    text={documentText[_result.n - 1]}
                                    maxLine='1'
                                    ellipsis="..."
                                    trimRight
                                    basedOn='letters'
                                    className="d-none d-sm-block w-100"
                                  />
                                  }
                                  <Link
                                    to={"/" + match.params.identification + "/" + match.params.seoTitle + "/" + _result.n}
                                    title={"link to " + _result.n + " page" }>
                                    <i className="material-icons link-arrow-btn">reply</i>
                                  </Link>
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

                {loading && <div className="spinner"><ThreeBounce name="ball-pulse-sync"/></div>}

              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default withRouter(AudienceTrackingDetail);
