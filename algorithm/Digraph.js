import { Stack } from "../lib/stack";
import { invariant } from "../lib/unit";

class Digraph {
  constructor(vertexCount) {
    /**
     * @type {Array<Stack>}
     */
    this._adj = [];
    this._vertexCount = vertexCount;
    this._edgeCounte = 0;

    for (let i = 0; i < vertexCount; i++) {
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
    return this._edgeCounte;
  }

  /**
   * @description add edge v->w to this digraph
   * @param {number} from the begin of the edge
   * @param {number} to the end of the edge
   */
  addEdge(from, to) {
    this._adj[from].push(to);
    this._edgeCounte++;
  }

  /**
   * @description vertices connected to v by edges pointing from v
   * @param {number} vertex
   */
  adj(vertex) {
    return this._adj[vertex];
  }

  /**
   * @description reverse of this digraph
   */
  reverse() {
    const digraph = new Digraph();

    for (let i = 0; i < this.V(); i++) {
      const _adj = this.adj(i);
      for (const _vertex of _adj) {
        digraph.addEdge(_vertex, i);
      }
    }

    return digraph;
  }
}

class DirectedDFS {
  /**
   * @description find vertices in digraph that are reachable from source
   * @param {Digraph} digraph
   * @param {number} source
   */
  constructor(digraph, source) {
    /**
     * @type {Array<boolean>}
     */
    this._marked = [];
    if (typeof source === "number") {
      this.dfs(digraph, source);
    } else if (source instanceof Array) {
      for (const vertex of source) {
        this.dfs(digraph, vertex);
      }
    } else {
      invariant(false, "source should be number or array of number");
    }
  }

  /**
   * @param {Digraph} digraph
   * @param {number} vertex
   */
  dfs(digraph, vertex) {
    this._marked[vertex] = true;
    const _adj = digraph.adj(vertex);

    for (const _vertex of _adj) {
      if (!this._marked[_vertex]) {
        this.dfs(digraph, _vertex);
      }
    }
  }

  /**
   * @description is v reachable?
   */
  marked(vertex) {
    return this._marked[vertex];
  }
}

class DirectedCycle {
  /**
   * @description cycle-finding constructor
   * @param {Digraph} digraph
   */
  constructor(digraph) {
    this._marked = [];
    this._edgeTo = [];
    this._onStack = [];
    /**
     * @type {Stack}
     */
    this._cycle = null;

    for (let i = 0; i < digraph.V(); i++) {
      if (!this._marked[i]) {
        this.dfs(digraph, i);
      }
    }
  }

  /**
   * @param {Digraph} digraph
   * @param {number} vertex
   */
  dfs(digraph, vertex) {
    this._marked[vertex] = true;
    this._onStack[vertex] = true;

    const _adj = digraph.adj(vertex);
    for (const _vertex of _adj) {
      if (this.hasCycle()) {
        return;
      } else if (!this._marked[_vertex]) {
        this._edgeTo[_vertex] = vertex;
        this.dfs(digraph, _vertex);
      } else if (this._onStack[_vertex]) {
        this._createCycle(vertex, _vertex);
      } else {}
    }

    this._onStack[vertex] = false;
  }

  _createCycle(from, to) {
    this._cycle = new Stack();
    this._cycle.push(from);
    let currentVertex = this._edgeTo[from];
    while (currentVertex !== to) {
      this._cycle.push(currentVertex);
      currentVertex = this._edgeTo[currentVertex];
    }
    this._cycle.push(to);
  }

  /**
   * @description does G have a directed cycle?
   */
  hasCycle() {
    return !!this._cycle;
  }

  /**
   * @description vertices on a cycle (if one exists)
   */
  cycle () {
    return this._cycle;
  }
}

export {
  Digraph,
  DirectedDFS,
  DirectedCycle
}
