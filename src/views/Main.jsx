import React, { Component } from "react";
import { Route, Router, Switch } from "react-router-dom";
import ReactGA from "react-ga";

import history from "apis/history/history";
import Auth from "apis/auth/auth";
import DrizzleApis from "apis/DrizzleApis";

import Header from "views/header/Header";
import Callback from "./body/callback/callback";

import RouterList from "../common/RouterList";
import MainRepository from "../redux/MainRepository";

if (process.env.NODE_ENV === "production") {
  ReactGA.initialize("UA-129300994-1", {
    debug: false,
    gaOptions: {
      env: process.env.NODE_ENV
    }
  });
  //console.log("google analytics on!!!", process.env)
} else {

  //console.log("google analytics off!!!")
}

const auth = new Auth();

const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

//hubspot tracking
let _hsq = window._hsq = window._hsq || [];

class Main extends Component {
  state = {
    loading: true,
    drizzleState: null,
    drizzleApis: null,
    tagList: []
  };

  sendPageView = () => {
    _hsq.push(["setPath", window.location.pathname + window.location.search]);
    _hsq.push(["trackPageView"]);

    ReactGA.pageview(window.location.pathname + window.location.search);
  };

  getTagList = () => {
    MainRepository.Document.getTagList(result => {
      this.setState({ tagList: result.resultList });
    });
  };

  componentWillMount() {
    const drizzleApis = new DrizzleApis((drizzleApis) => {
      this.setState({ drizzleApis: drizzleApis });
    });
    this.setState({ drizzleApis: drizzleApis });
    this.getTagList();
  }

  componentDidMount() {
    this.sendPageView(history.location);
    history.listen(this.sendPageView);
  }

  render() {
    const { drizzleApis, drizzleState, tagList  } = this.state;
    return (

      <Router history={history}>
        <div>
          <Header
            brand="decompany.io"
            drizzleApis={drizzleApis}
            tagList={tagList}
            fixed
            auth={auth}
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
                                                 auth={auth} {...props} />}
                      />
                    );
                  }
                )}

                <Route path="/callback" render={(props) => {
                  handleAuthentication(props);
                  return <Callback {...props} />;
                }}/>
              </Switch>
            </div>
          </div>
        </div>
      </Router>

    );
  }
}

export default Main;