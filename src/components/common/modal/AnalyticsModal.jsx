import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { psString } from "../../../config/localization";
import common_view from "../../../common/common_view";
import common from "../../../common/common";
import MainRepository from "../../../redux/MainRepository";
import CustomChart from "../CustomChart";
import NoDataIcon from "../NoDataIcon";
import { FadingCircle } from "better-react-spinkit";

class AnalyticsModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      classicModal: false,
      closeFlag: false,
      week: 1,
      year: null,
      analyticsList: null,
      loading: false
    };
  }


  // state 제거
  clearState = () =>
    Promise.resolve(this.setState({
      classicModal: false,
      closeFlag: false
    }));


  // 차트 정보 GET
  getAnalytics = () => {
    const { week, year } = this.state;
    const { documentData } = this.props;

    MainRepository.Analytics.getAnalyticsList({
        week: week,
        year: year,
        documentId: documentData.documentId
      }, result => {
        this.setState({ analyticsList: result });
      }
    );
  };


  // 모달 숨기기 클래스 추가
  setCloseFlag = () =>
    new Promise(resolve =>
      this.setState({ closeFlag: true }, () => resolve()));


  // 엑셀 추출 버튼
  handleExport = () => {
    const { week, year } = this.state;
    const { documentData } = this.props;
    const data = {
      documentId: documentData.documentId,
      year: week,
      week: year
    };
    this.setState({loading : true});

    MainRepository.Analytics.getAnalyticsExport(data, rst => {
      const a = document.createElement("a");
      a.style.display = "none";
      a.setAttribute("id", "tempHyperlinkTag");
      document.body.appendChild(a);

      a.href = rst.csvDownloadUrl;

      a.setAttribute("download", "analystics_" + documentData.seoTitle + ".xls");
      a.click();

      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
      this.setState({loading : false});
    });
  };


  // 날짜 선택 버튼
  handleWeekBtnClick = e => {
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
      this.getAnalytics();
    });
  };


  // 모달 open 관리
  handleClickOpen = (modal) => {
    const x = [];
    x[modal] = true;
    this.setState(x);
    this.getAnalytics();
    common_view.setBodyStyleLock();
  };


  // 모달 취소버튼 클릭 관리
  handleClickClose = modal =>
    this.setCloseFlag()
      .then(() => common.delay(200))
      .then(() => common_view.setBodyStyleUnlock())
      .then(() => this.handleClose(modal))
      .then(() => this.clearState());


  // 모달 close 관리
  handleClose = modal => {
    const x = [];
    x[modal] = false;
    this.setState(x);
    return Promise.resolve();
  };


  render() {
    const { classicModal, closeFlag,  year, week, analyticsList, loading} = this.state;
    const { type } = this.props;

    return (
      <span>
        {type !== "onlyIcon" ?
          <Tooltip title={psString("tooltip-analytics")} placement="bottom">
            <div className="viewer-btn mb-1" onClick={() => this.handleClickOpen("classicModal")}>
              <i className="material-icons">insert_chart_outlined</i> {psString("share-modal-btn")}
            </div>
          </Tooltip> :
          <div className="option-table-btn"
               onClick={() => this.handleClickOpen("classicModal")}>
            <i className="material-icons">insert_chart_outlined</i>
            {psString("analytics-modal-btn")}
          </div>}

        {classicModal &&
        <div className="custom-modal-container">
          <div className="custom-modal-wrapper"/>
          <div className={"custom-modal " + (closeFlag ? "custom-hide" : "")}>
            <div className="custom-modal-title">
              <i className="material-icons modal-close-btn"
                 onClick={() => this.handleClickClose("classicModal")}>close</i>
              <h3>{psString("analytics-modal-title")}</h3>
            </div>


            <div className="custom-modal-content">
              <div className="chart-date-btn mb-4" onClick={e => this.handleWeekBtnClick(e)}>
                <div data-value="1w" className={week === 1 ? "clicked" : ""}>1w</div>
                <div data-value="1m" className={week === 4 ? "clicked" : ""}>1m</div>
                <div data-value="3m" className={week === 12 ? "clicked" : ""}>3m</div>
                <div data-value="6m" className={week === 24 ? "clicked" : ""}>6m</div>
                <div data-value="1y" className={year === 1 ? "clicked" : ""}>1y</div>
              </div>
              {analyticsList && analyticsList.resultList.length > 0 &&
              <span>
                <CustomChart chartData={analyticsList} week={week} year={year} subject="analytics"/>
                </span>
              }
              {analyticsList && analyticsList.resultList.length === 0 &&
              <NoDataIcon/>
              }
            </div>

            <div className="custom-modal-footer">
              <div onClick={() => this.handleClickClose("classicModal")}
                   className="cancel-btn">{psString("common-modal-cancel")}</div>
              <div onClick={() => this.handleExport()} className={"ok-btn " +   (analyticsList && analyticsList.resultList.length > 0 ? "" : "btn-disabled")}>
                {loading &&
                <div className="loading-btn-wrapper"><FadingCircle color="#3681fe" size={17}/></div>}
                Export
              </div>
            </div>
          </div>
        </div>}
      </span>
    );
  }
}

export default AnalyticsModal;
