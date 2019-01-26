import { parseGrammar, TOKEN_TYPE } from "./lib/parseGrammar";
import { invariant } from "../../lib/unit";

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
      if (element.left.value === this._terminal) {
        this.analyze(element, [], 0, 0);
      }
    });
    this._table = this.copyTable();
    this.filterTable(grammar.symbolMinLength);
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

  analyze(sentence, table, sentenceIndex, inputIndex) {
    // the table element is json, when use concat to get new table, the element before the concat data is the same, it's a shallow copy. so make sure use the copyTable method.
    const _table = table;
    const sentenceLength = sentence.right.length;
    const inputLength = this._input.length;
    if (sentenceIndex === sentenceLength - 1) {
      const __table = _table.concat(this._getSubInput(inputIndex));
      this._addTable(sentence, __table);
      return;
    }

    this.analyze(
      sentence,
      _table.concat({
        isEmpty: true,
        value: ""
      }),
      sentenceIndex + 1,
      inputIndex
    );

    for (let i = inputIndex; i < inputLength; i++) {
      this.analyze(
        sentence,
        _table.concat(this._getSubInput(inputIndex, i + 1)),
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

  filterTable(symbolMinLength) {
    this._table.forEach(item => {
      const sentence = item.sentence.right;
      const length = sentence.length;

      // filter the partition by comparing the terminal;
      item.table = item.table.filter(_item => {
        for (let i = 0; i < length; i++) {
          if (sentence[i].type === TOKEN_TYPE.terminal) {
            if (
              _item.data[i].isEmpty ||
              _item.data[i].value !== sentence[i].value
            ) {
              return false;
            }
          } else if (sentence[i].type === TOKEN_TYPE.nonterminal) {
            if (_item.data[i].value.length < symbolMinLength[sentence[i].key]) {
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
          isEmpty: _item.isEmpty,
          value: _item.value
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

    this._token.start.forEach(item => {
      console.log(this.beginPartitions(new Partitions(item, input)));
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
      const length = sentence.length;

      item.table.forEach(_itemtable => {
        const _item = _itemtable.data;
        _itemtable.valid = true;
        for (let i = 0; i < length; i++) {
          // TODO: the terminal alawys return true, because the false have been filter by partition;
          if (sentence[i].type === TOKEN_TYPE.terminal) {
            if (_item[i].isEmpty) {
              _item[i].valid = false;
            } else {
              _item[i].valid = _item[i].value === sentence[i].value;
            }
          } else {
            invariant(!_item[i].next, "wrong!!");
            const _partitions = new Partitions(
              sentence[i].value,
              _item[i].value
            );
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
