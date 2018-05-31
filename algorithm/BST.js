class Node {
  constructor (key, value) {
    this.left = null
    this.right = null
    this.value = value || 0
    this.key = key || 0
  }
}

class BST {
  constructor () {
    this.head = null
  }

  getRandom (range = 10) {
    return Math.floor(Math.random() * range)
  }

  put (...arg) {
    let key = null
    let value = null
    if (arg.length === 2) {
      [key, value] = arg;
    }
    if (!this.head) {
      this.head = new Node(key, value);
      return this.head;
    }

    // const _stack = new Stack();
    let currentNode = this.head;
    let preNode = null;

    // find the equal key node until meet the null
    while (currentNode) {
      preNode = currentNode;
      if (currentNode.key < key) {
        currentNode = currentNode.right;
        continue;
      }
      if (currentNode.key > key) {
        currentNode = currentNode.left;
        continue;
      }
      if (currentNode.key === key) {
        break;
      }
    }

    // write the value or insert a new node
    if (currentNode) {
      currentNode.key = value;
      return currentNode;
    } else {
      let node = new Node(key, value);
      if (preNode.key < key) {
        preNode.right = node;
      } else {
        preNode.left = node;
      }
      return node;
    }
  }

  buildRandomTree (runTimes = 10) {
    while (runTimes--) {
      const key = this.getRandom(runTimes);
      this.put(key, key);
    }
  }
}

export {
  BST
}
