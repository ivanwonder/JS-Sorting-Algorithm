function min (x, y) {
  return x < y ? x : y
}

// 迭代
function mergeSortIterate (array) {
  var tempArray = []
  for (var sep = 1, length = array.length; sep < length; sep *= 2) {
    var k = 0
    for (var i = 0; i < length; i += sep * 2) {
      var start1 = i
      var end1 = min(i + sep, length)
      var start2 = end1
      var end2 = min(sep + end1, length)

      while (start1 < end1 && start2 < end2) {
        tempArray[k++] = array[start1] < array[start2] ? array[start1++] : array[start2++]
      }
      while (start1 < end1) {
        tempArray[k++] = array[start1++]
      }
      while (start2 < end2) {
        tempArray[k++] = array[start2++]
      }
    }
    var temp = array
    array = tempArray
    tempArray = temp
  }

  return array
}

// 递归
function mergeSortRecursive (array) {
  var length = array.length
  if (length < 2) return array
  var mid = Math.floor(length / 2)
  return merge(mergeSortRecursive(array.slice(0, mid)), mergeSortRecursive(array.slice(mid)))
}

function merge (left, right) {
  var result = []
  while (left.length && right.length) {
    result.push(left[0] < right[0] ? left.shift() : right.shift())
  }

  if (left.length) result = result.concat(left)
  if (right.length) result = result.concat(right)

  return result
}

export {
  mergeSortIterate,
  mergeSortRecursive
}
