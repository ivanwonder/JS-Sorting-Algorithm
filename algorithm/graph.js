import {Stack} from '../lib/stack';
import { isNumber, invariant } from '../lib/unit';

class Graph {
  constructor(vertices) {
    this._adj = [];
    for (let i = 0; i < vertices; i++) {
      this._adj[i] = new Stack();
    }
    this.edgeSize = 0;
  }

  V() {
    return this._adj.length;
  }

  E() {
    return this.edgeSize;
  }

  addEdge(vertex, edge) {
    this._adj[vertex].push(edge);
    this._adj[edge].push(vertex);
    this.edgeSize++;
  }

  adj(vertex) {
    return this._adj[vertex];
  }
}

class DepthFirstSearch {
  constructor(graph, vertex) {
    this._marked = [];
    this._count = 0;
    this.dfs(graph, vertex);
  }

  dfs(graph, vertex) {
    invariant(isNumber(vertex), "graph's vertex should be a number");
    const _adj = graph.adj(vertex);
    this._marked[vertex] = true;
    this._count++;
    let _vertex;
    while (_adj.size()) {
      _vertex = _adj.pop();
      invariant(isNumber(_vertex), "graph's vertex should be a number");
      if (!this._marked[_vertex]) {
        this.dfs(graph, _vertex);
      }
    }
  }

  marked(vertex) {
    return !!this._marked[vertex];
  }

  count() {
    return this._count;
  }
}

class DepthFirstPaths {
  constructor(graph, source) {
    this._marked = [];
    this.edgeTo = [];
    this.s = source;
    this.dfs(graph, source);
  }

  dfs(graph, vertex) {
    invariant(isNumber(vertex), "graph's vertex should be a number");
    this._marked[vertex] = true;
    const edge = graph.adj(vertex);
    let _ver;
    while (edge.size()) {
      _ver = edge.pop();
      invariant(isNumber(_ver), "graph's vertex should be a number");
      if (!this._marked[_ver]) {
        this.edgeTo[_ver] = vertex;
        this.dfs(graph, _ver);
      }
    }
  }

  hasPathTo(vertex) {
    return !!this._marked[vertex];
  }

  pathTo(vertex) {
    const path = new Stack();
    path.push(vertex);
    let pre = this.edgeTo[vertex];
    while (pre !== this.s) {
      path.push(pre);
      pre = this.edgeTo[pre];
    }
    path.push(this.s);

    return path;
  }
}

// connected components
class CC {
  constructor(graph) {
    this._id = []; // transmit a vertex to a id denoted a connected components;
    this._count = 0; // represent the count of CC;
    this._marked = []; // record a vertex whether is visited;
    const vertexCount = graph.V();
    for (let i = 0; i < vertexCount; i++) {
      if (!this._marked[i]) {
        this.dfs(graph, i);
        this._count++;
      }
    }
  }

  dfs(graph, vertex) {
    invariant(isNumber(vertex), "graph's vertex should be a number");
    this._marked[vertex] = true;
    this._id[vertex] = this._count;

    const adj = graph.adj(vertex);
    let _vertex;
    while (adj.size()) {
      _vertex = adj.pop();
      invariant(isNumber(_vertex), "graph's vertex should be a number");
      if (!this._marked[_vertex]) {
        this.dfs(graph, _vertex);
      }
    }
  }

  connected(from, to) {
    return this._id[from] === this._id[to];
  }

  count() {
    return this._count;
  }

  id(vertex) {
    return this._id[vertex];
  }
}

export {Graph, DepthFirstSearch, DepthFirstPaths, CC}
