import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./redux/store/configureStore";
import "assets/css/custom.css";
import MainContainer from "./container/MainContainer";
import { BrowserRouter } from "react-router-dom";

let windowFlag = typeof window !== "undefined";

export let store = configureStore(windowFlag ? window.__PRELOADED_STATE__ : null); // 스토어 생성

if (windowFlag) {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <MainContainer/>
      </BrowserRouter>
    </Provider>,
    document.getElementById("root")
  );
}

//registerServiceWorker();
