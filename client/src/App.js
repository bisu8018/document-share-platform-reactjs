import { APP_PROPERTIES } from './resources/app.properties';

import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import logo from './logo.svg';
import './App.css';
import DocList from "./list/List";
import DocDetail from "./detail/Detail";
import SignIn from "./signin/SignIn";
import Footer from "./footer/Footer";
import Upload from "./upload/Upload";
import Callback from "./callback/callback";

import * as restapi from './apis/DocApi';
import * as authApi from './apis/AuthApis';


const VIEW_LIST = ["list", "upload", "detail"];

class App extends Component {
  state = { loading: true, currentView:"list", authenticated:true, resultList:[], selected: null, fetching:false };

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

  fetchDocuments = (params) => {

      console.log("fetchDocument start");
      this.setState({fetching:true})
      restapi.getDocuments(params).then((res)=>{
        console.log("Fetch Document", res.data.resultList);
        if(res.data.resultList) {
            this.setState({resultList:res.data.resultList});
        }
      });

  }

  componentDidMount() {
    const { drizzle, auth } = this.props;
    console.log("componentDidMount");
    this.fetchDocuments();
  }

  compomentWillUnmount() {

  }

  render() {
    const { drizzle, drizzleState, auth } = this.props;
    //console.log("state.loading : " + this.state.loading);
    //console.log("currentView", this.state.currentView);
    //console.log("auth info", auth.getSession(), "isAuthenticated", auth.isAuthenticated(), APP_PROPERTIES);
    //console.log("process.env", process.env);

    return (

      <div className="App">

        {(this.state.authenticated && this.state.currentView == "list") && <DocList resultList={this.state.resultList} handler={this.handleChangeView} handleSelectDocument={this.handleSelectDocument} currentView={this.state.currentView}/>}
        {(this.state.authenticated && this.state.currentView == "detail") && <DocDetail selected={this.state.selected}/>}

        <Footer handler={this.handleChangeView} />
      </div>


    );
  }
}

export default App;
