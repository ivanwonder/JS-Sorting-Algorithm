var assert = require('assert')
var radixSort = require('../algorithm/radixSort').default
var {getTestArray} = require('./testSuitData')

describe('radixSort', function () {
  var testArray, testArrayResult
  beforeEach(function () {
    var _res = getTestArray()
    testArray = _res[0]
    testArrayResult = _res[1]
  })

  it('test radixSort', function () {
    testArray.forEach((value, index) => {
      assert.deepEqual(radixSort(value), testArrayResult[index])
    })
  })
})
