import React, { Component } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import logobar from './logo_bar.svg';
import App from './App';
import Callback from './callback/callback';
import Auth from './auth/auth';
import history from './history';

import Header from "./header/Header";
import HeaderLinks from "./header/HeaderLinks";
import TopMenu from "./header/TopMenu";
import ContentView from "contents/ContentView";
import Author from "profile/Author";
import DrizzleApis from 'apis/DrizzleApis';


const auth = new Auth();

const handleAuthentication = ({location}) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
}

const handleLogout = ({location}) => {
  auth.logout();
}





class MainRoutes extends Component {
  state = { loading: true, drizzleState: null, drizzleApis: null};

  componentWillMount() {
    // subscribe to changes in the store
    const drizzleApis = new DrizzleApis((drizzleApis, drizzle, drizzleState) => {
      //console.log("MainRoutes", drizzleApis, drizzle, drizzleState);
      this.setState({drizzleApis: drizzleApis});
    });
    this.setState({drizzleApis: drizzleApis});
  }

  compomentWillUnmount() {

    this.unsubscribe();

  }

  render() {
    const { classes, ...rest } = this.props;
    //console.log("rest", rest);
    //if (this.state.loading) return (<Callback {...this.props} message="Loading Drizzle...." />);

    return (
      <Router history={history}>
      <div>
        <Header
          brand="DECOMPANY.io"
          rightLinks={<HeaderLinks
            drizzleState={this.state.drizzleState}
            drizzleApis={this.state.drizzleApis} />}
          fixed
          color="white"
          {...rest}
          {...this.props}
          auth={auth}
        />

        <TopMenu
          {...this.props}
          auth={auth}
          dirzzleState={this.state.drizzleState}
          drizzleApis={this.state.drizzleApis} />


          <Switch>
            <Route exact path="/" render={(props) => <App drizzleApis={this.state.drizzleApis} drizzleState={this.state.drizzleState} auth={auth} {...props} />} />
            <Route path="/tag/:tag" render={(props) => <App drizzleApis={this.state.drizzleApis} drizzleState={this.state.drizzleState} auth={auth} {...props} />} />
            <Route path="/content/view/:documentId" render={(props) => <ContentView drizzleApis={this.state.drizzleApis} drizzleState={this.state.drizzleState} auth={auth} {...props} />} />
            <Route path="/author/:email" render={(props) => <Author drizzleApis={this.state.drizzleApis} drizzleState={this.state.drizzleState} {...props} />} />
            <Route path="/curator/:email" render={(props) => <Author drizzleApis={this.state.drizzleApis} drizzleState={this.state.drizzleState} {...props} />} />
            <Route path="/callback" render={(props) => {
              handleAuthentication(props);
              return <Callback {...props} />
            }} />
          </Switch>

      </div>
      </Router>
    );
  }
}
export default MainRoutes;
