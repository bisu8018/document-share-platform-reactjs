import React, { Component } from "react";
import { Route, Router, Switch } from "react-router-dom";
import ReactGA from "react-ga";

import history from "apis/history/history";
import DrizzleApis from "apis/DrizzleApis";

import RouterList from "../util/RouterList";
import MainRepository from "../redux/MainRepository";
import GuideModal from "./modal/GuideModal";
import CookiePolicyModal from "./modal/CookiePolicyModal";
import UserInfo from "../redux/model/UserInfo";
import * as Sentry from "@sentry/browser";
import HeaderContainer from "../container/header/HeaderContainer";

if (process.env.NODE_ENV === "production") {
  ReactGA.initialize("UA-129300994-1", {
    debug: false,
    gaOptions: {
      env: process.env.NODE_ENV
    }
  });
  //console.log("google analytics on!!!", process.env)
}

class Main extends Component {
  state = {
    init: false,
    loading: true,
    myInfo: new UserInfo(),
    drizzleState: null,
    drizzleApis: null
  };

  init = () => {
    //초기화 진행
    MainRepository.init(() => {
    });

    const drizzleApis = new DrizzleApis((drizzleApis) => {
      this.setState({ drizzleApis: drizzleApis });
    });
    this.setState({ drizzleApis: drizzleApis });
    this.setTagList();  //태그 리스트 GET
    this.setMyInfo();   // 내 정보 GET
  };

  setTagList = () => {
    MainRepository.Document.getTagList(result => {
      this.props.setTagList(result.resultList);
    });
  };

  setMyInfo = () => {
    let reduxMyInfo = this.props.getMyInfo;
    if (MainRepository.Account.isAuthenticated() && reduxMyInfo.email.length === 0) {
      let myInfo = MainRepository.Account.getMyInfo();
      MainRepository.Account.getAccountInfo(myInfo.sub, result => {
        this.props.setMyInfo(result);
        this.setState({ init: true, myInfo: result });
      });
    }
  };

  componentWillMount() {
    this.init();
  }

  // [2019-04-10]   센트리 에러 체킹      https://docs.sentry.io/platforms/javascript/react/?_ga=2.47401252.280930552.1554857590-1128220521.1554857590
  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV === "production") {
      this.setState({ error });
      console.log("errorInfo", error);
      Sentry.withScope(scope => {
        scope.setExtras(errorInfo);
        const eventId = Sentry.captureException(error);
        this.setState({ eventId });
      });
    }
  }

  componentDidMount() {
    history.listen(MainRepository.Analytics.sendPageView);
  }

  render() {
    const { drizzleApis, drizzleState } = this.state;
    let pathName = window.location.pathname.split("/")[1];
    let pathNameFlag =
      pathName === "latest" ||
      pathName === "featured" ||
      pathName === "popular";
    return (

      <Router history={history}>
        <div id="container-wrapper">
          <HeaderContainer drizzleApis={drizzleApis}/>

          <div id="container" data-parallax="true">
            <div className="container">
              <Switch>
                {RouterList.routes.map((result, idx) => {
                    let flag = false;
                    if (idx === 0) {
                      flag = true;
                    }
                    return (
                      <Route exact={flag} key={result.name} path={result.path}
                             render={(props) =>
                               <result.component drizzleApis={drizzleApis}
                                                 drizzleState={drizzleState}
                                                 {...props} />}
                      />
                    );
                  }
                )}
              </Switch>
            </div>
          </div>

          {pathNameFlag && <GuideModal/>}
          <CookiePolicyModal/>

        </div>
      </Router>

    );
  }
}

export default Main;