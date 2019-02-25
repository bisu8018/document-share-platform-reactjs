import React, { Component } from "react";
import { Route, Router, Switch } from "react-router-dom";

import ReactGA from "react-ga";

import history from "apis/history/history";
import Auth from "apis/auth/auth";
import DrizzleApis from "apis/DrizzleApis";

import Header from "views/header/Header";
import HeaderSub from "./header/HeaderSub";
import HeaderLinks from "./header/HeaderLinks";
import Callback from "./body/callback/callback";

import RouterList from "../common/RouterList";

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

const handleLogout = () => {
  auth.logout();
};

//hubspot tracking
let _hsq = window._hsq = window._hsq || [];

class Main extends Component {
  state = { loading: true, drizzleState: null, drizzleApis: null };

  componentWillMount() {
    // subscribe to changes in the store
    //console.log("env", process.env);
    //auth.syncUser();

    const drizzleApis = new DrizzleApis((drizzleApis, drizzle, drizzleState) => {
      //console.log("MainRoutes", drizzleApis, drizzle, drizzleState);
      this.setState({ drizzleApis: drizzleApis });
    });
    this.setState({ drizzleApis: drizzleApis });
  }

  componentDidMount() {
    this.sendPageView(history.location);
    history.listen(this.sendPageView);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  sendPageView = () => {
    //hubspot tracking
    //console.log("Tracking sendPageView event", window.location.pathname + window.location.search)
    _hsq.push(["setPath", window.location.pathname + window.location.search]);
    _hsq.push(["trackPageView"]);

    //hubspot tracking
    ReactGA.pageview(window.location.pathname + window.location.search);
  };

  render() {
    return (

      <Router history={history}>
        <div>
          <Header
            brand="decompany.io"
            rightLinks={<HeaderLinks drizzleApis={this.state.drizzleApis} auth={auth}/>}
            drizzleApis={this.state.drizzleApis}
            fixed
            auth={auth}
            color="white"
          />

          <HeaderSub drizzleApis={this.state.drizzleApis}/>

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
                           <result.component drizzleApis={this.state.drizzleApis}
                                             drizzleState={this.state.drizzleState}
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
      </Router>

    );
  }
}

export default Main;