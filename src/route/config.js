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
