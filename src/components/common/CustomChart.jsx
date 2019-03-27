import React from "react";
import { Chart } from "react-google-charts";
import Common from "../../common/Common";
import Spinner from "react-spinkit";

//https://www.npmjs.com/package/react-google-charts#quick-start
//구글 리액트 차트 라이브러리

class CustomChart extends React.Component {
  state = {
    options: {
      analyticsOption: {
        title: "",
        vAxis: { title: "" },
        hAxis: { title: "",minValue: 0 },
        legend: { position: 'top', maxLines: 3 },
      }
    }
  };

  //차트 데이터 props
  getArr = (subject, arr) => {
    const { chartData } = this.props;
    let dataArr = [];

    dataArr.push(arr);

    chartData.resultList.map((rst) => {
      let data;
      if (subject === "analytics") {
        data = Common.setDateType(rst.year, rst.month, rst.dayOfMonth);
        dataArr.push([data, rst.count]);
      }
      return dataArr;
    });
  };

  render() {
    const { options } = this.state;
    const { subject } = this.props;

    let _options = {};
    let data = [];

    if (subject === "analytics") {
      _options = options.analyticsOption;
      data = ["Date", "Visit Count"];
    }

    data = this.getArr(subject, data);

    return (
      <div className="position-relative">
        <Chart
          className="mt-3 mb-2"
          chartType="AreaChart"
          data={data}
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