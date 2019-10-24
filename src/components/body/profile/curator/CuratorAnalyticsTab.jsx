import React from "react";
import { ThreeBounce } from "better-react-spinkit";
import InfiniteScroll from "react-infinite-scroll-component";
import Tooltip from "@material-ui/core/Tooltip";

import MainRepository from "../../../../redux/MainRepository";
import { Link } from "react-router-dom";
import Common from "../../../../common/common";
import CustomChart from "../../../common/CustomChart";
import NoDataIcon from "../../../common/NoDataIcon";
import { psString } from "../../../../config/localization";
import common_view from "../../../../common/common_view";
import { APP_PROPERTIES } from "../../../../properties/app.properties";

class CuratorAnalyticsTab extends React.Component {
  state = {
    resultList: [],
    analyticsList: null,
    spreadItem: null,
    pageNo: null,
    isEndPage: false,
    moreDataFlag: false,
    week: 1,
    year: null,
    documentId: null,
    chartFlag: false,
    loading: false
  };

  // infinity scroll 문서 리스트 추가 로드
  fetchMoreData = () => {
    const { pageNo } = this.state;
    if (this.state.moreDataFlag) {
      this.fetchDocuments({ pageNo: pageNo + 1 });
    }
  };

  // 문서 리스트 GET
  fetchDocuments = (params) => {
    const { userInfo } = this.props;
    const pageNo = (!params || isNaN(params.pageNo)) ? 1 : Number(params.pageNo);
    let _params = {};

    if (userInfo.username && userInfo.username.length > 0) _params = { pageNo: pageNo, username: userInfo.username };
    else _params = { pageNo: pageNo, email: userInfo.email };


    // 로딩 on
    this.setState({ loading: true });

    MainRepository.Document.getDocumentList(_params)
      .then(res => {
        if (res && res.resultList) {
          if (this.state.resultList) {
            this.setState({
              resultList: this.state.resultList.concat(res.resultList),
              pageNo: res.pageNo
            });
          } else {
            this.setState({
              resultList: res.resultList,
              pageNo: res.pageNo
            });
          }

          this.setState({ moreDataFlag: true });

          if (res.count === 0 || res.resultList.length < 10) {
            this.setState({ isEndPage: true });
          }
        }
        // 로딩 off
        this.setState({ loading: false });
      }).catch(err => {
      console.error("Creator analytics info GET ERROR", err);
      this.setTimeout = setTimeout(() => {
        this.fetchDocuments(params);
        clearTimeout(this.setTimeout);
      }, 8000);
    });
  };

  // 차트 정보 GET
  getAnalytics = (documentId, dataKey) => {
    const { week, year } = this.state;

    MainRepository.Analytics.getAnalyticsList({
        week: week,
        year: year,
        documentId: documentId
      }, result => {
        this.setState({ spreadItem: Number(dataKey) });
        this.setState({ documentId: documentId });
        this.setState({ analyticsList: result }, () => {
          this.setState({ chartFlag: true }); //차트 데이터 props 타이밍 동기화
        });
      }
    );
  };


  // 스크롤 아웃 관리 메소드
  handleClick = (e) => {
    const parentElement = e.currentTarget.parentElement,
      anotherItem = document.getElementsByClassName("scroll-out"),
      anotherArrow = document.getElementsByClassName("on"),
      dataKey = e.currentTarget.getAttribute("data-key"),
      dataId = e.currentTarget.getAttribute("data-id");

    this.setState({ week: 1, year: null }, () => {
      if (parentElement.children[3].classList.length > 3) {
        parentElement.children[3].classList.remove("on");
        parentElement.children[4].classList.remove("scroll-out");
        parentElement.children[4].classList.add("scroll-up");
      } else {
        if (anotherArrow.length > 0 || anotherItem.length > 0) {
          anotherItem[0].classList.remove("scroll-out");
          anotherArrow[0].classList.remove("on");
          this.setState({ spreadItem: null });
        }
        parentElement.children[3].classList.add("on");
        parentElement.children[4].classList.remove("scroll-up");
        parentElement.children[4].classList.add("scroll-out");

        this.setState({ chartFlag: false });   //차트 데이터 props 타이밍 동기화
        this.getAnalytics(dataId, dataKey);      //차트 데이터 GET
      }
    });
  };

  // 엑셀 추출 버튼
  handleExport = (seoTitle) => {
    const { week, year, documentId } = this.state;
    const data = {
      documentId: documentId,
      year: week,
      week: year
    };
    MainRepository.Analytics.getAnalyticsExport(data, rst => {
      const a = document.createElement("a");
      a.style.display = "none";
      document.body.appendChild(a);

      a.href = rst.csvDownloadUrl;

      a.setAttribute("download", "analystics_" + seoTitle + ".xls");
      a.click();

      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    });
  };

