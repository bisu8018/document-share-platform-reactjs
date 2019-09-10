import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter, matchPath } from "react-router";
import { Provider } from "react-redux";
import MainContainer from "./container/MainContainer";
import configureStore from "./redux/store/configureStore";
import routeConfig from "./config/routerList";


// 스토어 생성
const store = configureStore();


// 서버 GET DATA, SET STATE in REDUX
const setState = state => {
  return new Promise((resolve, reject) => {
    if(!state) resolve();
    for (let s in state) {
      const { setAction } = state.hasOwnProperty(s) ? require(`./redux/reducer/${s}`) : false;
      for (let r in state[s]) {
        if(state[s][r]) store.dispatch(setAction[r](state[s][r]));
      }
    }
    resolve();
  });
};


// 서버 렌더 함수
const serverRender = async (req, state) => {
  await setState(state);

  // TODO: handle requests
  const promises = [];
  const { url, path } = req;

  routeConfig.forEach(route => {
    const match = matchPath(path, route);
    if (match && route.component.preload)
      promises.push(route.component.preload(store, match.params, req));
  });

  let error = null;
  try {
    await Promise.all(promises);
  } catch (e) {
    error = e;
  }

  const html = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={url}>
        <MainContainer/>
      </StaticRouter>
    </Provider>
  );

  return {
    html,
    state: store.getState(),
    error
  };
};


export default serverRender;
