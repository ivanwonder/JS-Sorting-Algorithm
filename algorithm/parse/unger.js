import { parseGrammar, TOKEN_TYPE } from "./lib/parseGrammar";

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
    const sentenceLength = sentence.right.length;
    const inputLength = this._input.length;
    if (sentenceIndex === sentenceLength - 1) {
      const _table = table.concat(this._getSubInput(inputIndex));
      this._addTable(sentence, _table);
      return;
    }

    this.analyze(
      sentence,
      table.concat({
        isEmpty: true,
        value: ""
      }),
      sentenceIndex + 1,
      inputIndex
    );

    for (let i = inputIndex; i < inputLength; i++) {
      this.analyze(
        sentence,
        table.concat(this._getSubInput(inputIndex, i + 1)),
        sentenceIndex + 1,
        i + 1
      );
    }
  }

  _addTable(sentence, table) {
    const _table = this._table.find(item => item.sentence === sentence);
    if (_table) {
      _table.table.push(table);
    } else {
      this._table.push({
        sentence,
        table: [table]
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
      console.log(this.beginPartitions(item, input));
    });
    // console.log(this._partitions);
  }

  beginPartitions(terminal, input) {
    const partitions = new Partitions(terminal, input);
    const cutOff = this._partitions.find(item => item.equal(partitions));
    if (cutOff) {
      // TODO set cutoff valid false
      return "hihi";
    }
    this._partitions.push(partitions);
    partitions.partition(this._grammar.grammar);
    // console.log(partitions._table);
    partitions._table.forEach(item => {
      const sentence = item.sentence.right;
      item.table.forEach(_item => {
        const length = _item.length;
        for (let i = 0; i < length; i++) {
          if (sentence[i].type === TOKEN_TYPE.terminal) {
            if (_item[i].isEmpty) {
              _item[i].valid = false;
            } else {
              _item[i].valid = _item[i].value === sentence[i].value;
            }
          } else {
            // if the partitions have been partitioned. the next will be null;
            _item[i].next = this.beginPartitions(
              sentence[i].value,
              _item[i].value
            );
          }
        }
      });
    });

    if (terminal === "Expr" && input === "") {
      console.log(partitions);
    }
    return partitions;
  }
}

export { Unger };
