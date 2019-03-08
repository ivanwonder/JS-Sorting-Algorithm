import { parseGrammar, TOKEN_TYPE } from "./lib/parseGrammar";
import { invariant } from "../../lib/unit";
import { Transform, TokenMap, Empty } from "./lib/token";

const SPACE_SYMBOL = " ";

// const token = {
//   terminal: {
//     "+": "+",
//     "*": "*",
//     "(": "(",
//     ")": ")",
//     "i": "i"
//   },
//   nonterminal: ["Expr", "Term", "Factor"],
//   start: ["Expr"]
// };

// const input = `
// Expr -> Expr + Term | Term
// Term -> Term * Factor | Factor
// Factor -> ( Expr ) | i
// `;

class Expressions {
  constructor(value) {
    this.value = value;
  }
}

// split the input into expressions;
function parseInput(input, separators = []) {
  const length = input.length;
  const expressions = [];

  let temporaryCache = "";
  let index = 0;

  const saveExpression = () => {
    if (temporaryCache) {
      expressions.push(new Expressions(temporaryCache));
      temporaryCache = "";
    }
  };

  while (index < length) {
    if (input[index] === SPACE_SYMBOL) {
      saveExpression();
    } else if (separators.includes(input[index])) {
      saveExpression();

      // treat the separators as a part of expression;
      temporaryCache = input[index];
      saveExpression();
    } else {
      temporaryCache += input[index];
    }
    index++;
  }

  saveExpression();

  return expressions;
}

class Partitions {
  constructor(terminal, input) {
    this._terminal = terminal;
    this._input = input;
    this._table = [];
    this.valid = false;
  }

  equal(other) {
    return this._terminal === other._terminal && this._input === other._input;
  }

  partition(grammar) {
    grammar.grammar.forEach(element => {
      if (element.left.key === this._terminal) {
        this.analyze(element, [], 0, 0);
      }
    });
    this._table = this.copyTable();
    this.filterTable(grammar.symbolMinLength, grammar.prefix);
  }

  _getSubInput(begin, end) {
    const inputLength = this._input.length;
    if (begin >= inputLength) {
      return {
        isEmpty: true,
        value: ""
      };
    }
    return {
      isEmpty: false,
      value: this._input.substring(begin, end)
    };
  }

  _partitionInput(table, begin, end) {
    const _table = [];
    Object.assign(_table, table);
    _table.push({ res: this._input.slice(begin, end) });
    return _table;
  }

  _emptyPartition(table) {
    const _table = [];
    Object.assign(_table, table);
    _table.push({ res: [] });
    return _table;
  }

  analyze(sentence, table, sentenceIndex, inputIndex) {
    // the table element is json, when use concat to get new table, the element before the concat data is the same, it's a shallow copy. so make sure use the copyTable method.
    const _table = table;
    let sentenceLength = sentence.right.length;
    if (
      sentenceLength &&
      sentence.right[sentenceLength - 1] instanceof Transform
    ) {
      sentenceLength--;
    }
    const inputLength = this._input.length;
    if (sentenceIndex === sentenceLength - 1) {
      // const __table = _table.concat(this._getSubInput(inputIndex));
      const __table = this._partitionInput(_table, inputIndex);
      this._addTable(sentence, __table);
      return;
    }

    this.analyze(
      sentence,
      this._emptyPartition(_table),
      sentenceIndex + 1,
      inputIndex
    );

    for (let i = inputIndex; i < inputLength; i++) {
      this.analyze(
        sentence,
        // _table.concat(this._getSubInput(inputIndex, i + 1)),
        this._partitionInput(_table, inputIndex, i + 1),
        sentenceIndex + 1,
        i + 1
      );
    }
  }

  _addTable(sentence, table) {
    const _table = this._table.find(item => item.sentence === sentence);
    if (_table) {
      _table.table.push({
        data: table,
        valid: false
      });
    } else {
      this._table.push({
        sentence,
        table: [{ data: table, valid: false }],
        valid: false
      });
    }
  }

  _getTableCell(table, i) {
    return table.data[i].res;
  }

