import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./redux/store/configureStore";
import MainContainer from "./container/MainContainer";
import { BrowserRouter } from "react-router-dom";
import registerServiceWorker from "client/src/apis/registerServiceWorker";
import "client/src/assets/scss/index.scss"; // 카로쉘 css
import "assets/scss/ssr/carousel.css"; // 카로쉘 css
import "assets/scss/ssr/main.css"; // 카로쉘 css
import "assets/scss/ssr/react-tabs.less"; // 탭 css
import "assets/scss/ssr/react-tabs.scss"; // 탭 css
import "assets/scss/ssr/react-tagsinput.css"; // 탭 css

export let store = configureStore(window.__PRELOADED_STATE__); // 스토어 생성

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <MainContainer/>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);


// 서비스 워커 등록 및 구동
registerServiceWorker();
