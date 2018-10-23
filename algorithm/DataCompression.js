import { TST } from "./Tries";
import { invariant } from "../lib/unit";

class BinaryIn {
  static inData = "";
  static buffer = 0;
  static bufferLength = 0;
  static end = true;

  static readString(str) {
    BinaryIn.inData = str;
    let _str = "";
    while (!BinaryIn.isEmpty()) {
      _str += String.fromCharCode(BinaryIn.readInt());
    }
    return _str;
  }
  static fillBuffer() {
    if (BinaryIn.inData.length) {
      BinaryIn.bufferLength = 16;
      BinaryIn.buffer = BinaryIn.inData.charCodeAt(0);
      BinaryIn.inData = BinaryIn.inData.substring(1);
      BinaryIn.end = false;
    } else {
      BinaryIn.end = true;
    }
  }

  static isEmpty() {
    if (!BinaryIn.bufferLength && !BinaryIn.end) {
      BinaryIn.fillBuffer();
    }
    return BinaryIn.end;
  }

  static readBoolean() {
    invariant(!BinaryIn.isEmpty(), "no more data");
    BinaryIn.bufferLength--;
    const data = ((BinaryIn.buffer >> BinaryIn.bufferLength) & 1) === 1;
    if (BinaryIn.bufferLength === 0) {
      BinaryIn.fillBuffer();
    }
    return data;
  }

  static readInt(width = 8) {
    let data = 0;
    for (let i = 0; i < width; i++) {
      data <<= 1;
      if (BinaryIn.readBoolean()) {
        data |= 1;
      }
    }
    return data;
  }
}

class BinaryOut {
  static buffer = "";

  static writeBit(bit) {
    BinaryOut.buffer += bit ? "1" : "0";
  }

  static write(char, width) {
    invariant(width >= 1 && width <= 16, "Illegal value for width = " + width);
    invariant(
      !(char >= 1 << width),
      "Illegal " + width + "-bit char = " + char
    );
    for (let i = 0; i < width; i++) {
      const bit = ((char >>> (width - i - 1)) & 1) === 1;
      BinaryOut.writeBit(bit);
    }
  }
}

class LZW {
  static charCount = Math.pow(2, 8);
  static codewordsWidth = 12;
  static codewordsCount = Math.pow(2, LZW.codewordsWidth);

  /**
   * @param {string} str
   */
  static compress(str) {
    const tst = new TST();
    for (let i = 0; i < LZW.charCount; i++) {
      tst.put(String.fromCharCode(i), i);
    }

    let _str = BinaryIn.readString(str);
    let begin = LZW.charCount;
    while (_str.length) {
      const longPrefix = tst.longestPrefixOf(_str);
      BinaryOut.write(tst.get(longPrefix), LZW.codewordsWidth);
      const _len = longPrefix.length;
      begin++;
      if (_len < _str.length && begin < LZW.charCount) {
        tst.put(_str.substring(0, _len + 1), begin);
      }
      _str = _str.substring(longPrefix.length);
    }
    BinaryOut.write(LZW.charCount, LZW.codewordsWidth);
    console.log(BinaryOut.buffer);
  }
}

export { LZW, BinaryIn, BinaryOut };
