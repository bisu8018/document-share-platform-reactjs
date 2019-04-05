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
    moreDataFlag: false
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
    const { userInfo } = this.props;
    let pageNo = (!params || isNaN(params.pageNo)) ? 1 : Number(params.pageNo);
    let _params = {};
    if (userInfo.username && userInfo.username.length > 0) _params = { pageNo: pageNo, username: userInfo.username };
    else _params = { pageNo: pageNo, email: userInfo.email };

    MainRepository.Document.getDocumentList(_params, (res) => {
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

  componentWillMount() {
    this.fetchDocuments();
  }


  render() {
    const { drizzleApis } = this.props;
    const { resultList, isEndPage } = this.state;

    return (

      <div>
        <div className="document-total-num">
          Total documents : <span>{resultList.length}</span>
        </div>
        <InfiniteScroll
          className="overflow-hidden"
          dataLength={resultList.length}
          next={this.fetchMoreData}
          hasMore={!isEndPage}
          loader={<div className="spinner"><Spinner name="ball-pulse-sync"/></div>}>


          {resultList.length > 0 && resultList.map((result, idx) => (
            <CuratorTabItem document={result}
                            key={idx}
                            drizzleApis={drizzleApis}/>
          ))}
        </InfiniteScroll>
      </div>

    );
  }
}

export default CuratorUploadTab;
