var assert = require('assert')
var quickSort = require('../algorithm/quickSort').default
var {getTestArray} = require('./testSuitData')

describe('quickSort', function () {
  var testArray, testArrayResult
  beforeEach(function () {
    var _res = getTestArray()
    testArray = _res[0]
    testArrayResult = _res[1]
  })

  it('test quickSort', function () {
    testArray.forEach((value, index) => {
      assert.deepEqual(quickSort(value), testArrayResult[index])
    })
  })
})
