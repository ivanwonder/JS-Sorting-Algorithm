var assert = require('assert');
var {Graph, DepthFirstSearch, DepthFirstPaths, CC} = require('../algorithm/graph');

describe('graph', function () {
  const _graph = [
    13, 13, [0, 5], [4, 3], [0, 1], [9, 12], [6, 4], [5, 4], [0, 2], [11, 12], [9, 10], [0, 6], [7, 8], [9, 11], [5, 3]
  ]
  let g;
  beforeEach(function () {
    g = new Graph(_graph[0]);
    const _length = _graph.length;
    for (let i = 2; i < _length; i++) {
      g.addEdge(_graph[i][0], _graph[i][1]);
    }
  })

  it('test DepthFirstSearch', function () {
    const search = new DepthFirstSearch(g, 0);
    assert.equal(search.count(), 7);
  })

  it('test DepthFirstPaths', function () {
    const search = new DepthFirstPaths(g, 0);
    let path = '';

    const flag = " --> "

    if (search.hasPathTo(4)) {
      const pathStack = search.pathTo(4);
      const _path = [];
      while (pathStack.size()) {
        _path.push(pathStack.pop());
      }
      path = _path.join(flag);
    }

    const expect = [0, 6, 4].join(flag);
    assert.equal(path, expect);
  })

  it('test connected components', function () {
    const cc = new CC(g);
    const count = 3;
    assert.equal(cc.count(), count, "the count of connected components should be 3");
    const component = [];
    for (let i = 0; i < count; i++) {
      component[i] = [];
    }
    const vertexCount = g.V();
    for (let i = 0; i < vertexCount; i++) {
      component[cc.id(i)].push(i);
    }

    const componentString = [];
    for (let i = 0; i < count; i++) {
      componentString[i] = component[i].join(" ");
    }

    assert.deepEqual(componentString, ["0 1 2 3 4 5 6", "7 8", "9 10 11 12"]);
  })
})
