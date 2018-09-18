import { swap } from '../lib/unit'

function buildMaxHead (array = []) {
  var length = array.length
  for (var i = (length >> 1) - 1; i >= 0; i--) {
    heapify(array, i, length - 1)
  }
}

function heapify (array = [], dad = 0, end = 0) {
  var son = dad * 2 + 1
  if (son > end) return
  if (son < end && array[son] < array[son + 1]) son++
  if (array[dad] < array[son]) {
    swap(array, dad, son)
    heapify(array, son, end)
  }
}

function heapSort (array = []) {
  var length = array.length
  if (length <= 1) return array
  buildMaxHead(array)
  for (var i = length - 1; i > 0; i--) {
    swap(array, 0, i)
    heapify(array, 0, i - 1)
  }

  return array
}

export default heapSort
