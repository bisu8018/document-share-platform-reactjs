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
import log from "../config/log";

class Main extends Component {
  state = {
    initData: false,
    initDom: false
  };


  //초기화
  init = () => {
    log.Main.init();

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

    return MainRepository.Document.getTagList("latest")
      .then(result => setTagList(result.resultList), err => log.Main.setTagList(err))
      .then(log.Main.setTagList());
  };


  //업로드 태그 리스트 GET
  setUploadTagList = () => {
    const { setUploadTagList } = this.props;

    return MainRepository.Document.getTagList("latest")
      .then(result => setUploadTagList(result.resultList), err => log.Main.setUploadTagList(err))
      .then(log.Main.setUploadTagList());
  };


  // 내 정보 GET
  setMyInfo = () => {
    const { getMyInfo, setMyInfo } = this.props;
    if (MainRepository.Account.isAuthenticated() && getMyInfo.email.length === 0) {
      let myInfo = MainRepository.Account.getMyInfo();
      MainRepository.Account.getAccountInfo(myInfo.sub).then(result => {
        let res = new UserInfo(result);
        if (!result.picture) res.picture = localStorage.getItem("user_info").picture;
        log.Main.setMyInfo();
        return setMyInfo(res);
      }, err => log.Main.setMyInfo(err));
    }
  };


  // 모바일 유무 GET
  setIsMobile = () => {
    const { setIsMobile } = this.props;
    if (document.documentElement.clientWidth < 576) setIsMobile(true);
    else setIsMobile(false);

    return log.Main.setIsMobile();
  };


  // 크리에이터 리워드풀 GET
  setAuthorDailyRewardPool = () => {
    const { setAuthorDailyRewardPool } = this.props;
    let pool = 115068493148000000000000;
    setAuthorDailyRewardPool(pool);    // web3 speed issue, 리워드풀 하드코딩
    return log.Main.setAuthorDailyRewardPool(null, pool);
  };


  // 큐레이터 리워드풀 GET
  setCuratorDailyRewardPool = () => {
    const { setCuratorDailyRewardPool } = this.props;
    let pool = 49315068492000000000000;
    setCuratorDailyRewardPool(pool);   // web3 speed issue, 리워드풀 하드코딩
    return log.Main.setCuratorDailyRewardPool(null, pool);
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


  render() {
    const { getMyInfo } = this.props;
    const { initData, initDom } = this.state;

    let flag = !initData || !initDom || (MainRepository.Account.isAuthenticated() && getMyInfo.email.length === 0);

    if (!flag) common.setBodyStyleUnlock();
    else {
      common.setBodyStyleLock();
      return (<LoadingModal/>);
    }

    return (
      <Router history={history}>
        <HeaderContainer/>



        <div id="container" data-parallax="true">
          <CookiePolicyModal/>
          <DollarPolicyModal/>
          <Switch>
            {RouterList.routes.map((result, idx) => {
                let flag = false;
                if (idx === 0) flag = true;
                return (
                  <Route exact={flag} key={result.name} path={result.path}
                         render={(props) => <result.component {...props} />}
                  />
                );
              }
            )}
          </Switch>
        </div>


        <Footer/>


        <AlertListContainer/>
      </Router>

    );
  }
}

export default Main;
