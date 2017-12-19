var assert = require('assert')
var countingSort = require('../algorithm/countingSort').default
var {getTestArray} = require('./testSuitData')

describe('countingSort', function () {
  var testArray, testArrayResult
  beforeEach(function () {
    var _res = getTestArray()
    testArray = _res[0]
    testArrayResult = _res[1]
  })

  it('test countingSort', function () {
    testArray.forEach((value, index) => {
      assert.deepEqual(countingSort(value), testArrayResult[index])
    })
  })
})
