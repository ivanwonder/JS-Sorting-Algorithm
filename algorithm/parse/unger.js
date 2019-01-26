import { parseGrammar, TOKEN_TYPE } from "./lib/parseGrammar";
import { cloneDeep } from "lodash";
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
    grammar.forEach(element => {
      if (element.left.value === this._terminal) {
        this.analyze(element, [], 0, 0);
      }
    });
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
    const _table = cloneDeep(table);
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
}

class Unger {
  constructor(input, token) {
    this._input = input;
    this._token = token;
    this._grammar = parseGrammar(input, token);
    this._partitions = [];
  }

  parse(input) {
    // const start = this._grammar.start;
    this._token.start.forEach(item => {
      console.log(this.beginPartitions(new Partitions(item, input)));
    });
    // console.log(this._partitions);
  }

  beginPartitions(partitions) {
    const cachePartition = [];
    // const partitions = new Partitions(terminal, input);
    const cutOff = this._partitions.find(item => item.equal(partitions));
    if (cutOff) {
      // TODO set cutoff valid false
      return null;
    }
    this._partitions.push(partitions);
    partitions.partition(this._grammar.grammar);
    partitions._table.forEach(item => {
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
            if (
              _item.data[i].value.length <
              this._grammar.symbolMinLength[sentence[i].key]
            ) {
              return false;
            }
          }
        }
        return true;
      });
      item.table.forEach(_itemtable => {
        const _item = _itemtable.data;
        _itemtable.valid = true;
        for (let i = 0; i < length; i++) {
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
