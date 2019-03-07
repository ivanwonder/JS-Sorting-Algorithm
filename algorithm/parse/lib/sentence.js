import { Grammar } from "./grammar";
import { invariant } from "../../../lib/unit";
import { Token, TokenMap } from "./token";

class Sentence {
  constructor(left) {
    this.left = left;
    this.right = [];
  }
  add(symbol) {
    this.right.push(symbol);
  }
}

export class SentenceGenerate {
  constructor(input, token) {
    this._input = input;
    this._token = token;
  }

  generate() {
    const grammar = new Grammar();
    grammar.parse(this._input);
    let token = grammar.nextToken();
    const tokenMap = new TokenMap(this._token);

    let _sentenceBegin = true;
    let sentence = [];
    let leftToken = null;
    let _index = 0;

    while (token) {
      const _tokenType = tokenMap.get(token);
      if (_sentenceBegin) {
        invariant(_tokenType instanceof Token, "the left token type is wrong");
        leftToken = new Sentence(_tokenType);
        _sentenceBegin = false;
      } else {
        if (token === "->") {
          invariant(_index === 1, "-> use in wrong place");
        } else if (token === "|") {
          sentence.push(leftToken);
          leftToken = new Sentence(leftToken.left);
        } else if (token === ";") {
          sentence.push(leftToken);
          _sentenceBegin = true;
          leftToken = null;
          _index = -1;
        } else {
          leftToken.add(_tokenType);
        }
      }
      token = grammar.nextToken();
      _index++;
    }

    if (leftToken) {
      sentence.push(leftToken);
    }

    TokenMap.ins = tokenMap;
    return sentence;
  }
}
