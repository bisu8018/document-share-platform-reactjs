import React, { Component } from 'react';
import { Route, Router, Link } from 'react-router-dom';
import App from './App';
import Callback from './callback/callback';
import Auth from './auth/auth';
import history from './history';

import Header from "./header/Header";
import TopMenu from "./header/TopMenu";
import DocList from "./list/List";
import DocDetail from "./detail/Detail";
import Upload from "./upload/Upload";

// import drizzle functions and contract artifact
import { Drizzle, generateStore } from "drizzle";
import MyStringStore from "./contracts/MyStringStore.json";
import DocumentRegistry from "./contracts/DocumentRegistry.json";

const auth = new Auth();

const handleAuthentication = ({location}) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
}

const handleLogout = ({location}) => {
  auth.logout();
}

// let drizzle know what contracts we want
const options = { contracts: [DocumentRegistry, MyStringStore] };
// setup the drizzle store and drizzle
const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);



class MainRoutes extends Component {
  state = { loading: true, drizzleState: null};
  componentDidMount() {

    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {

      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
      }

    });
  }

  compomentWillUnmount() {
    this.unsubscribe();
  }

  render() {

    if (this.state.loading) return (<Callback {...this.props} message="Loading Drizzle...." />);

    return (
        <Router history={history}>
          <div>
            <Header auth={auth} />
            <TopMenu auth={auth} {...this.props} />
            <Route exact path="/" render={(props) => <App drizzle={drizzle} drizzleState={this.state.drizzleState} auth={auth} {...props} />} />
            <Route path="/upload" render={(props) => <Upload drizzle={drizzle} drizzleState={this.state.drizzleState} auth={auth} {...props} />} />
            <Route path="/callback" render={(props) => {
              handleAuthentication(props);
              return <Callback {...props} />
            }}/>
          </div>
        </Router>
    );
  }
}
export default MainRoutes;
