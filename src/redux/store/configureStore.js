import rootReducer from '../reducer';
import storeLogger from './storeLogger';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware  } from "redux";

export default () => {
  let store: *;
  store = createStore(
    rootReducer,
    applyMiddleware(thunk));
  if (!process.env.NODE_ENV_SUB === "production" && !process.env.NODE_ENV_SUB === "development" ) store = createStore(rootReducer, applyMiddleware(storeLogger));

  return store;
}



/*
import rootReducer from "../reducer";
import storeLogger from "./storeLogger";
import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";

let isDevelopment = process.env.NODE_ENV === "development"; // 환경이 개발모드인지 확인합니다
const composeEnhancers = isDevelopment ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose) : compose;

const configureStore =  (initialState) => {
  let store: *;

  store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk, storeLogger)));
    //composeEnhancers(applyMiddleware(thunk)));

  // hot-reloading 를 위한 코드
  if(module.hot) {
    module.hot.accept('../reducer', () => {
      const nextRootReducer = require('../reducer').default;
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
};

export default configureStore;*/
