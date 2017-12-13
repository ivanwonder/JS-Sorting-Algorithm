function shellSort (array) {
  for (var length = array.length, gap = length >> 1; gap > 0; gap >>= 1) {
    for (var i = gap; i < length; i++) {
      var temp = array[i]
      for (var j = i - gap; j >= 0 && array[j] > temp; j -= gap) {
        array[j + gap] = array[j]
      }
      array[j + gap] = temp
    }
  }

  return array
}

export default shellSort
