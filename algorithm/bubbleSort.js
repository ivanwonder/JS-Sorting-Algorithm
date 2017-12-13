function bubbleSort (array) {
  var flag = false
  for (var i = 0, length = array.length; i < length - 1; i++) {
    if (flag) return array
    flag = true
    for (var j = length - 1; j > i; j--) {
      if (array[j - 1] > array[j]) {
        array[j - 1] = array[j - 1] + array[j]
        array[j] = array[j - 1] - array[j]
        array[j - 1] = array[j - 1] - array[j]
        flag = false
      }
    }
  }
  return array
}

export default bubbleSort
