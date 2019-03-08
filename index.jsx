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
Expr -> Program;
Program -> Function;
NewLine -> entry NewLine | ~;
Factor ->  class;
Function -> NewLine Factor name ( Argu ) l r NewLine {qwe} Function | ~;
Argu -> Argu , argu | argu;
`,
  {
    terminal: {
      "+": "\\+",
      "*": "\\*",
      "(": "\\(",
      ")": "\\)",
      l: "\\{",
      r: "\\}",
      class: "fun",
      name: "[a-zA-Z]+",
      argu: "argu",
      ",": ",",
      "entry": "\\n"
    },
    nonterminal: ["Expr", "Term", "Factor", "Program", "Argu", "NewLine", "Function"],
    start: ["Expr"],
    separators: ["(", ")", "*", "+", "{", "}", ",", String.fromCodePoint(10)]
  }
);

unger.parse(`fun name(argu, argu, argu){}
`);
