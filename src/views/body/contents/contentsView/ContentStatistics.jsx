import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import * as restapi from 'apis/DocApi';
import Button from "components/custom/HeaderButton";

const style = {};

class ContentStatistics extends React.Component {
  state = {
    resultList: []
  };

  componentWillMount() {
    
    this.print();
  }

  timestampToDate = (timestamp)=>{
    const date = new Date(timestamp);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hour = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();
    const time = day + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;

    return time;
  };

  print = async () => {
    const {document} = this.props;
    const result = await restapi.getTrackingInfo(document.documentId);
    console.log(result.data);
    this.setState({resultList: result.data.resultList?result.data.resultList:[]})
  };



  printDetail = async (e, item) => {
    const {document} = this.props;
    const result = await restapi.getTrackingList(document.documentId, item.cid, item.sid);
    console.log(result.data);
    const resultList = result.data.resultList;

    resultList.sort((b, a)=>{
      return b.t - a.t;
    }).map((tracking, index, array) => {
      let elapsedTime = 0;
      if(index<array.length-1){
        elapsedTime = Number(array[index+1].t) - Number(tracking.t);
      }
      if(tracking.n>0)
      console.log(tracking.e, tracking.n, "page", "cid:", tracking.cid, "sid:", tracking.sid, "Elapsed Time", elapsedTime, "Time", tracking.t)
    })

  };

  render() {
    const {resultList} = this.state;
    //const document = this.state.document;
    console.log(resultList);

    return (
      <div>
        <span>result list</span>
        {resultList.map((result, index) => (
          <Button color="rose" size="sm" onClick={(e)=>{
            this.printDetail(e, result);
          }}>{result.e} - {this.timestampToDate(result.latest)}</Button>
        ))}

      </div>
    );
  }
}

export default withStyles(style)(ContentStatistics);
