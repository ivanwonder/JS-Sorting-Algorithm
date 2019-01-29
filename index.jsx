import React from "react";
import ReactDOM from "react-dom";
import { RouteConfig } from "./src/route/route.jsx";
import Layout from "./src/layout";
import { HashRouter as Router } from "react-router-dom";
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

const unger = new Unger(
  `
Expr -> Expr + Term | Term | Function
Term -> Term * Factor | Factor
Factor -> ( Expr ) | class
Function -> Factor name ( Argu ) { }
Argu -> Argu , argu | argu
`,
  {
    terminal: {
      "+": "+",
      "*": "*",
      "(": "(",
      ")": ")",
      "{": "{",
      "}": "}",
      class: "fun",
      name: "name",
      argu: "argu",
      ",": ",",
      "~": ""
    },
    nonterminal: ["Expr", "Term", "Factor", "Function", "Argu"],
    start: ["Expr"],
    separators: ["(", ")", "*", "+", "{", "}", ","]
  }
);

unger.parse("fun name(argu, argu, argu){}");
