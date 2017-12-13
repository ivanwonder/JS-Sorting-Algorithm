function insertionSort (array) {
  for (var i = 1, length = array.length; i < length; i++) {
    var value = array[i]
    var j = i - 1
    while (j >= 0 && value < array[j]) {
      array[j + 1] = array[j]
      j--
    }
    array[j + 1] = value
  }

  return array
}

export default insertionSort
