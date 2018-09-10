var assert = require('assert')
var readGraph = require('../server/readGraph').readGraph;
var path = require('path');
var {Digraph, DirectedDFS, DirectedCycle} = require("../algorithm/Digraph");

describe('Digraph', function () {
  /**
   * @type {Digraph}
   */
  let digraph;
  beforeEach(function (done) {
    readGraph(path.join(__dirname, "../server/resource/tinyDG.txt")).then(source => {
      digraph = new Digraph(source[0]);
      for (let i = 2; i < source.length; i++) {
        digraph.addEdge(source[i][0], source[i][1]);
      }
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
    let directedCycle = new DirectedCycle(digraph);
    let cycle = [];
    if (directedCycle.hasCycle()) {
      for (const _vertex of directedCycle.cycle()) {
        cycle.push(_vertex);
      }
    }

    assert.deepEqual(cycle, [5, 4, 3]);
  })
})
