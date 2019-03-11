import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "react-tabs/style/react-tabs.css";
import Spinner from "react-spinkit";

import MainRepository from "../../../../../redux/MainRepository";
import CuratorTabItem from "./CuratorTabItem";


class CuratorUploadTab extends React.Component {
  state = {
    resultList: [],
    pageNo: null,
    isEndPage: false,
  };
  fetchMoreData = () => {
    this.fetchDocuments({
      pageNo: this.state.pageNo + 1
    });
  };

  fetchDocuments = (params) => {
    const { match } = this.props;
    const accountId = match.params.accountId;
    const pageNo = (!params || isNaN(params.pageNo)) ? 1 : Number(params.pageNo);
    MainRepository.Document.getDocumentList({ accountId: accountId, pageNo: pageNo }, (res) => {
      if (res && res.resultList) {
        if (this.state.resultList) {
          this.setState({
            resultList: this.state.resultList.concat(res.resultList),
            pageNo: res.pageNo,
            totalViewCountInfo: res.totalViewCountInfo
          });
        } else {
          this.setState({
            resultList: res.resultList,
            pageNo: res.pageNo,
            totalViewCountInfo: res.totalViewCountInfo
          });
        }

        if (res.count === 0) {
          this.setState({ isEndPage: true });
        }
      }
    });
  };

  componentWillMount() {
    this.fetchDocuments();
  }


  render() {
    const { totalViewCountInfo } = this.props;
    return (

      <div>
        <h3 style={{ margin: "20px 0 0 0", fontSize: "26px" }}>{this.state.resultList.length} shared
          documents </h3>
        <InfiniteScroll
          dataLength={this.state.resultList.length}
          next={this.fetchMoreData}
          hasMore={!this.state.isEndPage}
          loader={<div className="spinner"><Spinner name="ball-pulse-sync"/></div>}>


          {this.state.resultList.map((result, idx) => (
            <CuratorTabItem {...this.props}
                            document={result}
                            key={idx}
                            totalViewCountInfo={totalViewCountInfo}/>
          ))}
        </InfiniteScroll>
      </div>

    );
  }
}

export default CuratorUploadTab;
