var assert = require('assert')
var {MinPQ, MaxPQ} = require('../algorithm/PQ');

describe('priority queue', function () {
  /**
   * @type {Array<>}
   */
  var testData;
  var compareAble;
  beforeEach(function () {
    testData = [1, 2, 3, 4, 5];

    function compareTo(data) {
      if (this.value > data.value) {
        return 1;
      }

      if (this.value < data.value) {
        return -1;
      }

      if (this.value === data.value) {
        return 0;
      }
    }

    compareAble = [
      {
        value: 1,
        compareTo
      },
      {
        value: 2,
        compareTo
      },
      {
        value: 3,
        compareTo
      },
      {
        value: 4,
        compareTo
      },
      {
        value: 5,
        compareTo
      }
    ]
  })

  it('test MinPQ', function () {
    let _res = [];
    let minPQ = new MinPQ();
    minPQ.insert(testData.pop());
    assert.equal(minPQ.delMin(), 5);
    assert.equal(minPQ.isEmpty(), true);
    while (testData.length) {
      minPQ.insert(testData.pop());
      if (testData.length === 1) {
        _res.push(minPQ.delMin())
      }
    }
    while (!minPQ.isEmpty()) {
      _res.push(minPQ.delMin());
    }

    assert.deepEqual(_res, [2, 1, 3, 4]);
  })

  it('test compareable data with MinPQ', function () {
    let _res = [];
    let minPQ = new MinPQ();
    minPQ.insert(compareAble.pop());
    assert.equal(minPQ.delMin().value, 5);
    assert.equal(minPQ.isEmpty(), true);
    while (compareAble.length) {
      minPQ.insert(compareAble.pop());
      if (compareAble.length === 1) {
        _res.push(minPQ.delMin().value)
      }
    }
    while (!minPQ.isEmpty()) {
      _res.push(minPQ.delMin().value);
    }

    assert.deepEqual(_res, [2, 1, 3, 4]);
  })

  it('test MaxPQ', function () {
    let _res = [];
    let maxPQ = new MaxPQ();
    maxPQ.insert(testData.pop());
    assert.equal(maxPQ.delMax(), 5);
    assert.equal(maxPQ.isEmpty(), true);
    while (testData.length) {
      maxPQ.insert(testData.pop());
      if (testData.length === 1) {
        _res.push(maxPQ.delMax());
      }
    }
    while (!maxPQ.isEmpty()) {
      _res.push(maxPQ.delMax());
    }

    assert.deepEqual(_res, [4, 3, 2, 1]);
  })
})
