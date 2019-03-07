import { invariant } from "../../../lib/unit";

const SPACE = " ";
const ENTER = `
`;
export const LEFT_BRACKET = "{";
const RIGHT_BARCKET = "}";
const END = ";";

class Grammar {
  constructor() {
    this._index = 0;
    this._stack = [];
  }
  parse(input) {
    this._input = input;
  }

  _parseSentence() {
    let token = "";
    while (this._index < this._input.length) {
      const _character = this._input[this._index++];
      if (_character === LEFT_BRACKET) {
        this._stack.push(LEFT_BRACKET);
        token += _character;
      } else if (_character === RIGHT_BARCKET) {
        const _popCharacter = this._stack.pop();
        invariant(_popCharacter === LEFT_BRACKET, "wrong stack instance");
        if (this._stack.length === 0) {
          return LEFT_BRACKET + token + RIGHT_BARCKET;
        } else {
          token += _character;
        }
      } else {
        token += _character;
      }
    }

    invariant(false, "no close barcket found");
  }

  nextToken() {
    let token = "";
    while (this._index < this._input.length) {
      const _character = this._input[this._index++];
      if (_character === SPACE || _character === ENTER) {
        if (token === "") {
          continue;
        } else {
          return token;
        }
      } else if (_character === END) {
        if (token === "") {
          return END;
        } else {
          this._index--;
          return token;
        }
      } else if (_character === LEFT_BRACKET) {
        if (token === "") {
          invariant(this._stack.length === 0, "the stack should be empty");
          this._stack.push(_character);
          return this._parseSentence();
        } else {
          invariant(false, "do not use { in the name");
        }
      } else {
        token += _character;
      }
    }

    return token;
  }
}

export { Grammar };
