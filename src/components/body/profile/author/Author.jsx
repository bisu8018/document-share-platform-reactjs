import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import CuratorUploadTab from "../curator/tab/CuratorUploadTab";
import MainRepository from "../../../../redux/MainRepository";
import Common from "../../../../util/Common";
import Spinner from "react-spinkit";
import NotFoundPage from "../../../common/NotFoundPage";
import CuratorAnalyticsTabContainer from "../../../../container/body/profile/curator/tab/CuratorAnalyticsTabContainer";
import AuthorSummaryContainer from "../../../../container/body/profile/author/AuthorSummaryContainer";
import CuratorVoteTabContainer from "../../../../container/body/profile/curator/tab/CuratorVoteTabContainer";


class Author extends React.Component {
  state = {
    userInfo: null,
    errMessage: null,
    uploadDocumentList: [],
    voteDocumentList: []
  };


  //URL 파라미터 유저 identificatin GET
  getParam = () => {
    let pathArr = window.location.pathname.split("/");
    return decodeURI(pathArr[1]);
  };

  // 프로필 정보 GET
  getProfileInfo = (params: any) => {
    MainRepository.Account.getProfileInfo(params, result => {
      this.setState({ userInfo: result, errMessage: null });
    }, err => {
      this.setState({ userInfo: null, errMessage: err });
    });
  };

  //업로드 탭에서 문서 목록 GET, AuthorSummary에서 계산 위해 사용
  getUploadDocumentList = (result: any) => {
    this.setState({ uploadDocumentList: result });
  };

  //투표 탭에서 문서 목록 GET, AuthorSummary에서 계산 위해 사용
  getVoteDocumentList = (result: any) => {
    this.setState({ voteDocumentList: result });
  };

  componentWillMount(): void {
    const { getMyInfo } = this.props;
    let presentValue = this.getParam();
    let params = {};

    if (getMyInfo.username !== presentValue && getMyInfo.email !== presentValue && getMyInfo.sub !== presentValue) {
      if (Common.checkEmailForm(presentValue)) params = { email: presentValue };
      else params = { username: presentValue };
      this.getProfileInfo(params);
    } else {
      this.setState({ userInfo: getMyInfo, errMessage: null });
    }
  }

  render() {
    const { getMyInfo } = this.props;
    const { userInfo, errMessage, uploadDocumentList } = this.state;

    let param = this.getParam();
    return (

      <div className="row">
        <div className="col-sm-12 col-lg-10 offset-lg-1 u__center profile-center">

          {userInfo &&
          <AuthorSummaryContainer totalCurator3DayReward={this.state.totalCurator3DayReward}
                                  totalCuratorEstimateRewards={this.state.totalCuratorEstimateRewards}
                                  uploadDocumentList={uploadDocumentList.resultList}
                                  uploadTotalViewCountInfo={uploadDocumentList.totalViewCountInfo}
                                  userInfo={userInfo}/>
          }

          {!userInfo && !errMessage && <div className="spinner"><Spinner name="ball-pulse-sync"/></div>}

          {errMessage && <NotFoundPage errMessage={errMessage}/>}

          {userInfo &&
          <Tabs forceRenderTabPanel={true}>
            <TabList>
              <Tab>Uploaded</Tab>
              <Tab>Voted</Tab>
              {(param === getMyInfo.username || param === getMyInfo.email || param === Common.getMySub()) &&
              <Tab>Analytics</Tab>}
            </TabList>

            <TabPanel>
              <CuratorUploadTab
                userInfo={userInfo}
                getDocumentList={this.getUploadDocumentList.bind(this)}
              />
            </TabPanel>

            <TabPanel>
              <CuratorVoteTabContainer
                userInfo={userInfo}
                getDocumentList={this.getVoteDocumentList.bind(this)}
              />
            </TabPanel>

            {(param === getMyInfo.username || param === getMyInfo.email || param === Common.getMySub()) &&
            <TabPanel>
              <CuratorAnalyticsTabContainer userInfo={userInfo}/>
            </TabPanel>
            }

          </Tabs>
          }
        </div>
      </div>

    );
  }
}

export default Author;
