import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import MainRepository from "../../../../redux/MainRepository";
import Common from "../../../../common/common";
import { ThreeBounce } from "better-react-spinkit";
import NotFoundPage from "../../../common/NotFoundPage";
import CuratorAnalyticsTabContainer from "../../../../container/body/profile/curator/CuratorAnalyticsTabContainer";
import CreatorSummaryContainer from "../../../../container/body/profile/creator/CreatorSummaryContainer";
import CuratorVoteTabContainer from "../../../../container/body/profile/curator/CuratorVoteTabContainer";
import CreatorUploadTabContainer from "../../../../container/body/profile/creator/CreatorUploadTabContainer";
import { psString } from "../../../../config/localization";
import { Helmet } from "react-helmet";
import log from "../../../../config/log";
import common_view from "../../../../common/common_view";
import { APP_PROPERTIES } from "../../../../properties/app.properties";
import LoadingModal from "../../../common/modal/LoadingModal";


class Creator extends React.Component {
  state = {
    userInfo: null,
    errMessage: null,
    uploadDocumentList: [],
    voteDocumentList: []
  };


  // 초기화
  init = () => {
    const { getMyInfo } = this.props;

    if(APP_PROPERTIES.ssr) return;

    log.Creator.init();
    let presentValue = this.getParam(), params = {};

    if (getMyInfo.username !== presentValue && getMyInfo.email !== presentValue && getMyInfo.sub !== presentValue) {
      if (Common.checkEmailForm(presentValue)) params = { email: presentValue };
      else params = { username: presentValue };
      this.getProfileInfo(params);
    } else this.setState({ userInfo: getMyInfo, errMessage: null });
  };


  // 프로필 정보 GET
  getProfileInfo = (params: any) => {
    MainRepository.Account.getProfileInfo(params)
      .then(result => this.setState({
        userInfo: result,
        errMessage: null
      }, () => log.Creator.getProfileInfo(null, result)))
      .catch(err => this.setState({ userInfo: null, errMessage: err }, () => log.Creator.getProfileInfo(err)));
  };


  // URL 파라미터 유저 identification GET
  getParam = () => decodeURI(window.location.pathname.split("/")[1]);


  //업로드 탭에서 문서 목록 GET, AuthorSummary에서 계산 위해 사용
  getUploadDocumentList = (result: any) => this.setState({ uploadDocumentList: result });


  //투표 탭에서 문서 목록 GET, AuthorSummary에서 계산 위해 사용
  getVoteDocumentList = (result: any) => this.setState({ voteDocumentList: result });


  componentWillMount(): void {
    this.init();
  }

  render() {
    const { getMyInfo } = this.props;
    const { userInfo, errMessage, uploadDocumentList, voteDocumentList } = this.state;

    if(APP_PROPERTIES.ssr)  return (<LoadingModal/>);

    let param = this.getParam();

    return (
      <section className="mb-5 u__center container">
        <Helmet>
          {userInfo ? <title>{param + " | Polaris Share"}</title> : <title>{"Polaris Share"}</title>}
        </Helmet>

        {userInfo &&
        <CreatorSummaryContainer
          uploadDocumentList={uploadDocumentList.resultList}
          uploadTotalViewCountInfo={uploadDocumentList.totalViewCountInfo}
          voteDocumentList={voteDocumentList.resultList}
          voteTotalViewCountInfo={voteDocumentList.totalViewCountInfo}
          latestRewardVoteList={voteDocumentList.latestRewardVoteList}
          userInfo={userInfo}/>
        }

        {!userInfo && !errMessage &&
        <div className="spinner"><ThreeBounce name="ball-pulse-sync" color="#3681fe"/></div>}

        {errMessage && <NotFoundPage errMessage={errMessage}/>}

        {userInfo &&
        <Tabs forceRenderTabPanel={true}>
          <TabList>
            <Tab>{psString("profile-uploaded")}</Tab>
            <Tab>{psString("profile-voted")}</Tab>
            {(param === getMyInfo.username || param === getMyInfo.email || param === common_view.getMySub()) &&
            <Tab>{psString("profile-analytics")}</Tab>}
          </TabList>

          <TabPanel>
            <CreatorUploadTabContainer
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

          {(param === getMyInfo.username || param === getMyInfo.email || param === common_view.getMySub()) &&
          <TabPanel>
            <CuratorAnalyticsTabContainer userInfo={userInfo}/>
          </TabPanel>
          }

        </Tabs>
        }
      </section>

    );
  }
}

export default Creator;
