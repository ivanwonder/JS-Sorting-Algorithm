class Stack {
  constructor () {
    this._stack = [];
  }
  push (item) {
    this._stack.push(item);
  }
  pop () {
    return this._stack.pop();
  }
  isEmpty () {
    return this._stack.length === 0;
  }
  size () {
    return this._stack.length;
  }
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this._stack.length) {
          return {value: this._stack[index++], done: false};
        } else {
          index = 0;
          return {done: true};
        }
      }
    }
  }
}

class Queue {
  constructor () {
    this._queue = [];
  }

  /**
   * @description add an item
   * @param {*} item
   */
  enqueue(item) {
    this._queue.push(item);
  }

  /**
   * @description remove the least recently added item
   */
  dequeue() {
    return this._queue.shift();
  }

  isEmpty() {
    return this._queue.length === 0;
  }

  size() {
    return this._queue.length;
  }

  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this._queue.length) {
          return {value: this._queue[index++], done: false};
        } else {
          index = 0;
          return {done: true};
        }
      }
    }
  }
}

export {
  Stack,
  Queue
}
