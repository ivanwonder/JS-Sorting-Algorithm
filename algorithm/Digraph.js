import { Stack, Queue } from "../lib/stack";
import { invariant, isNull } from "../lib/unit";

class Digraph {
  constructor(vertexCount) {
    invariant(!!vertexCount, "please pass the number of digraph")
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
    const digraph = new Digraph(this.V());

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

class DepthFirstOrder {
  /**
   * @param {Digraph} digraph
   */
  constructor (digraph) {
    /**
     * Preorder : Put the vertex on a queue before the recursive calls.
     * Postorder : Put the vertex on a queue after the recursive calls.
     * Reverse postorder : Put the vertex on a stack after the recursive calls.
     */
    this._pre = new Queue();
    this._post = new Queue();
    this._reversePost = new Stack();

    this._marked = [];

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
    invariant(!isNull(vertex), "digraph's vertex cannot be null");
    this._marked[vertex] = true;
    this._pre.enqueue(vertex);
    for (const _vertex of digraph.adj(vertex)) {
      if (!this._marked[_vertex]) {
        this.dfs(digraph, _vertex);
      }
    }
    this._post.enqueue(vertex);
    this._reversePost.push(vertex);
  }

  pre() {
    return this._pre;
  }

  post() {
    return this._post;
  }

  reversePost() {
    return this._reversePost;
  }
}

class KosarajuSharirSCC {
  /**
   * @param {Digraph} digraph
   */
  constructor(digraph) {
    this._marked = [];
    this._count = 0;
    this._id = [];

    const reverse = digraph.reverse();
    const depthFirstOrder = new DepthFirstOrder(reverse);
    for (const _vertex of depthFirstOrder.reversePost()) {
      if (!this._marked[_vertex]) {
        this.dfs(digraph, _vertex);
        this._count++;
      }
    }
  }

  /**
   * @param {Digraph} digraph
   * @param {number} vertex
   */
  dfs(digraph, vertex) {
    this._marked[vertex] = true;
    this._id[vertex] = this._count;
    for (const _vertex of digraph.adj(vertex)) {
      if (!this._marked[_vertex]) {
        this.dfs(digraph, _vertex);
      }
    }
  }

  /**
   * @description are v and w strongly connected?
   * @param {number} from
   * @param {number} to
   */
  stronglyConnected(from, to) {
    return this._id[from] === this._id[to];
  }

  /**
   * @description number of strong components
   */
  count() {
    return this._count;
  }

  /**
   * @description component identifier for v ( between 0 and count()-1 )
   * @param {number} vertex
   */
  id(vertex) {
    return this._id[vertex];
  }
}

export {
  Digraph,
  DirectedDFS,
  DirectedCycle,
  DepthFirstOrder,
  KosarajuSharirSCC
}
