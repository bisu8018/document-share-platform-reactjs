import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import MainRoutes from "./MainRoutes"
import registerServiceWorker from "./registerServiceWorker";

//import { makeMainRoutes } from './routes';

//const routes = makeMainRoutes();


// pass in the drizzle instance
ReactDOM.render(<MainRoutes />, document.getElementById("root"));
registerServiceWorker();
