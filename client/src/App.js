import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import logo from './logo.svg';
import './App.css';
import ReadString from "./ReadString";
import SetString from "./SetString";

import Header from "./header/Header";
import DocList from "./list/List";
import SignIn from "./signin/SignIn";
import Footer from "./footer/Footer";
import Upload from "./upload/Upload";


class App extends Component {
  state = { loading: true, drizzleState: null, view:"list", authenticated:true};

  componentDidMount() {
    const { drizzle } = this.props;
    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {

      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        console.log(drizzleState);
        this.setState({ loading: false, drizzleState });
      }
    });
  }

  compomentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    console.log("state.loading : " + this.state.loading);
    if (this.state.loading) return "Loading Drizzle...";
    return (

      <div className="App">

        <Header />
        {this.state.authenticated==false && <SignIn />}
        {(this.state.authenticated && this.state.view == "list") && <DocList />}
        {(this.state.authenticated && this.state.view == "upload") && <Upload />}

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
