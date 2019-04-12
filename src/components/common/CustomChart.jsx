import React from "react";
import Spinner from "react-spinkit";
import Chart from "react-google-charts";
import Common from "../../util/Common";

//https://www.npmjs.com/package/react-google-charts#quick-start
//구글 리액트 차트 라이브러리

class CustomChart extends React.Component {
  state = {
    options: {
      analyticsOption: {
        title: "",
        vAxis: { title: "" },
        hAxis: { title: "" },
        legend: { position: "top", maxLines: 3 }
      },
      dataArr: []
    }
  };

  //props 데이터, 차트 데이터화 작업
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
          if (i === 0) {
            dummyValue = Common.dateString(mondayFromWeekStart) + " ~ " + Common.dateString(new Date());
          } else {
            mondayFromWeekStart.setDate(mondayFromWeekStart.getDate() - 7);
            mondayFromWeekEnd.setDate(mondayFromWeekEnd.getDate() - 1);
            dummyValue = Common.dateString(mondayFromWeekStart) + " ~ " + Common.dateString(mondayFromWeekEnd);
          }
        }
      }
      dataArr[i] = [dummyValue, 0];
    }

    dataArr[arrSize] = ["Date", "Visit Count"];

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
            if (dataArr[i][0] === rstDate) {
              return dataArr[i][1] = rst.count;
            }
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

  componentWillMount(): void {
    const { subject } = this.props;
    switch (subject) {
      case "analytics" :
        this.getAnalyticsData();
        break;
      case "etc":   //추후 차트 추가 시 작성
        break;
      default :
        break;
    }

  }

  render() {
    const { options, dataArr } = this.state;
    const { subject } = this.props;

    let _options = {};

    switch (subject) {
      case "analytics" :
        _options = options.analyticsOption;
        break;
      case "etc":   //추후 차트 추가 시 작성
        break;
      default :
        break;
    }

    return (
      <div className="position-relative">
        <Chart
          className="mt-5 mb-2"
          chartType="AreaChart"
          data={dataArr}
          options={_options}
          width="100%"
          loader={<Spinner name="ball-pulse-sync"/>}
          legendToggle
        />
      </div>
    );
  };
}

export default CustomChart;