class Stack {
  constructor () {
    this._stack = [];
  }
  push (item) {
    this._stack.push(item);
  }
  pop () {
    this._stack.pop();
  }
  isEmpty () {
    return this._stack.length === 0;
  }
  size () {
    return this._stack;
  }
}

export {
  Stack
}
