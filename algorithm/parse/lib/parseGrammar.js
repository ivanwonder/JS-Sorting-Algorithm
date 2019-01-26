import { invariant } from "../../../lib/unit";

const TOKEN_TYPE = {
  terminal: "terminal",
  nonterminal: "nonterminal"
};

class TOKEN {
  constructor(key, value, type) {
    this.key = key;
    this.type = type;
    this.value = value;
  }
}

function wrapSymbol(token) {
  return function(sym) {
    let key = "";
    let value = "";
    let type = "";
    const isTerminal = !!token.terminal[sym];
    if (!isTerminal) {
      const isNonterminal =
        token.nonterminal.findIndex(item => item === sym) > -1;
      if (isNonterminal) {
        type = TOKEN_TYPE.nonterminal;
        key = value = sym;
      }
    } else {
      type = TOKEN_TYPE.terminal;
      key = sym;
      value = token.terminal[key];
    }

    invariant(!!type, "can not find the type!!");
    return new TOKEN(key, value, type);
  };
}

class Sentence {
  constructor(left) {
    this.left = left;
    this.right = [];
  }
  add(symbol) {
    this.right.push(symbol);
  }
}

function checkSymbolMinLength(grammar, symbolMinLength) {
  let haveChange = false;

  grammar.forEach(item => {
    const right = item.right;
    const length = right.length;

    let minLength = 0;
    let haveMinLength = true;

    loop: for (let i = 0; i < length; i++) {
      switch (right[i].type) {
        case TOKEN_TYPE.terminal:
          if (right[i] !== "") {
            minLength += 1;
          }
          break;
        case TOKEN_TYPE.nonterminal:
          const _length = symbolMinLength[right[i].key];
          if (typeof _length === "number") {
            minLength += _length;
          } else {
            haveMinLength = false;
            break loop;
          }
          break;
      }
    }

    const preLength = symbolMinLength[item.left.key];
    if (haveMinLength && (typeof preLength !== "number" || preLength > minLength)) {
      haveChange = true;
      symbolMinLength[item.left.key] = minLength;
    }
  });

  if (haveChange) {
    checkSymbolMinLength(grammar, symbolMinLength);
  }
}

function parseGrammar(input, token) {
  let index = 0;
  const length = input.length;
  const derivationSymbol = "->";
  const ORSymbol = "|";
  let cacheSymbol = "";
  const grammar = [];
  let currentSentence;
  let leftSymbol;

  const getToken = wrapSymbol(token);

  while (index < length) {
    const code = input.codePointAt(index);
    if (code === 32) {
      if (cacheSymbol === derivationSymbol) {
        currentSentence = new Sentence(leftSymbol);
      } else if (cacheSymbol === ORSymbol) {
        invariant(currentSentence, "'|' occur in wrong place!!");
        grammar.push(currentSentence);
        currentSentence = new Sentence(leftSymbol);
      } else {
        const token = getToken(cacheSymbol);
        if (!leftSymbol) leftSymbol = token;
        if (currentSentence) currentSentence.add(token);
      }
      cacheSymbol = "";
    } else if (code === 10) {
      if (currentSentence) {
        invariant(
          cacheSymbol !== derivationSymbol || cacheSymbol !== ORSymbol,
          "wrong enter!!"
        );
        const token = getToken(cacheSymbol);
        currentSentence.add(token);
        grammar.push(currentSentence);
        currentSentence = null;
      }
      leftSymbol = null;
      cacheSymbol = "";
    } else {
      cacheSymbol += input[index];
    }
    ++index;
  }

  const startGrammar = [];
  grammar.forEach(_item => {
    const isStart =
      token.start.findIndex(__item => __item === _item.left.value) > -1;
    if (isStart) {
      startGrammar.push(_item);
    }
  });

  const symbolMinLength = {};
  checkSymbolMinLength(grammar, symbolMinLength);

  // console.log(symbolMinLength);

  return { grammar, start: startGrammar, symbolMinLength };
}

export { parseGrammar, TOKEN_TYPE };
