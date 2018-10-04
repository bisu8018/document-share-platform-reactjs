import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import logo from './logo.svg';
import './App.css';
import ReadString from "./ReadString";
import SetString from "./SetString";

import Header from "./header/Header";
import DocList from "./list/List";
import DocDetail from "./detail/Detail";
import SignIn from "./signin/SignIn";
import Footer from "./footer/Footer";
import Upload from "./upload/Upload";

import * as restapi from './apis/DocApi';
import { APP_PROPERTIES } from './resources/app.properties';

const VIEW_LIST = ["list", "upload", "detail"];

class App extends Component {
  state = { loading: true, drizzleState: null, currentView:"list", authenticated:true, resultList:[], selected: null, fetching:false };

  handleChangeView = (viewName) => {
    console.log("on event handleChangeView", viewName);
    if(VIEW_LIST.includes(viewName)){
      this.setState({currentView:viewName});
    } else if("signin" == viewName) {
      this.props.auth.login();
    }
  }

  handleSelectDocument = (doc) => {
    this.setState({currentView:"detail", selected:doc});
  }

  fetchDocuments = async (params) => {
      if(this.state.fetching==false) {
        console.log("fetchDocument start");
        this.setState({fetching:true})
        restapi.getDocuments(params).then((res)=>{
          console.log("Fetch Document", res.data.resultList);
          if(res.data.resultList) {
              this.setState({resultList:res.data.resultList});
          }
        });
      }
  }

  componentDidMount() {
    const { drizzle, auth } = this.props;

    console.log("auth", auth);
    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {

      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
      }


      this.fetchDocuments();

    });
  }

  compomentWillUnmount() {
    this.unsubscribe();
  }



  render() {
    const { drizzle, auth } = this.props;
    //console.log("state.loading : " + this.state.loading);
    //console.log("currentView", this.state.currentView);
    console.log("auth info", auth.getSession(), "isAuthenticated", auth.isAuthenticated(), APP_PROPERTIES);
    if (this.state.loading) return "Loading Drizzle...";
    return (

      <div className="App">

        <Header />
        
        {this.state.authenticated==false && <SignIn />}
        {(this.state.authenticated && this.state.currentView == "list") && <DocList resultList={this.state.resultList} handler={this.handleChangeView} handleSelectDocument={this.handleSelectDocument} currentView={this.state.currentView}/>}
        {(this.state.authenticated && this.state.currentView == "upload") && <Upload />}
        {(this.state.authenticated && this.state.currentView == "detail") && <DocDetail selected={this.state.selected}/>}

        <ReadString
          drizzle={this.props.drizzle}
          drizzleState={this.state.drizzleState}
        />

        <SetString
          drizzle={this.props.drizzle}
          drizzleState={this.state.drizzleState}
        />

        <Footer handler={this.handleChangeView} />
      </div>


    );
  }
}

export default App;
