var assert = require('assert')
var bucketSort = require('../algorithm/bucketSort').default
var {getTestArray} = require('./testSuitData')

describe('bucketSort', function () {
  var testArray, testArrayResult
  beforeEach(function () {
    var _res = getTestArray()
    testArray = _res[0]
    testArrayResult = _res[1]
  })

  it('test bucketSort', function () {
    testArray.forEach((value, index) => {
      assert.deepEqual(bucketSort(value), testArrayResult[index])
    })
  })
})
