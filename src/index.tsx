import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

const hist = createBrowserHistory();

ReactDOM.render(<Router history={hist}>
    <Switch>
      <Route path="/admin" render={props => <App {...props} />} />
      <Redirect from="/" to="/admin/dashboard" />
    </Switch>
  </Router>, document.getElementById('root'));


serviceWorker.unregister();
