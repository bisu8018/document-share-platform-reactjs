import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThreeBounce } from "better-react-spinkit";

import MainRepository from "../../../../redux/MainRepository";
import NoDataIcon from "../../../common/NoDataIcon";
import CreatorTabItemContainer from "../../../../container/body/profile/creator/CreatorTabItemContainer";
import { psString } from "../../../../config/localization";
import log from "../../../../config/log";
import common_view from "../../../../common/common_view";

class CreatorUploadTab extends React.Component {
  state = {
    resultList: [],
    pageNo: null,
    isEndPage: false,
    moreDataFlag: false,
    totalViewCountInfo: null,
    loading: false
  };


  // 초기화
  init = () => {
    log.CreatorUploadTab.init();
    this.fetchDocuments();
  };


  //URL 파라미터 유저 identification GET
  getParam = () => {
    let pathArr = window.location.pathname.split("/");
    return decodeURI(pathArr[1]);
  };


  // 무한 스크롤 데이터 추가 GET
  fetchMoreData = () => {
    const { pageNo, moreDataFlag } = this.state;
    if (moreDataFlag) this.fetchDocuments({ pageNo: pageNo + 1 });
  };


  // 데이터 GET
  fetchDocuments = (params) => {
    const { userInfo, getMyInfo } = this.props;
    let pageNo = (!params || isNaN(params.pageNo)) ? 1 : Number(params.pageNo);
    let _params = {};

    if (userInfo.username && userInfo.username.length > 0) _params = {
      pageNo: pageNo,
      username: userInfo.username,
      pageSize: 10000
    };
    else _params = { pageNo: pageNo, email: userInfo.email, pageSize: 10000 };

    this.setState({ loading: true });   // 로딩 on
    let param = this.getParam();

    if (param === getMyInfo.username || param === getMyInfo.email || param === common_view.getMySub()) {
      MainRepository.Account.getDocuments(_params).then(res => {
        this.handleData(res);
        this.setState({ loading: false });    // 로딩 off
      }, err => {
        console.error(err);
        this.setTimeout = setTimeout(() => {
          this.fetchDocuments(params);
          clearTimeout(this.setTimeout);
        }, 8000);
      });
    } else {
      MainRepository.Document.getDocumentList(_params).then(res => {
        this.handleData(res);
        this.setState({ loading: false });    // 로딩 off
      }).catch(err => {
        console.error("Curator upload document GET ERROR", err);
        this.setTimeout = setTimeout(() => {
          this.fetchDocuments(params);
          clearTimeout(this.setTimeout);
        }, 8000);
      });
    }
  };


  // GET 데이터 관리
  handleData = (res) => {
    const { getDocumentList } = this.props;
    const { resultList } = this.state;

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

      if (res.count === 0 || res.resultList.length < 10) this.setState({ isEndPage: true });
      if (res && res.totalViewCountInfo && !this.state.totalViewCountInfo) this.setState({ totalViewCountInfo: res.totalViewCountInfo });
    }
  };


  // 클릭 이벤트 리스너 종료
  handleResizeEnd = (e) => {
    log.ContentMain.handleResizeEnd();
    window.removeEventListener("click", () => {
    });
  };


  componentWillMount() {
    this.init();
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
              <CreatorTabItemContainer document={result} userInfo={userInfo} idx={idx} key={idx}
                                       totalViewCountInfo={totalViewCountInfo}/>
            ))}</InfiniteScroll>
          :
          loading ?
            <div className="spinner"><ThreeBounce color="#3681fe" name="ball-pulse-sync"/></div>
            :<NoDataIcon className="no-data">No data</NoDataIcon>
        }
      </div>

    );
  }
}

export default CreatorUploadTab;
