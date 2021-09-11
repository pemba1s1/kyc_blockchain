import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter as Router,Switch,Route} from "react-router-dom"
import Org from "./org/org_index"
import Index from "./Index"
import Customer from "./customer/cust_index"

class App extends Component {
  render() {
    return (
      <Router>        
        <Switch>
          <Route exact path='/'>
            <Index/>
          </Route>
          <Route exact path="/organization">
            <Org />
          </Route>
          <Route exact path="/customer">
            <Customer />
          </Route>
        </Switch>
      </Router>
      
    );
  }
}

export default App;
