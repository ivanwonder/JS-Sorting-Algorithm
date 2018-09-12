import {Digraph, DirectedDFS} from "./Digraph";
import { Stack } from "../lib/stack";
import { invariant } from "../lib/unit";

class RE {
  /**
   * @param {string} regexp
   */
  constructor(regexp) {
    this._re = regexp.split("");
    this._end = this._re.length;
    this._digraph = new Digraph(this._end + 1);
    const _stack = new Stack();

    /**
     * @param {number} index
     * @param {Digraph} _digraph
     */
    function buildSingleCharacter(index, _digraph) {
      invariant(index > 0, "the symbol can not put on first place");
      _digraph.addEdge(index, index - 1);
      _digraph.addEdge(index - 1, index);
      _digraph.addEdge(index, index + 1);
    }

    /**
     * @param {number} index
     * @param {Digraph} _digraph
     * @param {Stack} _stack
     */
    function buildClosureExpression(index, _digraph, _stack, regArray) {
      invariant(!_stack.isEmpty(), ") can not be used alone");
      let nextIndex = index;
      const pre = _stack.pop();
      let left;
      if (regArray[pre] === "|") {
        left = _stack.pop();
        _digraph.addEdge(left, pre + 1);
        _digraph.addEdge(pre, index)
      } else {
        left = pre;
      }

      invariant(regArray[left] === "(", "no symbol ( corresponding to the )");

      if (regArray[index + 1] === "*") {
        _digraph.addEdge(left, index + 1);
        _digraph.addEdge(index + 1, left);
        _digraph.addEdge(index + 1, index + 2);
        nextIndex++;
      }

      _digraph.addEdge(index, index + 1);
      return nextIndex;
    }

    for (let i = 0; i < this._end; i++) {
      switch (this._re[i]) {
        case "*":
          buildSingleCharacter(i, this._digraph);
          break;
        case ")":
          i = buildClosureExpression(i, this._digraph, _stack, this._re);
          break;
        case "(":
          _stack.push(i);
          this._digraph.addEdge(i, i + 1);
          break;
        case "|":
          _stack.push(i);
          break;
        default:
          break;
      }
    }
  }

  recognizes(txt) {
    let connectVertex = this.getConnectVertex(0);
    for (const word of txt) {
      const match = [];
      for (const _vertex of connectVertex) {
        if (this._re[_vertex] === word || this._re[_vertex] === ".") {
          match.push(_vertex + 1);
        }
      }
      connectVertex = this.getConnectVertex(match);
    }

    for (const _vertex of connectVertex) {
      if (_vertex === this._end) {
        return true;
      }
    }
    return false;
  }

  getConnectVertex(match) {
    const dfs = new DirectedDFS(this._digraph, match);
    const connect = [];
    for (let i = 0; i < this._digraph.V(); i++) {
      if (dfs.marked(i)) {
        connect.push(i);
      }
    }
    return connect;
  }
}

export {
  RE
}
