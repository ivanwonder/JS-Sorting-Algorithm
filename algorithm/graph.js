import {Stack, Queue} from '../lib/stack';
import { isNumber, invariant } from '../lib/unit';
import { BST } from './BST';

class Graph {
  constructor(vertices) {
    /**
     * @type {Array<Stack>}
     */
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
  /**
   * @description find vertices connected to a source vertex
   * @param {Graph} graph
   * @param {number} vertex
   */
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

    for (const _vertex of _adj) {
      if (!this._marked[_vertex]) {
        this.dfs(graph, _vertex);
      }
    }
  }

  /**
   * @description is v connected to s?
   * @param {number} vertex
   */
  marked(vertex) {
    return !!this._marked[vertex];
  }

  /**
   * @description how many vertices are connected to s?
   */
  count() {
    return this._count;
  }
}

class FindPath {
  constructor (source) {
    invariant(isNumber(source), "graph's vertex should be a number");
    this._marked = [];
    this._edgeTo = [];
    this.s = source;
  }

  hasPathTo(vertex) {
    return !!this._marked[vertex];
  }

  pathTo(vertex) {
    const path = new Stack();
    path.push(vertex);
    let pre = this._edgeTo[vertex];
    while (pre !== this.s) {
      path.push(pre);
      pre = this._edgeTo[pre];
    }
    path.push(this.s);

    return path;
  }
}

class BreadthFirstPaths extends FindPath {
  constructor(graph, vertex) {
    super(vertex);
    this.bfs(graph, vertex);
  }

  /**
   * @param {Graph} graph
   * @param {number} vertex
   */
  bfs(graph, vertex) {
    invariant(isNumber(vertex), "graph's vertex should be a number");

    const queue = new Queue();
    queue.enqueue(vertex);
    this._marked[vertex] = true;

    while (queue.size()) {
      const parentVertex = queue.dequeue();
      const _adj = graph.adj(parentVertex);

      for (const childVertex of _adj) {
        if (!this._marked[childVertex]) {
          this._marked[childVertex] = true;
          this._edgeTo[childVertex] = parentVertex;
          queue.enqueue(childVertex);
        }
      }
    }
  }
}

class DepthFirstPaths extends FindPath {
  constructor(graph, source) {
    super(source);
    this.dfs(graph, source);
  }

  dfs(graph, vertex) {
    invariant(isNumber(vertex), "graph's vertex should be a number");
    this._marked[vertex] = true;
    const edge = graph.adj(vertex);

    for (const _ver of edge) {
      if (!this._marked[_ver]) {
        this._edgeTo[_ver] = vertex;
        this.dfs(graph, _ver);
      }
    }
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

  /**
   * @description
   * @param {Graph} graph
   * @param {number} vertex
   */
  dfs(graph, vertex) {
    invariant(isNumber(vertex), "graph's vertex should be a number");
    this._marked[vertex] = true;
    this._id[vertex] = this._count;

    const adj = graph.adj(vertex);

    for (const _vertex of adj) {
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

  /**
   * @param {number} vertex
   */
  id(vertex) {
    return this._id[vertex];
  }
}

class SymbolGraph {
  /**
   *
   * @param {Array<[string, string]>} stream
   */
  constructor(stream) {
    this.bst = new BST();
    this.keys = [];

    stream.forEach(item => {
      item.forEach(value => {
        if (!this.bst.contains(value)) {
          this.keys[this.bst.size()] = value;
          this.bst.put(value, this.bst.size());
        }
      });
    });

    this.graph = new Graph(this.bst.size());

    stream.forEach(item => {
      this.graph.addEdge(this.bst.get(item[0]), this.bst.get(item[1]));
    });
  }

  contains(keys) {
    return this.bst.contains(keys);
  }

  /**
   * @param {string} keys
   * @returns {number}
   */
  index(keys) {
    return this.bst.get(keys);
  }

  /**
   * @param {number} index
   * @returns {string}
   */
  name(index) {
    return this.keys[index];
  }

  G() {
    return this.graph;
  }
}

export {Graph, DepthFirstSearch, BreadthFirstPaths, DepthFirstPaths, CC, SymbolGraph}
