import { LEFT_BRACKET } from "./grammar";

export class Token {
  constructor(key, type, reg, value) {
    this.key = key;
    this.reg = reg;
    this.value = value;
    this.type = type;
  }
}

export class Transform {
  constructor (value) {
    this.value = value;
  }
}

export class Operator {
  constructor(key) {
    this.key = key;
  }
}

export class Empty {

}

export const TERMINAL = "terminal";
export const NON_TERMINAL = "nonterminal";
export const OPERATOR = "operator";

class TokenGenerate {
  constructor(token) {
    this._token = token;
  }

  _isTerminal(symbol) {
    return typeof this._token.terminal[symbol] === "string";
  }

  _isNonTerminal(symbol) {
    return this._token.nonterminal.findIndex(item => item === symbol) > -1;
  }

  _isTransform(symbol) {
    return symbol[0] === LEFT_BRACKET;
  }

  _isEmpty(symbol) {
    return symbol === "~";
  }

  get(symbol) {
    if (this._isTerminal(symbol)) {
      const value = this._token.terminal[symbol];
      return new Token(symbol, TERMINAL, new RegExp(value), value);
    } else if (this._isNonTerminal(symbol)) {
      return new Token(symbol, NON_TERMINAL);
    } else if (this._isTransform(symbol)) {
      return new Transform(symbol);
    } else if (this._isEmpty(symbol)) {
      return new Empty();
    } else {
      return new Operator(symbol);
    }
  }
}

class TokenMap {
  constructor(token) {
    this._map = new Map();
    this._token = token;
    this._tokenGenerate = new TokenGenerate(token);
  }

  _build() {
    Object.keys(this._token.terminal).forEach(item => {
      if (!this._map.has(item)) {
        this._map.set(item, this._tokenGenerate.get(item));
      }
    });
    this._token.forEach(item => {
      if (!this._map.has(item)) {
        this._map.set(item, this._tokenGenerate.get(item));
      }
    });
  }

  get(symbol) {
    const val = this._map.get(symbol);
    if (val) {
      return val;
    } else {
      const _val = this._tokenGenerate.get(symbol);
      this._map.set(symbol, _val);
      return _val;
    }
  }
}

export {
  TokenMap
}
