var assert = require('assert')
var bubbleSort = require('../algorithm/bubbleSort').default
var {getTestArray} = require('./testSuitData')

describe('bubbleSort', function () {
  var testArray, testArrayResult
  beforeEach(function () {
    var _res = getTestArray()
    testArray = _res[0]
    testArrayResult = _res[1]
  })

  it('test bubbleSort', function () {
    testArray.forEach((value, index) => {
      assert.deepEqual(bubbleSort(value), testArrayResult[index])
    })
  })
})
