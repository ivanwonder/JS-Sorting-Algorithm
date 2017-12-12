function insertionSort (array) {
  for (var i = 1, length = array.length; i < length; i++) {
    var value = array[i]
    var j = i - 1
    while (j >= 0) {
      if (value < array[j]) {
        array[j + 1] = array[j]
      } else {
        array[j + 1] = value
        break
      }
      j--
    }
  }

  return array
}

export default insertionSort
