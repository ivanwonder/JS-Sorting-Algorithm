import { Collisions } from "../views/collisions/collisions";
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
      return <li>1</li>;
    }
  }
];

export default routes;

// export {
//   getName: function(path) {
//     return routes.find(name)
//   }
// }
