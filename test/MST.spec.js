var assert = require('assert')
var {Edge, EdgeWeightedGraph, LazyPrimMST, PrimMST} = require('../algorithm/MST')
var {readGraph} = require("../server/readGraph");
var path = require("path");

describe('MST', function () {
  /**
   * @type {EdgeWeightedGraph}
   */
  var tinyEWG;
  beforeEach(function (done) {
    readGraph(path.join(__dirname, "../server/resource/tinyEWG.txt")).then(source => {
      tinyEWG = new EdgeWeightedGraph(source[0]);
      for (let i = 2; i < source.length; i++) {
        tinyEWG.addEdge(new Edge(source[i][0], source[i][1], source[i][2]));
      }
      done();
    });
  })

  it('test MST', function () {
    function getResult(mst) {
      const _res = [];
      for (const _edge of mst.edges()) {
        const v = _edge.either();
        const w = _edge.other(v);
        const weight = _edge.weight();
        _res.push([v, w, weight])
      }
      return _res;
    }

    const expectRes = [
      [0, 7, 0.16000],
      [1, 7, 0.19000],
      [0, 2, 0.26000],
      [2, 3, 0.17000],
      [5, 7, 0.28000],
      [4, 5, 0.35000],
      [6, 2, 0.40000]
    ];

    const expectWeight = 1.81;

    let mst = new LazyPrimMST(tinyEWG);
    assert.deepEqual(getResult(mst), expectRes);
    assert.equal(mst.weight(), expectWeight);

    mst = new PrimMST(tinyEWG);
    assert.deepEqual(getResult(mst), expectRes);
    assert.equal(mst.weight(), expectWeight);
  })
})
