import React, { Component } from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import Forums from './components/Forums/Forums';
import Layout from './components/Layout/Layout';

class App extends Component {
  render() {

    const routes = (
      <Switch>
        <Route path="/forums" component={Forums} />
        <Redirect from="/" exact to="/forums" />
        <Route path="/" render={(props) => <div style={{'margin': '20rem', 'fontSize': '10rem'}}>404 page dont exist</div>} />
      </Switch>
    );

    return (
      <div>
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  }
}

export default App;
