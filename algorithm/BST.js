import {Stack} from '../lib/stack';

class Node {
  constructor (key, value, isRed) {
    this.left = null
    this.right = null
    this.value = value || 0
    this.key = key || 0
    this.isRed = isRed;
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
      this.head = new Node(key, value, false);
      return this.head;
    }

    const _stack = new Stack();
    let currentNode = this.head;
    // let preNode = null;

    // find the equal key node until meet the null
    while (currentNode) {
      _stack.push(currentNode);
      // preNode = currentNode;
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
      let node = new Node(key, value, true);
      let preNode = _stack.pop();
      if (preNode.key < key) {
        preNode.right = node;
      } else {
        preNode.left = node;
      }

      preNode = this.balance(preNode);

      while (_stack.size()) {
        const _currentNode = _stack.pop();
        if (preNode.key > _currentNode.key) {
          _currentNode.right = preNode;
        } else {
          _currentNode.left = preNode;
        }
        preNode = this.balance(_currentNode);
      }
      this.head = preNode;
      return node;
    }
  }

  balance (currentNode) {
    if (currentNode.right && currentNode.right.isRed) {
      currentNode = this.rotateLeft(currentNode);
    }
    if (currentNode.left && currentNode.left.left && currentNode.left.isRed && currentNode.left.left.isRed) {
      currentNode = this.rotateRight(currentNode);
    }
    if (currentNode.left && currentNode.right && currentNode.left.isRed && currentNode.right.isRed) {
      this.flipColor(currentNode);
    }
    return currentNode;
  }

  rotateLeft (node) {
    const root = node.right;
    node.right = root.left;
    root.left = node;
    const rootColor = root.isRed;
    root.isRed = node.isRed;
    node.isRed = rootColor;
    return root;
  }

  rotateRight (node) {
    const root = node.left;
    node.left = root.right;
    root.right = node;
    const rootColor = root.isRed;
    root.isRed = node.isRed;
    node.isRed = rootColor;
    return root;
  }

  flipColor (node) {
    node.isRed = !node.isRed;
    node.left.isRed = !node.left.isRed;
    node.right.isRed = !node.right.isRed;
  }

  deleteMin (node = this.head) {
    if (!node) {
      return null;
    }

    if (!node.left) {
      this.head = null;
      return null;
    }

    const _stack = new Stack();
    while (node.left) {
      if (!node.left.isRed && (!node.left.left || !node.left.left.isRed)) {
        this.flipColor(node);
        if (node.right.left && node.right.left.isRed) {
          node.right = this.rotateRight(node.right);
        }
        node = this.rotateLeft(node);
        if (node.right && node.right.isRed) {
          this.flipColor(node);
        }
      }

      _stack.push(node);
      if (!node.left.left) {
        node.left = null;
        break;
      }
      node = node.left;
    }
    let _preNode = _stack.pop();
    while (_stack.size()) {
      const _currentNode = _stack.pop();
      _currentNode.left = _preNode;
      _preNode = this.balance(_currentNode);
    }
    this.head = _preNode;
  }

  buildRandomTree (runTimes = 10) {
    while (runTimes--) {
      const key = this.getRandom(runTimes * 10);
      this.put(key, key);
    }
  }
}

export {
  BST
}
