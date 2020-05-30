import React from 'react';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from './App';
import Blackboard from './Blackboard';
import "./index.css";
import View from './View';


ReactDOM.render(<CookiesProvider>
      <Router>
        <Switch>
          <Route path="/teach/:id">
            <Blackboard />
          </Route>
          <Route path="/view/:id">
            <View />
          </Route> 
          <Route path="/">
            <App />
          </Route>
        </Switch>
      </Router>
    </CookiesProvider>,
    document.getElementById('root')
)

