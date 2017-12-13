var assert = require('assert')
var insertionSort = require('../algorithm/insertionSort').default
var {getTestArray} = require('./testSuitData')

describe('insertionSort', function () {
  var testArray, testArrayResult
  beforeEach(function () {
    var _res = getTestArray()
    testArray = _res[0]
    testArrayResult = _res[1]
  })

  it('test insertionSort', function () {
    testArray.forEach((value, index) => {
      assert.deepEqual(insertionSort(value), testArrayResult[index])
    })
  })
})
