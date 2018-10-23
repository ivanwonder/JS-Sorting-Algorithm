import { TST } from "./Tries";
import { invariant } from "../lib/unit";

class BinaryIn {
  static inData = "";
  static buffer = 0;
  static bufferLength = 0;
  static end = false;
  // static init = false;

  static initialize(inData = "") {
    BinaryIn.buffer = 0;
    BinaryIn.bufferLength = 0;
    // BinaryIn.init = true;
    BinaryIn.end = false;
    BinaryIn.inData = inData;
  }

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
  static outData = "";
  static buffer = 0;
  static bufferLength = 0;
  static init = false;

  static initialize(outData = "") {
    BinaryOut.buffer = 0;
    BinaryOut.bufferLength = 0;
    BinaryOut.init = true;
    BinaryOut.outData = outData;
  }

  static clearBuffer() {
    if (!BinaryOut.init) {
      BinaryOut.initialize();
    }

    if (BinaryOut.bufferLength) {
      BinaryOut.outData += String.fromCharCode(BinaryOut.buffer << (16 - BinaryOut.bufferLength));
    }
    BinaryOut.buffer = 0;
    BinaryOut.bufferLength = 0;
  }

  static writeBit(bit) {
    if (!BinaryOut.init) {
      BinaryOut.initialize();
    }
    BinaryOut.buffer <<= 1;
    if (bit) BinaryOut.buffer |= 1;
    BinaryOut.bufferLength++;

    if (BinaryOut.bufferLength === 16) {
      BinaryOut.clearBuffer();
    }
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

  /**
   * @param {string} str
   */
  static writeString(str, width = 8) {
    for (let i = 0; i < str.length; i++) {
      BinaryOut.write(str.charCodeAt(i), width);
    }
  }

  static close() {
    BinaryOut.clearBuffer();
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
    BinaryIn.initialize();
    BinaryOut.initialize();

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
      if (_len < _str.length && begin < LZW.codewordsCount) {
        tst.put(_str.substring(0, _len + 1), begin);
      }
      _str = _str.substring(longPrefix.length);
    }
    BinaryOut.write(LZW.charCount, LZW.codewordsWidth);
    BinaryOut.close();

    return BinaryOut.outData;
  }

  /**
   * @param {string} str
   */
  static expand(str) {
    BinaryIn.initialize(str);
    BinaryOut.initialize();

    let codewords = BinaryIn.readInt(LZW.codewordsWidth);
    const table = [];
    let shift = 0;

    for (; shift < LZW.charCount; shift++) {
      table[shift] = String.fromCharCode(shift);
    }

    shift++;
    let preChar = table[codewords];

    while (true) {
      BinaryOut.writeString(preChar);
      codewords = BinaryIn.readInt(LZW.codewordsWidth);
      if (codewords === LZW.charCount) break;
      if (shift < LZW.codewordsCount) {
        if (shift === codewords) {
          table[shift++] = preChar + preChar.charAt(0);
        } else {
          table[shift++] = preChar + table[codewords].charAt(0);
        }
      }
      preChar = table[codewords];
    }

    BinaryOut.close();
    return BinaryOut.outData;
  }
}

export { LZW, BinaryIn, BinaryOut };
