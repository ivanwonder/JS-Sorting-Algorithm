import { invariant } from "../lib/unit";
import { Stack, Queue } from "../lib/stack";
import { MinPQ, IndexMinPQ } from "./PQ";

class Edge {
  /**
   * @description initializing constructor
   * @param {number} from
   * @param {number} to
   * @param {number} weight
   */
  constructor(from, to, weight) {
    this._from = from;
    this._to = to;
    this._weight = weight;
  }

  weight() {
    return this._weight;
  }

  /**
   * @description either of this edge’s vertices
   */
  either() {
    return this._from;
  }

  other(vertex) {
    if (vertex === this._from) {
      return this._to;
    } else if (vertex === this._to) {
      return this._from;
    } else {
      invariant(false, "vertex do not include in this edge");
    }
  }

  /**
   * @param {Edge} edge
   */
  compareTo(edge) {
    if (this._weight === edge.weight()) {
      return 0;
    }
    if (this._weight < edge.weight()) {
      return -1;
    }
    if (this._weight < edge.weight()) {
      return 1;
    }
  }
}

class EdgeWeightedGraph {
  constructor(vertexCount) {
    /**
     * @type {Array<Stack>}
     */
    this._adj = [];
    this._vertexCount = vertexCount;
    this._edgeCount = 0;

    for (let i = 0; i < this._vertexCount; i++) {
      this._adj[i] = new Stack();
    }
  }

  /**
   * @description number of vertices
   */
  V() {
    return this._vertexCount;
  }

  /**
   * @description number of edges
   */
  E() {
    return this._edgeCount;
  }

  /**
   * @description add edge to this graph
   * @param {Edge} edge
   */
  addEdge(edge) {
    const v = edge.either();
    const w = edge.other(v);
    this._adj[v].push(edge);
    this._adj[w].push(edge);
    this._edgeCount++;
  }

  /**
   * @description edges incident to v
   * @param {number} vertex
   */
  adj(vertex) {
    return this._adj[vertex];
  }

  /**
   * @description all of this graph’s edges
   */
  edges() {
    const stack = new Stack();
    for (let i = 0; i < this.V(); i++) {
      for (const edge of this.adj(i)) {
        if (edge.other(i) > i) {
          stack.push(edge);
        }
      }
    }

    return stack;
  }
}

class LazyPrimMST {
  /**
   * @param {EdgeWeightedGraph} edgeWeightedGraph
   */
  constructor(edgeWeightedGraph) {
    this._queue = new Queue();
    this._visited = [];
    const pq = new MinPQ();
    this.visit(edgeWeightedGraph, 0, pq);
    while (!pq.isEmpty()) {
      /**
       * @type {Edge}
       */
      const _edge = pq.delMin();
      const v = _edge.either();
      const w = _edge.other(v);
      if (this._visited[v] && this._visited[w]) {
        continue;
      }
      this._queue.enqueue(_edge);
      if (!this._visited[v]) {
        this.visit(edgeWeightedGraph, v, pq);
      }

      if (!this._visited[w]) {
        this.visit(edgeWeightedGraph, w, pq);
      }
    }
  }

  /**
   * @param {EdgeWeightedGraph} edgeWeightedGraph
   * @param {number} vertex
   * @param {MinPQ} pq
   */
  visit(edgeWeightedGraph, vertex, pq) {
    this._visited[vertex] = true;
    for (const _edge of edgeWeightedGraph.adj(vertex)) {
      if (!this._visited[_edge.other(vertex)]) {
        pq.insert(_edge);
      }
    }
  }

  /**
   * @description all of the MST edges
   */
  edges() {
    return this._queue;
  }

  /**
   * @description weight of MST
   */
  weight() {
    let _weight = 0;
    for (const _edge of this.edges()) {
      _weight += _edge.weight();
    }
    return _weight;
  }
}

class PrimMST {
  /**
   * @param {EdgeWeightedGraph} edgeWeightedGraph
   */
  constructor(edgeWeightedGraph) {
    this._edgeTo = [];
    this._distTo = [];
    this._marked = [];

    for (let i = 0; i < edgeWeightedGraph.V(); i++) {
      this._distTo[i] = Number.POSITIVE_INFINITY;
    }

    const pq = new IndexMinPQ();
    this.visit(edgeWeightedGraph, 0, pq);

    while (!pq.isEmpty()) {
      const edge = pq.min();
      this._edgeTo.push(edge);
      this.visit(edgeWeightedGraph, pq.delMin(), pq);
    }
  }

  /**
   * @param {EdgeWeightedGraph} edgeWeightedGraph
   * @param {number} vertex
   * @param {IndexMinPQ} pq
   */
  visit(edgeWeightedGraph, vertex, pq) {
    this._marked[vertex] = true;

    for (const _edge of edgeWeightedGraph.adj(vertex)) {
      const to = _edge.other(vertex);
      if (this._marked[to]) {
        continue;
      }
      if (this._distTo[to] > _edge.weight()) {
        if (pq.contains(to)) {
          pq.change(to, _edge);
        } else {
          pq.insert(to, _edge);
        }
        this._distTo[to] = _edge.weight();
      }
    }
  }

  /**
   * @description all of the MST edges
   */
  edges() {
    return this._edgeTo;
  }

  /**
   * @description weight of MST
   */
  weight() {
    let _weight = 0;
    for (const _edge of this.edges()) {
      _weight += _edge.weight();
    }
    return _weight;
  }
}

export {
  Edge,
  EdgeWeightedGraph,
  LazyPrimMST,
  PrimMST
}
