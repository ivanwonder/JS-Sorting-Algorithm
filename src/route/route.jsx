import React from "react";
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import routes from "./config";

// wrap <Route> and use this everywhere instead, then when
// sub routes are added to any route it'll work
const RouteWithSubRoutes = route => (
  <Route
    path={route.path}
    render={props => (
      // pass the sub-routes down to keep nesting
      <route.component {...props} routes={route.routes} />
    )}
  />
);

class RouteConfig extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
          <Redirect from="*" to="/collisions" />
        </Switch>
      </div>
    );
  }
}

export { RouteConfig };
