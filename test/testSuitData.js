var testArray = [
  [1],
  [1, 2],
  [2, 1],
  [1, 3, 2],
  [3, 2, 1],
  [0, 56, 12, 32],
  [1, 2, 1, 4, 3]
]
var testArrayResult = [
  [1],
  [1, 2],
  [1, 2],
  [1, 2, 3],
  [1, 2, 3],
  [0, 12, 32, 56],
  [1, 1, 2, 3, 4]
]

function getTestArray () {
  var _slice = value => value.slice()

  return [testArray.map(_slice), testArrayResult.map(_slice)]
}

export {
  getTestArray
}
