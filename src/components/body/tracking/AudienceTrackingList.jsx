import React from "react";
import { Link } from "react-router-dom";

import Common from "../../../config/common";
import MainRepository from "../../../redux/MainRepository";
import { ThreeBounce } from "better-react-spinkit";
import Tooltip from "@material-ui/core/Tooltip";
import CustomChart from "../../common/CustomChart";
import AutoSuggestInputContainer from "../../../container/common/AutoSuggestInputContainer";
import PayoutCard from "../../common/card/PayoutCard";
import { psString } from "../../../config/localization";

class AudienceTrackingList extends React.Component {
  state = {
    resultList: [],
    chartResultList: null,
    filterList: null,
    selectedSearch: null,
    loading: false,
    chartLoading: false,
    tableOptionFlag: false,
    includeFlag: true,
    ratio: null,
    selectedTr: null    // 차트 show / hide
  };


  // 검색 박스 관리
  selectedSearch = (value) => {
    let result = this.state.resultList;


    let filteredResult = result.filter(el => {
      if (value.user) {

        if (el.user) return el.user.e.indexOf(value.user.e) !== -1;
        return false;

      } else return !el.user;
    });


    this.setState({ filterList: filteredResult, selectedSearch: value.user ? value.user.e : null });
  };


  // 잘못된 접근, 404 페이지 이동
  wrongAccess = () => {
    const { setAlertCode } = this.props;
    this.props.history.push({
      pathname: "/404",
      state: { errMessage: psString("tracking-list-err-1") }
    });
    setAlertCode(2002);
  };


  // 페이지별 머문 시간 계산 및 차트 데이터 SET
  setChartData = (res) => {
    let dataObj = {};

    for (let i = 0; i < res.length; ++i) {
      let vrArr = res[i].viewTracking;
      vrArr.sort((a, b) => {
        return a.t - b.t;
      });

      for (let j = 0; j < res[i].viewTrackingCount; ++j) {
        let tmpArr = vrArr;

        if (tmpArr[j].n !== -1 && tmpArr[j + 1]) {
          if (!dataObj[tmpArr[j].n]) dataObj[tmpArr[j].n] = 0;
          dataObj[tmpArr[j].n] += (tmpArr[j + 1].t - tmpArr[j].t);
        }
      }
    }

    this.setState({ chartLoading: false });
    this.setState({ chartResultList: dataObj });
  };


  // 트랙킹 리스트 GET
  getTrackingList = () => {
    const { location, getShowAnonymous, getIncludeOnlyOnePage } = this.props;
    let documentData = null;
    if (location.state && location.state.documentData) documentData = location.state.documentData;

    if (!documentData) this.wrongAccess();
    else {
      const params = {
        documentId: documentData.documentId,
        anonymous: getShowAnonymous ? "true" : "false",
        include: getIncludeOnlyOnePage ? "true" : "false"
      };

      this.setState({ loading: true, resultList: [] }, () => {
        MainRepository.Tracking.getTrackingList(params, (res) => {
          let resData = res;
          this.setState({ loading: false });
          this.setState({ resultList: resData.resultList ? resData.resultList : [] });
        }, err => {
          console.error(err);
          setTimeout(() => {
            this.getTrackingList();
          }, 8000);
        });
      });
    }
  };


  // 트랙킹 정보 GET
  getTrackingInfo = (cid) => {
    const { location, getIncludeOnlyOnePage, getShowAnonymous } = this.props;
    let documentData = null;

    if (location.state && location.state.documentData) documentData = location.state.documentData;

    if (documentData === null) this.wrongAccess();
    else {
      this.setState({ chartLoading: true });

      const params = {
        cid: cid,
        documentId: documentData.documentId,
        include: getIncludeOnlyOnePage,
        anonymous: getShowAnonymous
      };

      MainRepository.Tracking.getTrackingInfo(params, (res) => {
        this.setChartData(res.resultList);   // 페이지 별 머문 시간 계산
      }, err => {
        console.error(err);
        setTimeout(() => {
          this.getTrackingInfo();
        }, 8000);
      });
    }
  };


  // 리워드 정보 표시
  showRewardInfo = (id) => {
    if (document.getElementById(id)) document.getElementById(id).style.display = "block";
  };


  // 리워드 정보 숨김
  hideRewardInfo = (id) => {
    if (document.getElementById(id)) document.getElementById(id).style.display = "none";
  };


