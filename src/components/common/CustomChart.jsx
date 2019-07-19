import React from "react";
import { ThreeBounce } from "better-react-spinkit";
import Chart from "react-google-charts";
import Common from "../../config/common";
import { psString } from "../../config/localization";

//https://www.npmjs.com/package/react-google-charts#quick-start
//구글 리액트 차트 라이브러리

class CustomChart extends React.Component {
  state = {
    dataArr: [],
    chartType: {
      analyticsChartType: "AreaChart",
      trackingChartType: "Bar",
    },
    options: {
      analyticsOption: {
        title: "",
        vAxis: { title: "" },
        hAxis: { title: "" },
        legend: { position: "top", maxLines: 3 }
      },
      trackingOption: {
        title: psString("chart-tracking-option-title"),
        vAxis: { format: 'number' },
        hAxis: { format: 'number' },
      },
    },
    columns: {
      analyticsColumns: [
        {type: "number", label: psString("chart-date")},
        {type: "number", label: psString("chart-visit-count")}
      ],
      trackingColumns : [
        {type: "number",  label: psString("chart-page")},
        {type: "date",  label: psString("chart-time-spend-min")},
      ]
    }
  };


  /*======================================
  ============== ANALYTICS =============
  ======================================*/

  getAnalyticsData = () => {
    const { chartData, week, year } = this.props;
    let dataArr = [];
    let dateTmp = new Date();
    let mondayFromWeekStart = Common.getMonday(new Date());
    let mondayFromWeekEnd = Common.getMonday(new Date());
    let checkWeek = week === 1 || week === 4;   //1w,1m vs 3m,6m
    let arrSize = year ? 12 : (checkWeek ? 7 * week : chartData.resultList[chartData.resultList.length - 1].week);
    let lastMonth = chartData.resultList[chartData.resultList.length - 1].month;

    // 빈 배열 생성
    for (let i = 0; i < arrSize; ++i) {
      let dummyValue;

      if (year) {
        let monthTmp = lastMonth - i > 0 ? lastMonth - i : lastMonth - i + 12;
        dummyValue = Common.monthToString(monthTmp);
      } else {
        if (checkWeek) {
          dateTmp.setDate(dateTmp.getDate() - (i === 0 ? 0 : 1));
          dummyValue = Common.dateString(dateTmp);
        } else {
          if (i === 0) dummyValue = Common.dateString(mondayFromWeekStart) + " ~ " + Common.dateString(new Date());
          else {
            mondayFromWeekStart.setDate(mondayFromWeekStart.getDate() - 7);
            mondayFromWeekEnd.setDate(mondayFromWeekEnd.getDate() - 1);
            dummyValue = Common.dateString(mondayFromWeekStart) + " ~ " + Common.dateString(mondayFromWeekEnd);
          }
        }
      }
      dataArr[i] = [dummyValue, 0];
    }

    dataArr[arrSize] = [psString("chart-date"), psString("chart-visit-count")];

    // 해당 빈 배열에 chart data 값 삽입
    if (year) {
      chartData.resultList.map((rst) => {
        let calcMonth = lastMonth - rst.month;
        let monthTmp = calcMonth >= 0 ? calcMonth : calcMonth + 12;
        return dataArr[monthTmp][1] = rst.count;
      });
    } else {
      if (checkWeek) {
        chartData.resultList.map((rst) => {
          let rstDate = rst.year + "-" + (rst.month < 10 ? "0" : "") + rst.month + "-" + (rst.dayOfMonth < 10 ? "0" : "") + rst.dayOfMonth;
          for (let i = 0; i < dataArr.length; ++i) {
            if (dataArr[i][0] === rstDate) return dataArr[i][1] = rst.count;
          }
          return true;
        });
      } else {
        chartData.resultList.map((rst) => {
          return dataArr[arrSize - rst.week][1] = rst.count;
        });
      }
    }
    return this.setState({ dataArr: dataArr.reverse() });
  };


  /*======================================
   ============== ANALYTICS =============
   ======================================*/

  getTrackingData = () => {
    const { chartData } = this.props;
    let dataArr = [[psString("chart-page"), psString("chart-time-spend-min")]];

    for (let [key, value] of Object.entries(chartData)) {
      let tmpArr = [key, value/1000/60];
      dataArr.push(tmpArr);
      //console.log(`${key}: ${value}`);
    }

    return this.setState({ dataArr: dataArr });
  };


  componentWillMount(): void {
    const { subject } = this.props;
    switch (subject) {
      // Profile - Analytics
      case "analytics" :
        this.getAnalyticsData();
        break;

      // Tracking
      case "tracking" :
        this.getTrackingData();
        break;


      case "etc":
        break;


      default :
        break;
    }
  }

  render() {
    const { options, columns, dataArr, chartType } = this.state;
    const { subject } = this.props;

    let _options = {};
    let _columns = {};
    let _chartType = {};

    switch (subject) {
      // Profile - Analytics
      case "analytics" :
        _options = options.analyticsOption;
        _columns = columns.analyticsColumns;
        _chartType = chartType.analyticsChartType;
        break;

      // Tracking
      case "tracking" :
        _options = options.trackingOption;
        _columns = columns.trackingColumns;
        _chartType = chartType.trackingChartType;
        break;

      case "etc":   //추후 차트 추가 시 작성
        break;

      default :
        break;
    }


    return (
      <div className="position-relative w-100">
        <Chart
          className="mt-5 mb-2"
          chartType={_chartType}
          data={dataArr}
          options={_options}
          columns={_columns}
          width="100%"
          loader={<ThreeBounce name="ball-pulse-sync" color="#3681fe"/>}
          legendToggle
        />
      </div>
    );
  };
}

export default CustomChart;
