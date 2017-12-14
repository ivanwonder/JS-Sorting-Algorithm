function swap (array = [], begin = 0, end = 0) {
  array[begin] = array[begin] + array[end]
  array[end] = array[begin] - array[end]
  array[begin] = array[begin] - array[end]
}

export {
  swap
}
