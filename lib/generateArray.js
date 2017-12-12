var getInputDOM = (function () {
  var input
  return function () {
    return input || (input = document.getElementById('array-input'))
  }
})()

function getGenerateArray () {
  var input = getInputDOM()
  var inputData = input.value.replace(' ', '')

  var inputArray = inputData.split(',')
  return inputArray.map(value => Number(value))
}

function setDefaultArray (str) {
  var input = getInputDOM()
  input.value = str
}

function judgeTheString () {
  var input = getInputDOM()
  var inputData = input.value.replace(' ', '')
  var regExpForInput = /([^\d,]+|^,|,$|,{2,})/g

  if (regExpForInput.test(inputData)) {
    input.style.borderColor = 'red'
    alert('请输入正确的数组，且是数字，以","分割')
    return false
  } else {
    input.style.borderColor = ''
  }
  return true
}
export default getGenerateArray
export {
  setDefaultArray,
  judgeTheString
}
