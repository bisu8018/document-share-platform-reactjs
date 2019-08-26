import React, { Component } from "react";
import { Route, Router, Switch } from "react-router-dom";
import history from "../apis/history/history";

import RouterList from "../config/routerList";
import MainRepository from "../redux/MainRepository";
import CookiePolicyModal from "./common/modal/CookiePolicyModal";
import HeaderContainer from "../container/header/HeaderContainer";
import Footer from "./footer/Footer";

import "react-tabs/style/react-tabs.css";
import "react-tagsinput/react-tagsinput.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import AlertListContainer from "../container/common/alert/AlertListContainer";
import DollarPolicyModal from "./common/modal/DollarPolicyModal";
import LoadingModal from "./common/modal/LoadingModal";
import log from "../config/log";
import { APP_PROPERTIES } from "../properties/app.properties";
import common_view from "../common/common_view";

class Main extends Component {
  state = {
    initData: false
  };


  //초기화
  init = () => {
    if (APP_PROPERTIES.ssr) return Promise.resolve().then(() => this.setInitData());

    log.Main.init();
    history.listen(MainRepository.Analytics.sendPageView);

    MainRepository.init(() => {

      Promise.resolve()
      //태그 리스트 GET
        .then(() => this.setTagList())
        // 업로드 태그 리스트 GET
        .then(() => this.setUploadTagList())
        // 내 정보 GET
        .then(() => this.setMyInfo())
        // 모바일 유무 GET
        .then(() => this.setIsMobile())
        // Web3 GET
        .then(() => this.setWeb3Apis())
        // Drizzle GET
        .then(() => this.setDrizzleApis())
        // 크리에이터 리워드풀 GET
        .then(() => this.setAuthorDailyRewardPool())
        // 큐레이터 리워드풀 GET
        .then(() => this.setCuratorDailyRewardPool())
        // 초기화 완료
        .then(() => this.setInitData());
    });
  };


  //태그 리스트 GET
  setTagList = () => {
    const { setTagList } = this.props;

    return MainRepository.Document.getTagList("latest")
      .then(result => setTagList(result.resultList))
      .catch(err => log.Main.setTagList(err))
      .then(log.Main.setTagList());
  };


  //업로드 태그 리스트 GET
  setUploadTagList = () => {
    const { setUploadTagList } = this.props;

    return MainRepository.Document.getTagList("latest")
      .then(result => setUploadTagList(result.resultList))
      .catch(err => log.Main.setUploadTagList(err))
      .then(log.Main.setUploadTagList());
  };


  // 내 정보 GET
  setMyInfo = () => {
    const { getMyInfo, setMyInfo } = this.props;
    if (MainRepository.Account.isAuthenticated() && getMyInfo.email.length === 0) {
      let myInfo = MainRepository.Account.getMyInfo();
      MainRepository.Account.getAccountInfo(myInfo.sub).then(result => {
        let res = result.user;
        if (!res.username || !res.username === "") res.username = res.email;
        res.privateDocumentCount = result.privateDocumentCount;
        if (!res.picture) res.picture = localStorage.getItem("user_info").picture;
        log.Main.setMyInfo();
        return setMyInfo(res);
      }).catch(err => log.Main.setMyInfo(err));
    }
  };


  // 모바일 유무 GET
  setIsMobile = () => {
    const { setIsMobile } = this.props;

    if (document.documentElement.clientWidth < 576) setIsMobile(true);
    else setIsMobile(false);

    log.Main.setIsMobile();

    return Promise.resolve();
  };


  // Web3 GET
  setWeb3Apis = () => {
    this.props.setWeb3Apis();
    log.Main.setWeb3Apis();
    return Promise.resolve();
  };


  // Web3 GET
  setDrizzleApis = () => {
    this.props.setDrizzleApis();
    log.Main.setDrizzleApis();
    return Promise.resolve();
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


  // get Main component
  getMainComponent = () => {
    return (
      <div>
        <HeaderContainer/>
        <div id='container' data-parallax='true'>
          <CookiePolicyModal/>
          <DollarPolicyModal/>
          <Switch>
            {RouterList.map((result, idx) => {
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
      </div>
    );
  };


  componentWillMount() {
    this.init();
  }


  render() {
    const { getMyInfo } = this.props;
    const { initData } = this.state;

    if (APP_PROPERTIES.ssr) return this.getMainComponent();
    if (initData && (MainRepository.Account.isAuthenticated() ? getMyInfo.email.length !== 0 : true))
      common_view.setBodyStyleUnlock();
    else {
      common_view.setBodyStyleLock();
      return (<LoadingModal/>);
    }
    return <Router history={history}>{this.getMainComponent()}</Router>;

  }

}

export default Main;
