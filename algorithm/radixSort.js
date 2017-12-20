import {isUndefined} from '../lib/unit'

function findMaxDigit (array = []) {
  var maxDigit = 0
  var length = array.length
  for (var i = 0; i < length; i++) {
    var digit = array[i].toString().length
    if (digit > maxDigit) maxDigit = digit
  }

  return maxDigit
}

function radixSort (array = [], maxDigit) {
  var length = array.length
  maxDigit = maxDigit || findMaxDigit(array)

  for (var i = 0; i < maxDigit; i++) {
    var res = []

    for (var j = 0; j < length; j++) {
      var _index = Math.floor(array[j] % Math.pow(10, i + 1) / Math.pow(10, i))
      isUndefined(res[_index]) && (res[_index] = [])
      res[_index].push(array[j])
    }

    var pos = 0
    for (var k = 0; k < 10; k++) {
      var value = null
      if (!isUndefined(res[k])) {
        while (!isUndefined((value = res[k].shift()))) {
          array[pos++] = value
        }
      }
    }
  }

  return array
}

export default radixSort
