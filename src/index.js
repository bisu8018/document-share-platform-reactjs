import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import "assets/css/custom.css";
import "assets/scss/material-kit-react.css?v=1.3.0";

import registerServiceWorker from "./config/registerServiceWorker";


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
