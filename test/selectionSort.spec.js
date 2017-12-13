var assert = require('assert')
var selectionSort = require('../algorithm/selectionSort').default
var {getTestArray} = require('./testSuitData')

describe('selectionSort', function () {
  var testArray, testArrayResult
  beforeEach(function () {
    var _res = getTestArray()
    testArray = _res[0]
    testArrayResult = _res[1]
  })

  it('test selectionSort', function () {
    testArray.forEach((value, index) => {
      assert.deepEqual(selectionSort(value), testArrayResult[index])
    })
  })
})
