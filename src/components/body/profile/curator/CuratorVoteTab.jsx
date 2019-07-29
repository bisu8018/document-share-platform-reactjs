import React from "react";
import MainRepository from "../../../../redux/MainRepository";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThreeBounce } from "better-react-spinkit";
import CuratorTabItemContainer from "../../../../container/body/profile/curator/CuratorTabItemContainer";
import NoDataIcon from "../../../common/NoDataIcon";
import { psString } from "../../../../config/localization";

class CuratorVoteTab extends React.Component {

  state = {
    resultList: [],
    pageNo: null,
    isEndPage: false,
    moreDataFlag: false,
    totalViewCountInfo: null,
    loading: false
  };


  // 무한 스크롤 다음 문서 DATA fetch
  fetchMoreData = () => {
    const { pageNo } = this.state;
    if (this.state.moreDataFlag) {
      this.fetchDocuments({
        pageNo: pageNo + 1
      });
    }
  };


  // 문서 정보 fetch
  fetchDocuments = (params) => {
    const { userInfo, getDocumentList } = this.props;
    const { resultList } = this.state;
    let pageNo = (!params || isNaN(params.pageNo)) ? 1 : Number(params.pageNo);
    let _params = {};

    if (userInfo.ethAccount && userInfo.ethAccount.length > 0) {
      _params = {
        pageNo: pageNo,
        ethAccount: userInfo.ethAccount

      };
    } else return false;

    // 로딩 on
    this.setState({ loading: true });

    MainRepository.Curator.getCuratorDocuments(_params, res => {
      if (res.resultList.length > 0) {
        if (resultList.length > 0) {
          this.setState({ resultList: resultList.concat(res.resultList), pageNo: res.pageNo });
        } else {
          this.setState({ resultList: res.resultList, pageNo: res.pageNo }, () => {
            // 2019-04-16, 임시 사용, AuthorSummary 데이터 전달 위한 Event
            getDocumentList(res);
          });
        }

        this.setState({ moreDataFlag: true });

        if (res.count === 0 || res.resultList.length < 10) this.setState({ isEndPage: true });

        if (res && res.totalViewCountInfo && !this.state.totalViewCountInfo) this.setState({ totalViewCountInfo: res.totalViewCountInfo });
      }
      // 로딩 off
      this.setState({ loading: false });
    }, (err) => {
      console.error("Error CuratorDocumentList", err);
      setTimeout(() => {
        this.fetchDocuments(params);
      }, 8000);
    });
  };


  componentWillMount() {
    this.fetchDocuments();
  }


  render() {
    const { resultList, isEndPage, totalViewCountInfo, loading } = this.state;
    const { userInfo } = this.props;

    return (
      <div className="col-12">
        <div className="document-total-num">
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
              <CuratorTabItemContainer document={result} key={idx} userInfo={userInfo}
                                       totalViewCountInfo={totalViewCountInfo}/>
            ))} </InfiniteScroll>
          :
          !loading && <NoDataIcon className="no-data">No data</NoDataIcon>
        }
      </div>
    );
  }
}

export default CuratorVoteTab;