  // 이미지 정보 GET
  getImgInfo = () => {
    const { location } = this.props;
    let documentData = null;
    if (location.state && location.state.documentData) documentData = location.state.documentData;
    if (documentData === null) this.wrongAccess();
    else {
      let imgUrl = Common.getThumbnail(documentData.documentId, 320, 1, documentData.documentName);
      let img = new Image();

      img.src = imgUrl;
      img.onload = () => {
        let height = img.height;
        let width = img.width;
        this.setState({ ratio: (width / height) });
      };
    }
  };


  // 검색 초기화
  handleClearSearch = () => {
    this.setState({ filterList: null, selectedSearch: null });
  };


  // 스크롤 아웃 관리 메소드
  handleClick = (e) => {
    const { selectedTr } = this.state;
    e.stopPropagation();    // 버블링 방지

    let idx, cid;
    let target = e.target.parentElement;

    if (target.dataset.idx) {
      idx = target.dataset.idx;
      cid = target.dataset.cid;
    } else {
      idx = target.parentElement.dataset.idx;
      cid = target.parentElement.dataset.cid;
    }

    if (selectedTr !== idx) {
      this.setState({ selectedTr: idx }, () => {
        this.getTrackingInfo(cid);
      });
    } else {
      this.setState({ selectedTr: null });
    }
  };


  // 파일 export
  handleExport = () => {
    const { location } = this.props;
    const documentData = location.state.documentData;
    MainRepository.Tracking.getTrackingExport(documentData.documentId, rst => {
      const a = document.createElement("a");
      a.style.display = "none";
      document.body.appendChild(a);

      a.href = rst.downloadUrl;

      a.setAttribute("download", "tracking_" + documentData.seoTitle + ".xls");
      a.click();

      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    });
  };


  // 옵션 버튼 관리
  handleOptionButtonClickEvent = () => {
    this.setState({ tableOptionFlag: !this.state.tableOptionFlag });
  };


  // 옵션 버튼 숨김
  handleHideOption = () => {
    const { setShowAnonymous, getShowAnonymous } = this.props;
    setShowAnonymous(!getShowAnonymous, () => {
      this.getTrackingList();
    });
  };


  // 1 페이지 보기/숨김 옵션 관리
  handleOnePageOption = () => {
    const { setIncludeOnlyOnePage, getIncludeOnlyOnePage } = this.props;
    setIncludeOnlyOnePage(!getIncludeOnlyOnePage, () => {
      this.getTrackingList();
    });
  };


  // 특정 링크 클릭 이벤트 관리
  handleLinkClickEvent = (e) => {
    const { location, match, getShowAnonymous, getIncludeOnlyOnePage } = this.props;
    const documentData = location.state.documentData;
    const documentText = location.state.documentText;
    let _cid = e.target.parentElement.dataset.cid;
    let _email = e.target.parentElement.dataset.email;
    let _time = e.target.parentElement.dataset.time;

    this.props.history.push({
      pathname: "/trackingDetail/" + match.params.identification + "/" + match.params.seoTitle,
      state: {
        document: documentData,
        documentText: documentText,
        cid: _cid,
        email: _email,
        time: _time,
        anonymousFlag: getShowAnonymous,
        onePageFlag: getIncludeOnlyOnePage
      }
    });
  };


  componentWillMount() {
    this.getTrackingList();
    this.getImgInfo();
  }


