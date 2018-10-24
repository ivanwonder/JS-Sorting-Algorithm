const shift = 9;
const divide = "%".charCodeAt();

function encodeCharacterLessNine(str) {
  let index = 0;
  while (index < str.length) {
    const code = str.charCodeAt(index);
    if (code < shift || code === divide) {
      const left = str.substring(0, index);
      const right = str.substring(index + 1);
      str = left + "%" + String.fromCharCode(code + shift) + right;
      index += 2;
    } else {
      index++;
    }
  }
  return str;
}

function decodeCharacterLessNine(str) {
  let index = 0;
  while (index < str.length - 1) {
    if (str.charCodeAt(index) === divide) {
      const left = str.substring(0, index);
      const right = str.substring(index + 2);
      const code = str.charCodeAt(index + 1) - shift;
      str = left + String.fromCharCode(code) + right;
    }
    index++;
  }
  return str;
}

export {
  encodeCharacterLessNine,
  decodeCharacterLessNine
}
