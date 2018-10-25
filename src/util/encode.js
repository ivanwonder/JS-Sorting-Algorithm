const shift = 33;
const divide = "%".charCodeAt();

// encode the control-character in Unicode, some of them can not be cut.
const isControlCharacter = code =>
  (code >= 0 && code <= 31) || (code >= 127 && code <= 159);

function encodeCharacterLessNine(str) {
  let index = 0;
  while (index < str.length) {
    const code = str.charCodeAt(index);
    if (isControlCharacter(code) || code === divide) {
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

function encodeToHex(str) {
  let _str = "";
  let index = 0;
  while (index < str.length) {
    _str += str
      .charCodeAt(index)
      .toString(16)
      .padStart(4, 0);
    index++;
  }
  return _str;
}

function decodeFromHex(str) {
  let _str = "";
  let index = 0;
  while (index < str.length) {
    const res = str.substring(index, index + 4);
    _str += String.fromCharCode(parseInt(`0x${res}`, 16));
    index += 4;
  }
  return _str;
}

export { encodeCharacterLessNine, decodeCharacterLessNine, encodeToHex, decodeFromHex };
