import { APP_PROPERTIES } from './resources/app.properties';

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ContentList from "contents/ContentList"

import * as restapi from 'apis/DocApi';

class App extends Component {
  state = { loading: true, resultList:[], selected: null, fetching:false };

  fetchDocuments = (params) => {

      console.log("fetchDocument start");
      this.setState({fetching:true})
      restapi.getDocuments(params).then((res)=>{
        console.log("Fetch Document", res.data.resultList);
        if(res.data.resultList) {
            this.setState({resultList: res.data.resultList});
        }
      });

  }

  componentDidMount() {
    this.fetchDocuments();
  }

  compomentWillUnmount() {

  }


  render() {
    const { classes, ...rest } = this.props;
    return (

        <ContentList {...this.props} resultList={this.state.resultList}/>
          /*
          <CardList />
          <CardView />
          <AuthorPage />
          */
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
