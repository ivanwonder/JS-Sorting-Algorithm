function swap(array = [], begin = 0, end = 0) {
  array[begin] = array[begin] + array[end];
  array[end] = array[begin] - array[end];
  array[begin] = array[begin] - array[end];
}

function isUndefined(data) {
  return typeof data === "undefined";
}

function isNull(variable) {
  return variable === null && typeof variable === "object";
}

function isNumber(num) {
  return typeof num === "number";
}

function invariant(condition, format, ...args) {
  if (!condition) {
    let error;
    if (format === undefined) {
      error = new Error(
        "Minified exception occurred; use the non-minified dev environment " +
          "for the full error message and additional helpful warnings."
      );
    } else {
      let argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() {
          return args[argIndex++];
        })
      );
      error.name = "Invariant Violation";
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

export { swap, isUndefined, isNumber, invariant, isNull };