  render() {
    const { location, match, getShowAnonymous, getIncludeOnlyOnePage, getCreatorDailyRewardPool, getIsMobile } = this.props;
    const { loading, tableOptionFlag, ratio, selectedTr, chartResultList, selectedSearch } = this.state;

    if (!location.state || !location.state.documentData) return false;

    const rst = !this.state.filterList ? this.state.resultList : this.state.filterList;
    const documentData = location.state.documentData;
    const totalViewCountInfo = location.state.totalViewCountInfo;
    let addr = Common.getThumbnail(documentData.documentId, 320, 1);
    let reward = Common.toEther(Common.getAuthorNDaysReward(documentData, getCreatorDailyRewardPool, totalViewCountInfo, 7));
    let vote = Common.toEther(documentData.latestVoteAmount);
    let view = documentData.latestPageview || 0;

    return (

      <div className="row">
        <div className="u__center w-100">
          <div className="row">


            <div className="col-12 col-sm-3 col-lg-2 col-thumb mt-2">
              <Link to={"/" + match.params.identification + "/" + documentData.seoTitle}>
                <div className="tab-thumbnail" onClick={() => Common.scrollTop()}>
                  <img src={addr}
                       alt={documentData.title ? documentData.title : documentData.documentName}
                       className={ratio >= 1.8 ? "main-category-card-img-landscape" : "main-category-card-img"}/>
                </div>
              </Link>
            </div>


            <div className="col-12 col-sm-9 col-lg-10 col-details_info p-sm-2 ">
              <dl className="details_info">
                <Link to={"/" + match.params.identification + "/" + documentData.seoTitle} className="info_title mb-2"
                      onClick={() => Common.scrollTop()}>
                  {documentData.title}
                </Link>


                <div className="option-menu-btn d-sm-inline-block d-none"
                     onClick={this.handleOptionButtonClickEvent.bind(this)}>
                  <i className="material-icons">more_vert</i>
                  <div className={"option-table" + (tableOptionFlag ? "" : " d-none")}>
                    <div
                      title={getShowAnonymous ? psString("tracking-list-option-hide") : psString("tracking-list-option-show")}
                      onClick={(e) => this.handleHideOption(e)}>
                      {getShowAnonymous ? psString("tracking-list-option-hide") : psString("tracking-list-option-show")}
                    </div>
                    <div
                      title={getIncludeOnlyOnePage ? psString("tracking-list-option-exclude") : psString("tracking-list-option-include")}
                      onClick={(e) => this.handleOnePageOption(e)}>
                      {getIncludeOnlyOnePage ? psString("tracking-list-option-exclude") : psString("tracking-list-option-include")}
                    </div>
                  </div>
                </div>


                <div className="col-view tracking-item mb-1  mt-1 position-relative">
                 <span className={"info-detail-reward mr-2 " + (documentData.isRegistry ? "" : "color-not-registered")}
                       onMouseOver={() => this.showRewardInfo(documentData.seoTitle + "reward")}
                       onMouseOut={() => this.hideRewardInfo(documentData.seoTitle + "reward")}>
                    ${Common.deckToDollar(reward)}
                   <img className="reward-arrow"
                        src={require("assets/image/icon/i_arrow_down_" + (documentData.isRegistry ? "blue" : "grey") + ".svg")}
                        alt="arrow button"/>
                  </span>

                  {reward > 0 &&
                  <PayoutCard reward={reward} data={documentData}/>
                  }

                  <span className="info-detail-view mr-3">{view}</span>
                  <span className="info-detail-vote mr-4">{Common.deckStr(vote)}</span>
                  <span className="ml-4 info_date"> {Common.timestampToDate(documentData.created)}</span>
                </div>
                {location &&
                <Tooltip title="Export tracking data as Excel file." placement="bottom">
                  <div className="viewer-btn" onClick={() => this.handleExport()}>
                    <i className="material-icons">save</i>
                    {psString("tracking-list-export")}
                  </div>
                </Tooltip>
                }
              </dl>
            </div>
          </div>


          <div className="tracking_inner">
            <div className="col-sm-12 col-md-12 row tracking_top">
              <div className="pl-0 tracking-list-title d-none d-sm-inline-block col-5 col-md-7 col-lg-9 mb-3">
                {psString("tracking-list-visitors")}
              </div>

              <div className="option-menu-btn d-inline-block d-sm-none"
                   onClick={this.handleOptionButtonClickEvent.bind(this)}>
                <i className="material-icons">more_vert</i>
                <div className={"option-table" + (tableOptionFlag ? "" : " d-none")}>
                  <div
                    title={getShowAnonymous ? psString("tracking-list-option-hide") : psString("tracking-list-option-show")}
                    onClick={(e) => this.handleHideOption(e)}>
                    {getShowAnonymous ? psString("tracking-list-option-hide") : psString("tracking-list-option-show")}
                  </div>
                  <div
                    title={getIncludeOnlyOnePage ? psString("tracking-list-option-exclude") : psString("tracking-list-option-include")}
                    onClick={(e) => this.handleOnePageOption(e)}>
                    {getIncludeOnlyOnePage ? psString("tracking-list-option-exclude") : psString("tracking-list-option-include")}
                  </div>
                </div>
              </div>


              <div className=" p-0 col-8 col-md-5 col-lg-3">
                {!this.state.filterList ?
                  <div className="tags_menu_search_container row">
                    <AutoSuggestInputContainer search={this.selectedSearch} type={"name"}
                                               getNameList={this.state.resultList}/>
                    <div className="search-btn">
                      <i className="material-icons">search</i>
                    </div>
                  </div> :
                  <div className="tracking-list-search-selected-wrapper">
                    <div className="tracking-list-search-selected">
                      {selectedSearch || psString("tracking-list-anonymous")}
                    </div>
                    <i className="material-icons" onClick={() => {
                      this.handleClearSearch();
                    }}>close</i>
                  </div>
                }
              </div>


              <div className="tracking_table">

                <div className="tracking-table-tr row">
                  <div className="col-4 tracking-table-td">{psString("tracking-list-name")}</div>

                  <div className="col-3 col-sm-2 tracking-table-td tac">{psString("tracking-list-views")}</div>


                  <div className="col-3 tracking-table-td tar">{psString("tracking-list-last")}</div>


                  <div className="col-2 col-sm-3 tracking-table-td "/>


                </div>

                {rst.length > 0 && rst.map((result, idx) => (
                  <span key={idx}>
                    <div onClick={this.handleLinkClickEvent.bind(this)}
                         id={"trackingTableTr" + idx}
                         data-cid={result.cid}
                         data-email={result.user ? result.user.e : psString("tracking-list-anonymous")}
                         data-time={result.viewTimestamp}
                         className="row tracking-table-tr c-pointer">


                      <div className="col-4 tracking-table-td">
                        {result.user ? result.user.e : psString("tracking-list-anonymous")}
                      </div>


                      <div className="col-3 col-sm-2 tracking-table-td tac">
                        <Tooltip
                          title={psString("tracking-list-view-count") + (result.count > 1 ? psString("tracking-list-view-times") : "") + ": " + result.count}
                          placement="top">
                          <span>{result.count}</span>
                        </Tooltip>
                      </div>


                      <div className="col-3 tracking-table-td tar">
                        {Common.dateTimeAgo(result.viewTimestamp, getIsMobile)}
                      </div>


                      <div className="col-2 col-sm-3 tracking-table-td position-relative">
                        <div className="duration-wrapper d-none d-sm-block">
                          <Tooltip
                            title={Common.timestampToDuration(result.totalReadTimestamp)}
                            placement="top">
                            <div className={"duration " + (result.totalReadTimestamp === 0 ? "btn-disabled" : "")}>
                              {Common.timestampToTimeNotGmt(result.totalReadTimestamp)}
                            </div>
                          </Tooltip>

                          <Tooltip
                            title={psString("tracking-list-viewed") + ": " + (Math.round((result.readPageCount / documentData.totalPages) * 100)) + "%"}
                            placement="top">
                            <div className="circular-chart-wrapper">
                              <svg viewBox="0 0 32 32" className="circular-chart" width="24" height="24">
                                <circle className="circle" cx="16" cy="16" r="16"
                                        strokeDasharray={(Math.round((result.readPageCount / documentData.totalPages) * 100)) + ", 100"}/>
                                <circle className="circle-sub" cx="16" cy="16" r="8"
                                        strokeDasharray="100,100"/>
                              </svg>
                            </div>
                          </Tooltip>
                        </div>

                        <div className="chart-btn-wrapper"
                             onClick={(e) => (result.totalReadTimestamp === 0 ? e.stopPropagation() : this.handleClick(e))}
                             data-idx={idx}
                             data-cid={result.cid}>
                          <div className={"chart-btn " + (result.totalReadTimestamp === 0 ? "btn-disabled" : "")}>
                            <i className="material-icons">bar_chart</i>
                            <i className="material-icons">keyboard_arrow_up</i>
                          </div>
                        </div>
                      </div>


                    </div>
                    {selectedTr && String(idx) === selectedTr && chartResultList &&
                    <div className="col-12">
                      <CustomChart chartData={chartResultList} subject="tracking"/>
                    </div>
                    }

                </span>

                ))}


                {loading && <div className="spinner"><ThreeBounce name="ball-pulse-sync"/></div>}
                {!loading && rst.length === 0 && <div className="no-data">{psString("tracking-list-no-data")}</div>}

              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default AudienceTrackingList;
