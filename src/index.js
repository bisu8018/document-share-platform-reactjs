import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./redux/store/configureStore";
import MainContainer from "./container/MainContainer";
import { BrowserRouter } from "react-router-dom";
//import registerServiceWorker from 'apis/registerServiceWorker';
import "assets/css/custom.css";
import "assets/css/ssr/carousel.css"; // 카로쉘 css
import "assets/css/ssr/main.css"; // 카로쉘 css
import "assets/css/ssr/carousel.css"; // 탭 css
import "assets/css/ssr/react-tabs.scss"; // 탭 css
import "assets/css/ssr/react-tagsinput.css"; // 탭 css

export let store = configureStore(window.__PRELOADED_STATE__); // 스토어 생성
document.getElementById("root").style.opacity = "1";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <MainContainer/>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root"));
//registerServiceWorker();
