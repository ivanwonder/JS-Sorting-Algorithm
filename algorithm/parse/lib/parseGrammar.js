import { invariant } from "../../../lib/unit";
import { SentenceGenerate } from "./sentence";
import { Empty } from "./token";

const TOKEN_TYPE = {
  terminal: "terminal",
  nonterminal: "nonterminal"
};

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
          minLength += 1;
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
    if (
      haveMinLength &&
      (typeof preLength !== "number" || preLength > minLength)
    ) {
      haveChange = true;
      symbolMinLength[item.left.key] = minLength;
    }
  });

  if (haveChange) {
    checkSymbolMinLength(grammar, symbolMinLength);
  }
}

function addToMap(map, data) {
  let haveChange = false;
  if (typeof data === "string") {
    haveChange = !map.has(data);
    if (haveChange) {
      map.add(data);
    }
  } else {
    data.forEach(item => {
      // the empty symbol will be processed independently;
      if (item === "") {
        return;
      }
      if (!map.has(item)) {
        haveChange = true;
        map.add(item);
      }
    });
  }

  return haveChange;
}

function firstNonterminal(grammar, prefix) {
  let haveChange = false;
  grammar.forEach(item => {
    const left = item.left;
    const right = item.right;
    let _cache = prefix[left.key];
    if (!_cache) {
      _cache = new Set();
      prefix[left.key] = _cache;
    }
    for (let i = 0; i < right.length; i++) {
      if (right[i].type === TOKEN_TYPE.terminal) {
        if (addToMap(_cache, right[i].key)) {
          haveChange = true;
        } else {
        }
        break;
      }
      if (right[i].type === TOKEN_TYPE.nonterminal) {
        const _rightCache = prefix[right[i].key];
        if (_rightCache) {
          if (addToMap(_cache, _rightCache)) {
            haveChange = true;
          }
          if (_rightCache.has("")) {
            if (i === right.length - 1) {
              if (!_cache.has("")) {
                _cache.add("");
                haveChange = true;
              }
            }
            continue;
          }
          break;
        } else {
          break;
        }
      }

      if (right[i] instanceof Empty) {
        invariant(
          i === right.length - 1 && i === 0,
          "empty must in a single sentence!!!"
        );
        if (!_cache.has("")) {
          _cache.add("");
          haveChange = true;
        }
        break;
      }

      break;
    }
  });

  if (haveChange) {
    firstNonterminal(grammar, prefix);
  }
}

function parseGrammar(input, token) {
  // let index = 0;
  // const length = input.length;
  // const derivationSymbol = "->";
  // const ORSymbol = "|";
  // let cacheSymbol = "";
  // const grammar = [];
  // let currentSentence;
  // let leftSymbol;

  // const getToken = wrapSymbol(token);

  // while (index < length) {
  //   const code = input.codePointAt(index);
  //   if (code === 32) {
  //     if (cacheSymbol === derivationSymbol) {
  //       currentSentence = new Sentence(leftSymbol);
  //     } else if (cacheSymbol === ORSymbol) {
  //       invariant(currentSentence, "'|' occur in wrong place!!");
  //       grammar.push(currentSentence);
  //       currentSentence = new Sentence(leftSymbol);
  //     } else {
  //       const token = getToken(cacheSymbol);
  //       if (!leftSymbol) leftSymbol = token;
  //       if (currentSentence) currentSentence.add(token);
  //     }
  //     cacheSymbol = "";
  //   } else if (code === 10) {
  //     if (currentSentence) {
  //       invariant(
  //         cacheSymbol !== derivationSymbol || cacheSymbol !== ORSymbol,
  //         "wrong enter!!"
  //       );
  //       const token = getToken(cacheSymbol);
  //       currentSentence.add(token);
  //       grammar.push(currentSentence);
  //       currentSentence = null;
  //     }
  //     leftSymbol = null;
  //     cacheSymbol = "";
  //   } else {
  //     cacheSymbol += input[index];
  //   }
  //   ++index;
  // }

  const grammar = new SentenceGenerate(input, token).generate();

  const startGrammar = [];
  grammar.forEach(_item => {
    const isStart =
      token.start.findIndex(__item => __item === _item.left.key) > -1;
    if (isStart) {
      startGrammar.push(_item);
    }
  });

  const symbolMinLength = {};
  checkSymbolMinLength(grammar, symbolMinLength);

  const prefix = {};
  firstNonterminal(grammar, prefix);

  console.log({ grammar, start: startGrammar, symbolMinLength, prefix });

  return { grammar, start: startGrammar, symbolMinLength, prefix };
}

export { parseGrammar, TOKEN_TYPE };
