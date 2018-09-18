import insertionSort from './insertionSort'
import { isUndefined } from '../lib/unit'

function bucketSort (array = [], bucketSize) {
  const DEFAULT_BUCKET_SIZE = 5
  bucketSize = bucketSize || DEFAULT_BUCKET_SIZE
  var bucketArray = []
  var length = array.length

  var maxValue = array[0]
  var minValue = array[0]
  for (var i = 1; i < length; i++) {
    if (maxValue < array[i]) maxValue = array[i]
    if (minValue > array[i]) minValue = array[i]
  }

  // 桶分配策略，可选择合适的策略
  for (i = 0; i < length; i++) {
    var bucketIndex = Math.floor((array[i] - minValue) / bucketSize)
    if (isUndefined(bucketArray[bucketIndex])) bucketArray[bucketIndex] = []
    bucketArray[bucketIndex].push(array[i])
  }

  var _array = []
  for (i = 0; i < bucketArray.length; i++) {
    if (isUndefined(bucketArray[i])) continue
    _array = _array.concat(insertionSort(bucketArray[i])) // 对每个桶进行排序，可以选择不同的排序
  }

  return _array
}

export default bucketSort
