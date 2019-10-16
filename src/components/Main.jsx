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
import LoadingModal from "./common/modal/LoadingModal";
import log from "../config/log";
import { APP_PROPERTIES } from "../properties/app.properties";
import common_view from "../common/common_view";
import { Helmet } from "react-helmet";
import ModalListContainer from "../container/common/modal/ModalListContainer";
import DollarPolicyModalContainer from "../container/common/modal/DollarPolicyModalContainer";


class Main extends Component {
  state = {
    initData: false
  };


  //초기화
  init = () => {
    if (APP_PROPERTIES.ssr)
      return Promise.resolve().then(() => this.setInitData());

    history.listen(MainRepository.Analytics.sendPageView);

    // 초기화 시작 LOG
    log.Main.init();

    MainRepository.init(() =>
      Promise.resolve()
        .then(() => {
          this.setTagList();    //태그 리스트 GET
          this.setUploadTagList();   // 업로드 태그 리스트 GET
          this.setIsMobile();     // 모바일 유무 GET
          this.setWeb3Apis();   // Web3 GET
          this.setDrizzleApis();   // Drizzle GET
          this.setAuthorDailyRewardPool();     // 크리에이터 리워드풀 GET
          this.setCuratorDailyRewardPool();    // 큐레이터 리워드풀 GET
          return this.setMyInfo();    // 내 정보 GET
        })
        // 찜 리스트 GET
        .then(() => this.setMyList())
        // 히스토리 리스트 GET
        .then(() => this.setHistory())
        // 초기화 완료
        .then(() => this.setInitData())
        // 에러 발생 체크
        .catch(() => this.setInitData())
    );
  };


  //태그 리스트 GET
  setTagList = () => {
    MainRepository.Document.getTagList("latest")
      .then(result => this.props.setTagList(result.resultList))
      .catch(err => log.Main.setTagList(err))
      .then(log.Main.setTagList());
  };


  //업로드 태그 리스트 GET
  setUploadTagList = () => {
    MainRepository.Document.getTagList("latest")
      .then(result => this.props.setUploadTagList(result.resultList))
      .catch(err => log.Main.setUploadTagList(err))
      .then(log.Main.setUploadTagList());
  };


  // 내 정보 GET
  setMyInfo = () => {
    const { getMyInfo, setMyInfo } = this.props;
    if (MainRepository.Account.isAuthenticated() && getMyInfo.email.length === 0) {
      let myInfo = MainRepository.Account.getMyInfo();
      return MainRepository.Account.getAccountInfo(myInfo.sub)
        .then(result => {
          let res = result.user;

          if (!res.username || !res.username === "") res.username = res.email;
          if (!res.picture) res.picture = localStorage.getItem("user_info").picture;

          res.privateDocumentCount = result.privateDocumentCount;
          log.Main.setMyInfo();

          return setMyInfo(res);
        })
        .catch(err => log.Main.setMyInfo(err));
    }
  };


  // 나의 찜 목록 GET
  setMyList = () => {
    const { getMyInfo, setMyList } = this.props;
    if (MainRepository.Account.isAuthenticated() && getMyInfo.sub.length !== 0) {
      return MainRepository.Document.getMyList(getMyInfo.sub)
        .then(res => setMyList({ resultList: res }));
    }
  };


  // 히스토리 목록 GET
  setHistory = () => {
    const { getMyInfo, setHistory } = this.props;
    if (MainRepository.Account.isAuthenticated() && getMyInfo.sub.length !== 0) {
      return MainRepository.Document.getHistory(getMyInfo.sub)
        .then(res => setHistory({ resultList: res }));
    }
  };


  // 모바일 유무 GET
  setIsMobile = () => {
    const { setIsMobile } = this.props;

    if (document.documentElement.clientWidth < 576) setIsMobile(true);
    else setIsMobile(false);

    log.Main.setIsMobile();
  };


  // Web3 GET
  setWeb3Apis = () => {
    this.props.setWeb3Apis();
    log.Main.setWeb3Apis();
  };


  // Web3 GET
  setDrizzleApis = () => {
    this.props.setDrizzleApis();
    log.Main.setDrizzleApis();
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
  setInitData = () => this.setState({ initData: true });


  // get Main component
  getMainComponent = () => {
    return (
      <div>
        <Helmet>
          <title>Polaris Share</title>
        </Helmet>

        <HeaderContainer/>
        <div id='container' data-parallax='true'>
          <CookiePolicyModal/>
          <DollarPolicyModalContainer/>
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
        <ModalListContainer/>
      </div>
    );
  };


  componentWillMount() {
    this.init();
  }


  render() {
    const { getMyInfo } = this.props;
    const { initData } = this.state;

    if (APP_PROPERTIES.ssr)
      return this.getMainComponent();
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
