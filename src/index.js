import React from "react";
import ReactDOM from "react-dom";
import MainRoutes from "./MainRoutes"
import registerServiceWorker from "./registerServiceWorker";

//import { makeMainRoutes } from './routes';

//const routes = makeMainRoutes();

import "assets/scss/material-kit-react.css?v=1.3.0";
import "assets/css/custom.css";

// pass in the drizzle instance
ReactDOM.render(<MainRoutes />, document.getElementById("root"));
registerServiceWorker();
