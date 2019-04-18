import React, { Component } from "react";
import { Route, Router, Switch } from "react-router-dom";
import ReactGA from "react-ga";

import history from "apis/history/history";

import RouterList from "../util/RouterList";
import MainRepository from "../redux/MainRepository";
import GuideModal from "./modal/GuideModal";
import CookiePolicyModal from "./modal/CookiePolicyModal";
import UserInfo from "../redux/model/UserInfo";
import * as Sentry from "@sentry/browser";
import HeaderContainer from "../container/header/HeaderContainer";
import Common from "../util/Common";

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
    myInfo: new UserInfo(),
  };

  //초기화
  init = () => {
    MainRepository.init(() => {
      this.setTagList();  //태그 리스트 GET
      this.setMyInfo();   // 내 정보 GET
      this.setIsMobile();   // 모바일 유무 GET
    });
  };

  //태그 리스트 GET
  setTagList = () => {
    MainRepository.Document.getTagList(result => {
      this.props.setTagList(result.resultList);
    });
  };

  // 내 정보 GET
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

  // 모바일 유무 GET
  setIsMobile = () => {
    if (document.documentElement.clientWidth < 576) {
      this.props.setIsMobile(true);
    } else {
      this.props.setIsMobile(false);
    }
  };

  componentWillMount() {
    this.init();
  }

  componentDidCatch(error, errorInfo) {
    // [2019-04-10]   센트리 에러 체킹
    // https://docs.sentry.io/platforms/javascript/react/?_ga=2.47401252.280930552.1554857590-1128220521.1554857590
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
    const { getIsMobile } = this.props;

    let pathName = window.location.pathname.split("/")[1];
    let guidedValue = Common.getCookie("gv");
    let pathNameFlag =
      pathName === "latest" ||
      pathName === "featured" ||
      pathName === "popular";

    return (

      <Router history={history}>
        <div id="container-wrapper">
          <HeaderContainer/>

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
                               <result.component {...props} />}
                      />
                    );
                  }
                )}
              </Switch>
            </div>
          </div>

          {pathNameFlag && getIsMobile === false && (!guidedValue || guidedValue === "false") && <GuideModal/>}
          <CookiePolicyModal/>

        </div>
      </Router>

    );
  }
}

export default Main;