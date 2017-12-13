function selectionSort (arr) {
  var flag = 0
  for (var i = 0, length = arr.length; i < length - 1; i++) {
    flag = i
    for (var j = i + 1; j < length; j++) {
      if (arr[j] < arr[flag]) flag = j
    }
    if (flag !== i) {
      arr[flag] = arr[flag] + arr[i]
      arr[i] = arr[flag] - arr[i]
      arr[flag] = arr[flag] - arr[i]
    }
  }

  return arr
}

export default selectionSort
