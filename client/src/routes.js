import React from 'react';
import { Route, Router } from 'react-router-dom';
import App from './App';
import Callback from './callback/callback';
import Auth from './auth/auth';
import history from './history';

import DocList from "./list/List";
import DocDetail from "./detail/Detail";
import Upload from "./upload/Upload";

// import drizzle functions and contract artifact
import { Drizzle, generateStore } from "drizzle";
import MyStringStore from "./contracts/MyStringStore.json";

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
const options = { contracts: [MyStringStore] };
// setup the drizzle store and drizzle
const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);



export const makeMainRoutes = () => {
  return (
      <Router history={history}>
        <div>
          <Route path="/" render={(props) => <App drizzle={drizzle} auth={auth} {...props} />} />
          <Route path="/upload" render={(props) => <Upload auth={auth} {...props} />} />
          <Route path="/callback" render={(props) => {
            handleAuthentication(props);
            return <Callback {...props} />
          }}/>
        <Route path="/logout" render={(props) => {
            handleLogout(props);
            return <Callback {...props} />
          }}/>
        </div>
      </Router>
  );
}