  filterTable(symbolMinLength, prefix) {
    this._table.forEach(item => {
      const sentence = item.sentence.right;
      let length = sentence.length;
      if (length && sentence[length - 1] instanceof Transform) {
        length--;
      }

      // filter the partition by comparing the terminal;
      item.table = item.table.filter(_item => {
        for (let i = 0; i < length; i++) {
          if (sentence[i].type === TOKEN_TYPE.terminal) {
            if (
              this._getTableCell(_item, i).length === 0 ||
              this._getTableCell(_item, i).length > 1 ||
              // this._getTableCell(_item, i)[0].value !== sentence[i].value
              !sentence[i].reg.test(this._getTableCell(_item, i)[0].value)
            ) {
              return false;
            }
          } else if (sentence[i] instanceof Empty) {
            return this._getTableCell(_item, i).length === 0;
          } else if (sentence[i].type === TOKEN_TYPE.nonterminal) {
            const _value = this._getTableCell(_item, i);
            const _map = prefix[sentence[i].key];
            if (_value.length < symbolMinLength[sentence[i].key]) {
              return false;
            }
            if (_value.length === 0 && !_map.has("")) {
              return false;
            }

            const checkPrefix = (map, value) => {
              let flag = false;
              map.forEach(item => {
                if (item && TokenMap.ins.get(item).reg.test(value)) {
                  flag = true;
                }
              });

              return flag;
            };
            if (_value.length && !checkPrefix(_map, _value[0].value)) {
              return false;
            }
          }
        }
        return true;
      });
    });
  }

  copyTable() {
    const copyFirst = item => {
      return item.map(_item => copySecond(_item));
    };

    const copySecond = item => {
      // the sentence will not be modified. no need to deep copy;
      return {
        sentence: item.sentence,
        table: copyThird(item.table)
      };
    };

    const copyThird = item => {
      return item.map(_item => {
        return {
          data: copyFour(_item.data),
          valid: _item.valid
        };
      });
    };

    const copyFour = item => {
      return item.map(_item => {
        return {
          res: _item.res
        };
      });
    };

    return copyFirst(this._table);
  }
}

class Unger {
  constructor(input, token) {
    this._input = input;
    this._token = token;
    this._grammar = parseGrammar(input, token);
    this._partitions = [];

    this.cacheAllPartitionTable = [];

    this.__testSavedTime = 0;
    this.__testTotalTime = 0;
  }

  parse(input) {
    // const start = this._grammar.start;
    const __testStart = new Date().getTime();

    console.log(parseInput(input, this._token.separators));

    const _input = parseInput(input, this._token.separators);

    this._token.start.forEach(item => {
      console.log(this.beginPartitions(new Partitions(item, _input)));
    });

    this.__testTotalTime = new Date().getTime() - __testStart;
    console.log(this.__testSavedTime);
    console.log(this.__testTotalTime);
    console.log(this.__testSavedTime / this.__testTotalTime);
  }

  beginPartitions(partitions) {
    const cachePartition = [];

    const cutOff = this._partitions.find(item => item.equal(partitions));
    if (cutOff) {
      return null;
    }
    this._partitions.push(partitions);

    const __testStart = new Date().getTime();

    const _cache = this.cacheAllPartitionTable.find(item =>
      item.equal(partitions)
    );

    if (_cache) {
      partitions._table = _cache.copyTable();
      this.__testSavedTime += new Date().getTime() - __testStart;
    } else {
      partitions.partition(this._grammar);
      this.cacheAllPartitionTable.push(partitions);
    }

    partitions._table.forEach(item => {
      const sentence = item.sentence.right;
      let length = sentence.length;
      if (length && sentence[length - 1] instanceof Transform) {
        length--;
      }

      item.table.forEach(_itemtable => {
        const _item = _itemtable.data;
        _itemtable.valid = true;
        for (let i = 0; i < length; i++) {
          // TODO: the terminal alawys return true, because the false have been filter by partition;
          // if (sentence[i].type === TOKEN_TYPE.terminal || (sentence)) {
          //   if (_item[i].res.length === 0 || _item[i].res.length > 1) {
          //     _item[i].valid = false;
          //   } else {
          //     // _item[i].valid = _item[i].res[0].value === sentence[i].value;
          //     _item[i].valid = sentence[i].reg.test(_item[i].res[0].value);
          //   }
          // }
          if (sentence[i].type === TOKEN_TYPE.nonterminal) {
            invariant(!_item[i].next, "wrong!!");
            const _partitions = new Partitions(sentence[i].key, _item[i].res);
            const cachedPartition = cachePartition.find(item =>
              item.equal(_partitions)
            );
            if (cachedPartition) {
              _item[i].next = cachedPartition;
            } else {
              // if the partitions have been partitioned. the next will be null;
              _item[i].next = this.beginPartitions(_partitions);
              if (_item[i].next) {
                cachePartition.push(_item[i].next);
              }
            }
            const _next = _item[i].next;
            if (_next) {
              _item[i].valid = _next.valid;
            }
          } else {
            // here alawys return true, because the false have been filter by partition;
            _item[i].valid = true;
          }
          if (!_item[i].valid) {
            _itemtable.valid = false;
            break;
          }
        }
        if (_itemtable.valid) {
          item.valid = true;
          partitions.valid = true;
        }
      });
    });

    this._partitions.pop();
    return partitions;
  }
}

export { Unger };
