function showResult (name, arg) { // eslint-disable-line no-unused-vars
  console.log(arg)
  if (arg instanceof Array) {
    document.getElementById('sort-result').innerHTML = `${name}: [${arg.join(',')}]`
  }
}

var showInDom = function () {
  var array = []
  var index = 0

  var method = {
    renderString: function (name, arg) {
      return `<p>${name}: [${arg.join(',')}]</p>`
    }
  }

  var next = function (str) {
    str = str || ''
    if (index >= array.length) {
      document.getElementById('sort-result').innerHTML = str
      return
    }

    var _array = array[index]
    var _res
    try {
      _res = _array.method(_array.name, _array.arg)
    } catch (e) {
    }
    index++
    if (typeof _res === 'string') {
      str += _res
      next(str)
    }
  }

  setTimeout(() => {
    index = 0
    next()
  }, 0)

  return {
    show: function (name, arg) {
      array.push({
        name,
        arg,
        method: method.renderString
      })
      return this
    }
  }
}

export default showResult
export {
  showInDom
}