  // 날짜 선택 버튼
  handleWeekBtnClick = (e) => {
    const { documentId, spreadItem } = this.state;
    let weekValue = e.target.dataset.value;
    let weekValueNum = null;

    switch (weekValue) {
      case "1w" :
        weekValueNum = 1;
        break;
      case "1m" :
        weekValueNum = 4;
        break;
      case "3m" :
        weekValueNum = 12;
        break;
      case "6m" :
        weekValueNum = 24;
        break;
      case "1y" :
        weekValueNum = 1;
        break;
      default:
        break;
    }

    this.setState({
      week: weekValue !== "1y" ? weekValueNum : null,
      year: weekValue !== "1y" ? null : weekValueNum
    }, () => {
      this.setState({ chartFlag: false });   //차트 데이터 props 타이밍 동기화
      this.getAnalytics(documentId, spreadItem);
    });
  };


  componentWillMount() {
    this.fetchDocuments();
  }

  render() {
    const { resultList, spreadItem, isEndPage, analyticsList, year, week, chartFlag, loading } = this.state;
    const { userInfo } = this.props;

    let identification = userInfo.username && userInfo.username.length > 0 ? userInfo.username : userInfo.email;

    return (
      <div className="col-12">
        <div className="document-total-num mb-2">
          {psString("profile-total-documents")} <span className="font-weight-bold">{resultList.length}</span>
        </div>


        {resultList.length > 0 ?
          <InfiniteScroll
            className="overflow-hidden"
            dataLength={resultList.length}
            next={this.fetchMoreData}
            hasMore={!isEndPage}
            loader={<div className="spinner"><ThreeBounce color="#3681fe" name="ball-pulse-sync"/></div>}>


            {resultList.length > 0 && resultList.map((result, idx) => (
              <div className="row analytics-inner" key={idx}>

                <div className="d-none pl-0 d-sm-inline-block col-sm-2">
                  <Link to={"/@" + identification + "/" + result.seoTitle} rel="nofollow">
                    <div className="analytics-thumb-image" onClick={() => common_view.scrollTop()}>
                      <img src={Common.getThumbnail(result.documentId, 320, 1, result.documentName)}
                           alt={result.title ? result.title : result.documentName} className="img-fluid"/>
                    </div>
                  </Link>
                </div>

                <div className="col-10 col-sm-7 mb-4">
                  <Link to={"/@" + identification + "/" + result.seoTitle} rel="nofollow">
                    <div className="analytics-info-title"
                         onClick={() => common_view.scrollTop()}>  {result.title ? result.title : result.documentName} </div>
                  </Link>
                </div>

                <div className="d-none d-sm-inline-block col-sm-2 analytics-info-date">
                  {common_view.dateTimeAgo(result.created)}
                </div>

                <div className="col-2 col-sm-1 analytics-btn-div"
                     onClick={this.handleClick.bind(this)}
                     title="See analytics of this document"
                     data-key={idx}
                     data-id={result.documentId}>
                  <i><img src={APP_PROPERTIES.domain().static + "/image/icon/i_faq_reverse.png"} alt="dropdown icon"/></i>
                </div>

                <div className="col-12 ">
                  {idx === spreadItem &&
                  <div className="chart-date-btn ml-3 ml-sm-4" onClick={this.handleWeekBtnClick.bind(this)}>
                    <div data-value="1w" className={week === 1 ? "clicked" : ""}>1w</div>
                    <div data-value="1m" className={week === 4 ? "clicked" : ""}>1m</div>
                    <div data-value="3m" className={week === 12 ? "clicked" : ""}>3m</div>
                    <div data-value="6m" className={week === 24 ? "clicked" : ""}>6m</div>
                    <div data-value="1y" className={year === 1 ? "clicked" : ""}>1y</div>
                  </div>
                  }
                  {idx === spreadItem && analyticsList && analyticsList.resultList.length > 0 &&
                  <span>
                    <Tooltip title="Export tracking data as Excel file." placement="bottom">
                      <div className="viewer-btn float-right"
                           onClick={() => this.handleExport(result.seoTitle)}>
                        <i className="material-icons">save</i>
                        Export
                      </div>
                    </Tooltip>
                    {chartFlag &&
                    <CustomChart chartData={analyticsList} week={week} year={year} subject="analytics"/>
                    }
                </span>
                  }
                  {idx === spreadItem && analyticsList && analyticsList.resultList.length === 0 &&
                  <NoDataIcon/>
                  }
                </div>
              </div>
            ))} </InfiniteScroll>
          :
          !loading && <NoDataIcon className="no-data">No data</NoDataIcon>
        }


        {loading && <div className="spinner mb-4"><ThreeBounce name="ball-pulse-sync" color="#3681fe"/></div>}
      </div>

    );
  }
}

export default CuratorAnalyticsTab;
