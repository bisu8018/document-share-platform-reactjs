import React, { Component } from "react";
import { Route, Router, Switch } from "react-router-dom";
import ReactGA from "react-ga";

import history from "apis/history/history";
import DrizzleApis from "apis/DrizzleApis";

import Header from "views/header/Header";
import Callback from "./body/callback/callback";
import RouterList from "../common/RouterList";
import MainRepository from "../redux/MainRepository";
import GuideModal from "../components/modal/GuideModal";

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
    loading: true,
    drizzleState: null,
    drizzleApis: null,
    tagList: []
  };

  getTagList = () => {
    MainRepository.Document.getTagList(result => {
      this.setState({ tagList: result.resultList });
    });
  };

  componentWillMount() {
    MainRepository.init();
    const drizzleApis = new DrizzleApis((drizzleApis) => {
      this.setState({ drizzleApis: drizzleApis });
    });
    this.setState({ drizzleApis: drizzleApis });
    this.getTagList();
  }

  componentDidMount() {
    history.listen(MainRepository.Analytics.sendPageView);
  }
  render() {
    const { drizzleApis, drizzleState, tagList } = this.state;
    let pathName =
      history.location.pathname === "/latest" ||
      history.location.pathname === "/featured" ||
      history.location.pathname === "/popular";

    return (

      <Router history={history}>
        <div id="container-wrapper">

          <Header
            brand="decompany.io"
            drizzleApis={drizzleApis}
            tagList={tagList}
            fixed
            color="white"
          />

          <div id="container" data-parallax="true">
            <div className="container">
              <Switch>
                {RouterList.routes.map((result, idx) => {
                    let flag = false;
                    if (idx === 0) {
                      flag = true;
                    }
                    return (
                      <Route exact={flag} key={result.name}
                             path={result.path}
                             render={(props) =>
                               <result.component drizzleApis={drizzleApis}
                                                 drizzleState={drizzleState}
                                                 tagList={tagList}
                                                 {...props} />}
                      />
                    );
                  }
                )}
                <Route path="/callback" render={(props) => {
                  MainRepository.Account.handleAuthentication(props);
                  return <Callback {...props} />;
                }}/>
              </Switch>
            </div>
          </div>
          {pathName  && <GuideModal/>}

        </div>
      </Router>

    );
  }
}

export default Main;