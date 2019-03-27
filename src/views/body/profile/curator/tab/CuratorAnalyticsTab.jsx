import React from "react";
import "react-tabs/style/react-tabs.css";
import Spinner from "react-spinkit";
import InfiniteScroll from "react-infinite-scroll-component";
import Tooltip from "@material-ui/core/Tooltip";

import MainRepository from "../../../../../redux/MainRepository";
import { Link } from "react-router-dom";
import Common from "../../../../../common/Common";
import CustomChart from "../../../../../components/common/CustomChart";

class CuratorAnalyticsTab extends React.Component {
  state = {
    resultList: [],
    analyticsList: null,
    spreadItem: null,
    pageNo: null,
    isEndPage: false,
    moreDataFlag: false
  };

  handleClick = (e) => {

    const parentElement = e.currentTarget.parentElement;
    const anotherItem = document.getElementsByClassName("scroll-out");
    const anotherArrow = document.getElementsByClassName("on");
    let dataKey = e.currentTarget.getAttribute("data-key");
    let dataId = e.currentTarget.getAttribute("data-id");

    if (parentElement.children[4].classList.length > 3) {
      parentElement.children[4].classList.remove("on");
      parentElement.children[5].classList.remove("scroll-out");
      parentElement.children[5].classList.add("scroll-up");
    } else {
      if (anotherArrow.length > 0 || anotherItem.length > 0) {
        anotherItem[0].classList.remove("scroll-out");
        anotherArrow[0].classList.remove("on");
        this.setState({ spreadItem: null });
      }
      parentElement.children[4].classList.add("on");
      parentElement.children[5].classList.remove("scroll-up");
      parentElement.children[5].classList.add("scroll-out");

      this.getAnalytics(dataId, dataKey);
    }
  };

  fetchMoreData = () => {
    const { pageNo } = this.state;
    if (this.state.moreDataFlag) {
      this.fetchDocuments({
        pageNo: pageNo + 1
      });
    }
  };

  fetchDocuments = (params) => {
    const { accountId } = this.props;
    const pageNo = (!params || isNaN(params.pageNo)) ? 1 : Number(params.pageNo);
    MainRepository.Document.getDocumentList({ accountId: accountId, pageNo: pageNo }, (res) => {
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
    });
  };

  getAnalytics = (documentId, dataKey) => {
    MainRepository.Document.getAnalyticsList({
        week: 4,
        documentId: documentId
      }, result => {
        this.setState({ spreadItem: Number(dataKey) });
        this.setState({ analyticsList: result });
      }
    );
  };

  getGraph = () => {
    const { analyticsList } = this.state;
    if (analyticsList && analyticsList.resultList.length > 0) {
      return (
        <table className="analytics-table" border="0" cellSpacing="0" cellPadding="0">
          <tbody>
          <tr>
            <th className="col1">DATE</th>
            <th className="col2">VISIT COUNT</th>
          </tr>
          {analyticsList.resultList.map((rst, idx) => (
            <tr key={idx}>
              <td className="col1">
                <span>{(rst.month < 10 ? "0" : "") + rst.month} / </span>
                <span>{(rst.dayOfMonth < 10 ? "0" : "") + rst.dayOfMonth} / </span>
                <span>{rst.year}  </span>
              </td>
              <td className="col2">{rst.count}</td>
            </tr>
          ))}
          </tbody>
        </table>
      );
    }

    return (
      <div className="no-data">No data</div>
    );
  };

  componentWillMount() {
    this.fetchDocuments();
  }


  render() {
    const { resultList, spreadItem, isEndPage, analyticsList } = this.state;
    return (
      <div>
        <div className="document-total-num">
          Total documents : <span>{resultList.length}</span>
        </div>
        <InfiniteScroll
          dataLength={resultList.length}
          next={this.fetchMoreData}
          hasMore={!isEndPage}
          loader={<div className="spinner"><Spinner name="ball-pulse-sync"/></div>}>


          {resultList.map((result, idx) => (
            <div className="row analytics-inner" key={idx}>

              <div className="d-none d-sm-inline-block col-sm-2">
                <Link to={"/doc/" + result.documentId}>
                  <div className="analytics-thumb-image">
                    <img src={Common.getThumbnail(result.documentId, 1, result.documentName)}
                         alt={result.title ? result.title : result.documentName} className="img-fluid"/>
                  </div>
                </Link>
              </div>

              <div className="col-8 col-sm-6">
                <Link to={"/doc/" + result.documentId}>
                  <div className="analytics-info-title">  {result.title ? result.title : result.documentName} </div>
                </Link>
              </div>

              <div className="d-none d-sm-inline-block col-sm-2 analytics-info-date">
                {Common.dateAgo(result.created) === 0 ? "Today" : Common.timestampToDate(result.created)}
              </div>

              <div className="col-2 col-sm-1">
                {(idx !== spreadItem ) &&
                <Tooltip title="Please click the right arrow button." placement="bottom">
                    <div className="export-btn-disabled">
                      <i className="material-icons">save</i>
                    </div>
                </Tooltip>
                }
                {idx === spreadItem && analyticsList &&
                <Tooltip title="Export analytics of this document." placement="bottom">
                  <a href={analyticsList.csvDownloadUrl}>
                    <div className="export-btn">
                      <i className="material-icons">save</i>
                    </div>
                  </a>
                </Tooltip>
                }
              </div>

              <div className="col-2 col-sm-1 analytics-btn-div" onClick={this.handleClick.bind(this)}
                   title="See analytics of this document" data-key={idx} data-id={result.documentId}>
                <i><img src={require("assets/image/common/i_faq_reverse.png")} alt="dropdown icon"/></i>
              </div>

              <div className="col-12 ">
                {idx === spreadItem && analyticsList &&
                    <CustomChart chartData={analyticsList} subject="analytics"/>
                }
              </div>
            </div>
          ))}
        </InfiniteScroll>
      </div>

    );
  }
}

export default CuratorAnalyticsTab;
