import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThreeBounce } from 'better-react-spinkit';

import MainRepository from "../../../../redux/MainRepository";
import NoDataIcon from "../../../common/NoDataIcon";
import CreatorTabItemContainer from "../../../../container/body/profile/creator/CreatorTabItemContainer";

class CuratorUploadTab extends React.Component {
  state = {
    resultList: [],
    pageNo: null,
    isEndPage: false,
    moreDataFlag: false,
    totalViewCountInfo: null,
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
    const { userInfo, getDocumentList } = this.props;
    const { resultList } = this.state;
    let pageNo = (!params || isNaN(params.pageNo)) ? 1 : Number(params.pageNo);
    let _params = {};

    if (userInfo.username && userInfo.username.length > 0) _params = {
      pageNo: pageNo,
      username: userInfo.username,
      pageSize: 10000
    };
    else _params = { pageNo: pageNo, email: userInfo.email, pageSize: 10000 };

    MainRepository.Document.getDocumentList(_params, (res) => {
      if (res && res.resultList) {
        if (resultList.length > 0) {
          this.setState({
            resultList: resultList.concat(res.resultList),
            pageNo: res.pageNo
          });
        } else {
          this.setState({
            resultList: res.resultList,
            pageNo: res.pageNo
          }, () => {
            // 2019-04-16, 임시 사용, AuthorSummary 데이터 전달 위한 Event
            getDocumentList(res);
          });
        }

        this.setState({ moreDataFlag: true });

        if (res.count === 0 || res.resultList.length < 10) {
          this.setState({ isEndPage: true });
        }

        if (res && res.totalViewCountInfo && !this.state.totalViewCountInfo) {
          this.setState({ totalViewCountInfo: res.totalViewCountInfo });
        }
      }
    });
  };

  componentWillMount() {
    this.fetchDocuments();
  }


  render() {
    const { resultList, isEndPage,  totalViewCountInfo } = this.state;
    const { userInfo } = this.props;

    return (

      <div>
        <div className="document-total-num">
          Total documents : <span className="font-weight-bold">{resultList.length}</span>
        </div>
        {resultList.length > 0 ?
          <InfiniteScroll
            className="overflow-hidden"
            dataLength={resultList.length}
            next={this.fetchMoreData}
            hasMore={!isEndPage}
            loader={<div className="spinner"><ThreeBounce name="ball-pulse-sync"/></div>}>
            {resultList.length > 0 && resultList.map((result, idx) => (
              <CreatorTabItemContainer document={result} userInfo={userInfo} key={idx} totalViewCountInfo={totalViewCountInfo}/>
            ))}
          </InfiniteScroll>
          :
          <NoDataIcon className="no-data">No data</NoDataIcon>
        }
      </div>

    );
  }
}

export default CuratorUploadTab;
