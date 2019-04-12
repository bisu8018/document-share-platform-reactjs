import rootReducer from '../reducer';
import storeLogger from './storeLogger';
import { createStore, applyMiddleware  } from "redux";

export default () => {
  let store: *;
  store = createStore(rootReducer);
  if (!process.env.NODE_ENV === "production") store = createStore(rootReducer, applyMiddleware(storeLogger));

  return store;
}