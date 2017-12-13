var assert = require('assert')
var shellSort = require('../algorithm/shellSort').default
var {getTestArray} = require('./testSuitData')

describe('shellSort', function () {
  var testArray, testArrayResult
  beforeEach(function () {
    var _res = getTestArray()
    testArray = _res[0]
    testArrayResult = _res[1]
  })

  it('test shellSort', function () {
    testArray.forEach((value, index) => {
      assert.deepEqual(shellSort(value), testArrayResult[index])
    })
  })
})
