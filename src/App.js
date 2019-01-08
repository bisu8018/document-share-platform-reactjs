import { APP_PROPERTIES } from './resources/app.properties';

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ContentList from "contents/ContentList"



class App extends Component {
  state = { loading: true, resultList:[], selected: null, fetching:false };

  componentDidMount() {
    //this.fetchDocuments();
  }

  compomentWillUnmount() {

  }


  render() {
    const { classes, ...rest } = this.props;
    return (
        <ContentList {...this.props}/>
    );
  }
  /*
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
  */
}

export default App;
