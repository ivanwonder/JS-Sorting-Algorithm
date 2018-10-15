import React from "react";
import ReactDOM from "react-dom";
import { RouteConfig } from "./src/route/route.jsx";
import Layout from "./src/layout";
import { HashRouter as Router } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Layout>
        <RouteConfig />
      </Layout>
    </Router>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
