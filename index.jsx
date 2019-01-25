import React from "react";
import ReactDOM from "react-dom";
import { RouteConfig } from "./src/route/route.jsx";
import Layout from "./src/layout";
import { HashRouter as Router } from "react-router-dom";
import { parseGrammar } from "./algorithm/parse/lib/parseGrammar";
import { Unger } from "./algorithm/parse/unger.js";

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

const unger = new Unger(`
Expr -> Expr + Term | Term
Term -> Term * Factor | Factor
Factor -> ( Expr ) | i
`, {
  terminal: {
    "+": "+",
    "*": "*",
    "(": "(",
    ")": ")",
    "i": "i"
  },
  nonterminal: ["Expr", "Term", "Factor"],
  start: ["Expr"]
});

unger.parse("i*i");
