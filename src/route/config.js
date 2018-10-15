import Collisions from "../views/collisions/collisions";
import React from "react";

const routes = [
  {
    path: "/collisions",
    name: "collisions",
    component: Collisions
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
