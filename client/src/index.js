import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";



import { makeMainRoutes } from './routes';

const routes = makeMainRoutes();




// pass in the drizzle instance
ReactDOM.render(routes, document.getElementById("root"));
registerServiceWorker();
