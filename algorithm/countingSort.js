import { isUndefined } from '../lib/unit'

function countingSort (array = [], maxValue) {
  var countArray = []
  var length = array.length

  for (var i = 0; i < length; i++) {
    var _count = countArray[array[i]]
    countArray[array[i]] = isUndefined(_count) ? 1 : (_count + 1)
  }

  var countArrayLength = countArray.length
  var index = length - 1
  for (i = countArrayLength - 1; i >= 0; i--) {
    while (!isUndefined(countArray[i]) && countArray[i] > 0) {
      array[index--] = i
      countArray[i]--
    }
  }

  return array
}

export default countingSort
