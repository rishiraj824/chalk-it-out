import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from './App';
import Home from './Home';
import "./index.css";
import View from './View';



ReactDOM.render(

  <Router>
        <Switch>
          <Route path="/teach/:id">
            <App />
          </Route>
          <Route path="/view/:id">
            <View />
          </Route> 
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        </Router>,
    document.getElementById('root')
)
