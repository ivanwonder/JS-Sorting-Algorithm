function quickSort (array) {
  beginQuickSort(array, 0, array.length)
  return array
}

function beginQuickSort (array, left, right) {
  if (left === right) return array
  var pivot = left
  var point = left + 1
  for (var i = left + 1; i <= right; i++) {
    if (array[i] < array[pivot]) {
      if (i !== point) {
        array[i] = array[i] + array[point]
        array[point] = array[i] - array[point]
        array[i] = array[i] - array[point]
      }
      point++
    }
  }
  if (point > (pivot + 1)) {
    array[pivot] = array[pivot] + array[point - 1]
    array[point - 1] = array[pivot] - array[point - 1]
    array[pivot] = array[pivot] - array[point - 1]
  }

  if ((point - 2) >= left) beginQuickSort(array, left, point - 2)
  if (point <= right) beginQuickSort(array, point, right)
}

export default quickSort
