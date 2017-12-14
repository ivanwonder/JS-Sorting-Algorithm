var assert = require('assert')
var heapSort = require('../algorithm/heapSort').default
var {getTestArray} = require('./testSuitData')

describe('heapSort', function () {
  var testArray, testArrayResult
  beforeEach(function () {
    var _res = getTestArray()
    testArray = _res[0]
    testArrayResult = _res[1]
  })

  it('test heapSort', function () {
    testArray.forEach((value, index) => {
      assert.deepEqual(heapSort(value), testArrayResult[index])
    })
  })
})
