import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter as Router,Switch,Route} from "react-router-dom"
import Org from "./org/org_index"
import Index from "./Index"
import Customer from "./customer/cust_index"
import Admin from "./admin/Admin"

class App extends Component {
  componentDidMount(){
    document.title = "KYC Blockchain"
  }
  render() {
    return (
      <Router>        
        <Switch>
          <Route exact path='/'>
            <Index title={"KYC Blockchain"}/>
          </Route>
          <Route exact path="/organization">
            <Org title={"Organization"}/>
          </Route>
          <Route exact path="/customer">
            <Customer title={"Customer"}/>
          </Route>
          <Route exact path='/admin'>
            <Admin title={"Admin"}/>
          </Route>
        </Switch>
      </Router>
      
    );
  }
}

export default App;
