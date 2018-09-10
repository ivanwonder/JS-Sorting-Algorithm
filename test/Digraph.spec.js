var assert = require('assert')
var readGraph = require('../server/readGraph').readGraph;
var path = require('path');
var {Digraph, DirectedDFS, DirectedCycle, DepthFirstOrder, KosarajuSharirSCC} = require("../algorithm/Digraph");

describe('Digraph', function () {
  /**
   * @type {Digraph}
   */
  let digraph;
  let DAG;
  let mediumDG;
  beforeEach(function (done) {
    function constructDigraph(source) {
      const _digraph = new Digraph(source[0]);
      for (let i = 2; i < source.length; i++) {
        _digraph.addEdge(source[i][0], source[i][1]);
      }
      return _digraph;
    }

    readGraph(path.join(__dirname, "../server/resource/tinyDG.txt")).then(source => {
      digraph = constructDigraph(source);
      return readGraph(path.join(__dirname, "../server/resource/tinyDAG.txt"));
    }).then(source => {
      DAG = constructDigraph(source);
      return readGraph(path.join(__dirname, "../server/resource/mediumDG.txt"));
    }).then(source => {
      mediumDG = constructDigraph(source);
      done();
    });
  })

  it('test DirectedDFS', function () {
    let directedDFS = new DirectedDFS(digraph, 2);
    let reachable = [];
    for (let i = 0; i < digraph.V(); i++) {
      if (directedDFS.marked(i)) {
        reachable.push(i);
      }
    }

    assert.deepEqual(reachable, [0, 1, 2, 3, 4, 5]);

    directedDFS = new DirectedDFS(digraph, [1, 2, 6]);

    reachable = [];
    for (let i = 0; i < digraph.V(); i++) {
      if (directedDFS.marked(i)) {
        reachable.push(i);
      }
    }

    assert.deepEqual(reachable, [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12]);
  })

  it("test DirectedCycle", function() {
    function getCycle(directedCycle) {
      const cycle = [];
      if (directedCycle.hasCycle()) {
        for (const _vertex of directedCycle.cycle()) {
          cycle.push(_vertex);
        }
      }
      return cycle;
    }

    assert.deepEqual(getCycle(new DirectedCycle(digraph)), [5, 4, 3]);
    assert.deepEqual(getCycle(new DirectedCycle(DAG)), []);
  })

  it("test DepthFirstOrder", function() {
    const depthFirstOrder = new DepthFirstOrder(DAG);
    const pre = [];
    for (const _vertex of depthFirstOrder.pre()) {
      pre.push(_vertex);
    }

    const post = []
    for (const _vertex of depthFirstOrder.post()) {
      post.push(_vertex);
    }

    assert.deepEqual(pre, [0, 5, 4, 1, 6, 9, 11, 12, 10, 2, 3, 7, 8]);
    assert.deepEqual(post, [4, 5, 1, 12, 11, 10, 9, 6, 0, 3, 2, 7, 8]);
  })

  it("test KosarajuSharirSCC", function() {
    /**
     *
     * @param {KosarajuSharirSCC} kosarajuSharirSCC
     */
    function getComponent(digraph) {
      const kosarajuSharirSCC = new KosarajuSharirSCC(digraph);
      /**
     * @type {Array<Array<any>>}
     */
      const component = [];
      for (let i = 0; i < kosarajuSharirSCC.count(); i++) {
        component[i] = [];
      }

      for (let i = 0; i < digraph.V(); i++) {
        component[kosarajuSharirSCC.id(i)].push(i);
      }

      return component;
    }

    assert.deepEqual(getComponent(digraph), [
      [1],
      [0, 2, 3, 4, 5],
      [9, 10, 11, 12],
      [6, 8],
      [7]
    ]);

    assert.deepEqual(getComponent(mediumDG), [
      [21],
      [2, 5, 6, 8, 9, 11, 12, 13, 15, 16, 18, 19, 22, 23, 25, 26, 28, 29, 30, 31, 32, 33, 34, 35, 37, 38, 39, 40, 42, 43, 44, 46, 47, 48, 49],
      [14],
      [3, 4, 17, 20, 24, 27, 36],
      [41],
      [7],
      [45],
      [1],
      [0],
      [10]
    ]);
  })
})
