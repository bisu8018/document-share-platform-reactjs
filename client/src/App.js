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

class App extends Component {
  state = { loading: true, drizzleState: null, currentView:"list", authenticated:true, resultList:[], fetching:false };

  handleChangeView = (viewName) => {
    console.log("on event handleChangeView", viewName);
    this.setState({currentView:viewName})

  }

  fetchDocuments = async (nextKey) => {
      if(this.state.fetching==false) {
        this.setState({fetching:true})
        const docs = await restapi.getDocuments(nextKey);
        if(docs.data.body) {
            this.setState({resultList:docs.data.body});
        }

      }
  }

  componentDidMount() {
    const { drizzle } = this.props;
    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {

      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
      }

      if(this.state.resultList.length == 0){
        this.fetchDocuments();
      }
    });
  }

  compomentWillUnmount() {
    this.unsubscribe();
  }



  render() {
    //console.log("state.loading : " + this.state.loading);
    console.log("currentView", this.state.currentView);
    if (this.state.loading) return "Loading Drizzle...";
    return (

      <div className="App">

        <Header />
        {this.state.authenticated==false && <SignIn />}
        {(this.state.authenticated && this.state.currentView == "list") && <DocList resultList={this.state.resultList} handler={this.handleChangeView} currentView={this.state.currentView}/>}
        {(this.state.authenticated && this.state.currentView == "upload") && <Upload />}
        {(this.state.authenticated && this.state.currentView == "detail") && <DocDetail />}

        <ReadString
          drizzle={this.props.drizzle}
          drizzleState={this.state.drizzleState}
        />

        <SetString
          drizzle={this.props.drizzle}
          drizzleState={this.state.drizzleState}
        />

        <Footer />
      </div>


    );
  }
}

export default App;
