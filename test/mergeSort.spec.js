var assert = require('assert')
var {mergeSortIterate, mergeSortRecursive} = require('../algorithm/mergeSort')
var {getTestArray} = require('./testSuitData')

describe('mergeSort', function () {
  var testArray, testArrayResult
  beforeEach(function () {
    var _res = getTestArray()
    testArray = _res[0]
    testArrayResult = _res[1]
  })

  it('test mergeSortIterate', function () {
    testArray.forEach((value, index) => {
      assert.deepEqual(mergeSortIterate(value), testArrayResult[index])
    })
  })

  it('test mergeSortRecursive', function () {
    testArray.forEach((value, index) => {
      assert.deepEqual(mergeSortRecursive(value), testArrayResult[index])
    })
  })
})
