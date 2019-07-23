import React, { Component } from "react";
import { Route, Router, Switch } from "react-router-dom";
import history from "apis/history/history";

import RouterList from "../config/routerList";
import MainRepository from "../redux/MainRepository";
import CookiePolicyModal from "./common/modal/CookiePolicyModal";
import UserInfo from "../redux/model/UserInfo";
import HeaderContainer from "../container/header/HeaderContainer";
import Footer from "./footer/Footer";

import "react-tabs/style/react-tabs.css";
import "react-tagsinput/react-tagsinput.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import AlertListContainer from "../container/common/alert/AlertListContainer";
import DollarPolicyModal from "./common/modal/DollarPolicyModal";
import LoadingModal from "./common/modal/LoadingModal";
import common from "../config/common";

class Main extends Component {
  state = {
    initData: false,
    initDom: false
  };


  //초기화
  init = () => {
    MainRepository.init(() => {
      //태그 리스트 GET
      this.setTagList()
      // 업로드 태그 리스트 GET
        .then(this.setUploadTagList())
        // 내 정보 GET
        .then(this.setMyInfo())
        // 모바일 유무 GET
        .then(this.setIsMobile())
        // 크리에이터 리워드풀 GET
        .then(this.setAuthorDailyRewardPool())
        // 큐레이터 리워드풀 GET
        .then(this.setCuratorDailyRewardPool())
        // 초기화 완료
        .then(this.setInitData());
    });
  };


  //태그 리스트 GET
  setTagList = () => {
    const { setTagList } = this.props;

    return MainRepository.Document.getTagList("featured")
      .then(result => setTagList(result.resultList),err => err);
  };


  //업로드 태그 리스트 GET
  setUploadTagList = () => {
    const { setUploadTagList } = this.props;

    return MainRepository.Document.getTagList("latest")
      .then(result => setUploadTagList(result.resultList),err => err);
  };


  // 내 정보 GET
  setMyInfo = () => {
    const { getMyInfo, setMyInfo } = this.props;

    if (MainRepository.Account.isAuthenticated() && getMyInfo.email.length === 0) {
      let myInfo = MainRepository.Account.getMyInfo();
      return MainRepository.Account.getAccountInfo(myInfo.sub).then(result => {
        let res = new UserInfo(result);
        if (!result.picture) res.picture = localStorage.getItem("user_info").picture;
        setMyInfo(res);
      },err => err);
    }
  };


  // 모바일 유무 GET
  setIsMobile = () => {
    const { setIsMobile } = this.props;
    if (document.documentElement.clientWidth < 576) return setIsMobile(true);
    else return setIsMobile(false);
  };


  // 크리에이터 리워드풀 GET
  setAuthorDailyRewardPool = () => {
    const { setAuthorDailyRewardPool } = this.props;
    return setAuthorDailyRewardPool(115068493148000000000000);    // web3 speed issue, 리워드풀 하드코딩
  };


  // 큐레이터 리워드풀 GET
  setCuratorDailyRewardPool = () => {
    const { setCuratorDailyRewardPool } = this.props;
    return setCuratorDailyRewardPool(49315068492000000000000);   // web3 speed issue, 리워드풀 하드코딩
  };


  //init 데이터 SET
  setInitData = () => {
    return this.setState({ initData: true });
  };


  componentWillMount() {
    this.init();
    history.listen(MainRepository.Analytics.sendPageView);
  }


  componentDidMount() {
    this.setState({ initDom: true });
  }

  /*  componentDidCatch(error, errorInfo) {
      // [2019-04-10]   센트리 에러 체킹
      // https://docs.sentry.io/platforms/javascript/react/?_ga=2.47401252.280930552.1554857590-1128220521.1554857590
      if (process.env.NODE_ENV === "production") {
        this.setState({ error });
        console.error("errorInfo", error);
        Sentry.withScope(scope => {
          scope.setExtras(errorInfo);
          const eventId = Sentry.captureException(error);
          this.setState({ eventId });
        });
      }
    }*/

  render() {
    const { getMyInfo } = this.props;
    const { initData, initDom } = this.state;

    let flag = !initData || !initDom || (MainRepository.Account.isAuthenticated() && getMyInfo.email.length === 0);

    if(!flag) common.setBodyStyleUnlock();
    else  {
      common.setBodyStyleLock();
      return (<LoadingModal/>);
    }

    return (
      <Router history={history}>
        <div id="container-wrapper">
          <HeaderContainer/>


          <div id="container" data-parallax="true">
            <CookiePolicyModal/>
            <DollarPolicyModal/>
            <div className="container">
              <Switch>
                {RouterList.routes.map((result, idx) => {
                    let flag = false;
                    if (idx === 0) flag = true;
                    return (
                      <Route exact={flag} key={result.name} path={result.path}
                             render={(props) =>
                               <result.component {...props} />}
                      />
                    );
                  }
                )}
              </Switch>
            </div>
          </div>


          <Footer/>


          <AlertListContainer/>

        </div>
      </Router>

    );
  }
}

export default Main;
