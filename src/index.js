import ReactDOM from 'react-dom'
import React from 'react'
import App from './App';
import Home from './Home';
import View from './View';
import "./index.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";



ReactDOM.render(

  <Router>
        <Switch>
          <Route path="/teach/:id">
            <App />
          </Route>{/* 
          <Route path="/view/:id">
            <View />
          </Route> */}
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        </Router>,
    document.getElementById('root')
)
