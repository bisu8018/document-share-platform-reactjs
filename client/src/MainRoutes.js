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

// import drizzle functions and contract artifact
import { Drizzle, generateStore } from "drizzle";
import DocumentReg from "contracts/DocumentReg.json";
import Deck from "contracts/Deck.json";

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
const options = { contracts: [DocumentReg, Deck] };
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
    const { classes, ...rest } = this.props;
    //console.log("rest", rest);
    //if (this.state.loading) return (<Callback {...this.props} message="Loading Drizzle...." />);

    return (

      <div>
        <Header
          brand="DECOMPANY.io"
          rightLinks={<HeaderLinks auth={auth}
              drizzleState={this.state.drizzleState}
              drizzle={drizzle} />}
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
          drizzle={drizzle} />

        <Router history={history}>
          <Switch>
            <Route exact path="/" render={(props) => <App drizzle={drizzle} drizzleState={this.state.drizzleState} auth={auth} {...props} />} />
            <Route path="/content/view/:documentId" render={(props) => <ContentView drizzle={drizzle} drizzleState={this.state.drizzleState} auth={auth} {...props} />} />
            <Route path="/author/:email" render={(props) => <Author drizzle={drizzle} drizzleState={this.state.drizzleState} auth={auth} {...props} />} />
            <Route path="/curator/:email" render={(props) => <Author drizzle={drizzle} drizzleState={this.state.drizzleState} auth={auth} {...props} />} />
            <Route path="/callback" render={(props) => {
              handleAuthentication(props);
              return <Callback {...props} />
            }} />
          </Switch>
        </Router>
      </div>
    );
  }
}
export default MainRoutes;
