import React from "react";
import { loadable } from "../util/asyncImport";

const routes = [
  {
    path: "/collisions",
    name: "collisions",
    component: loadable(import("../views/collisions/collisions"))
  },
  {
    path: "/bst",
    name: "Balanced Search Trees",
    component: loadable(import("../views/BST/BST"))
  },
  {
    path: "/test",
    name: "test",
    component: function test() {
      return <li> 1 </li>;
    }
  }
];

function getName(path) {
  const _route = routes.find(item => item.path === path);
  if (_route) {
    return _route.name;
  } else {
    return "";
  }
}

function getIndex(path) {
  return routes.findIndex(item => item.path === path);
}

export default routes;

export { getName, getIndex };
