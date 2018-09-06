import {Stack} from '../lib/stack';

class Node {
  constructor (key, value, isRed) {
    /**
     * @type {Node|null}
     */
    this.left = null
    /**
     * @type {Node|null}
     */
    this.right = null
    this.value = value || 0
    this.key = key || 0
    this.isRed = isRed;
    this.size = 1; // size of the current tree's node
  }
}

class BST {
  constructor () {
    /**
     * @type {Node|null}
     */
    this.head = null
  }

  getRandom (range = 10) {
    return Math.floor(Math.random() * range)
  }

  /**
   * @description add new key and value
   * @param  {...any} arg the key and value
   * @returns {Node} the new node or the modify node
   */
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

  /**
   * @param {Node} currentNode
   */
  balance (currentNode) {
    if (this.isRed(currentNode.right) && !this.isRed(currentNode.left)) {
      currentNode = this.rotateLeft(currentNode);
    }
    if (this.isRed(currentNode.left) && this.isRed(currentNode.left.left)) {
      currentNode = this.rotateRight(currentNode);
    }
    if (this.isRed(currentNode.left) && this.isRed(currentNode.right)) {
      this.flipColor(currentNode);
    }

    // make sure the size of the node which no need to be ratate is correct;
    currentNode.size = this.size(currentNode.left) + this.size(currentNode.right) + 1;
    return currentNode;
  }

  /**
   * @param {Node} node
   */
  rotateLeft (node) {
    const root = node.right;
    node.right = root.left;
    root.left = node;
    const rootColor = root.isRed;
    root.isRed = node.isRed;
    node.isRed = rootColor;

    root.size = node.size;
    node.size = this.size(node.left) + this.size(node.right) + 1;
    return root;
  }

  /**
   * @param {Node} node
   */
  rotateRight (node) {
    const root = node.left;
    node.left = root.right;
    root.right = node;
    const rootColor = root.isRed;
    root.isRed = node.isRed;
    node.isRed = rootColor;

    root.size = node.size;
    node.size = this.size(node.left) + this.size(node.right) + 1;
    return root;
  }

  flipColor (node) {
    node.isRed = !node.isRed;
    node.left.isRed = !node.left.isRed;
    node.right.isRed = !node.right.isRed;
  }

  /**
   * @description get the node size, when no argument is passed to the function, it will return the tree size;
   * @param {Node} node
   * @returns {number}
   */
  size(node) {
    if (arguments.length === 0) {
      return this.head.size;
    }
    if (!node) return 0;
    return node.size;
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
      if (this.needLeftRotate(node)) {
        node = this.moveRedLeft(node);
      }

      _stack.push(node);
      // delete the minimal node
      if (!node.left.left) {
        node.left = null;
        break;
      }
      node = node.left;
    }
    let _preNode = this.balance(_stack.pop());
    while (_stack.size()) {
      const _currentNode = _stack.pop();
      _currentNode.left = _preNode;
      _preNode = this.balance(_currentNode);
    }
    this.head = _preNode;
    return this.head;
  }

  deleteMax (node = this.head) {
    if (!node) {
      return null;
    }

    if (!node.left) {
      this.head = null;
      return null;
    }

    const _stack = new Stack();
    while (node) {
      if (this.isRed(node.left)) {
        node = this.rotateRight(node);
      }
      if (this.needRightRotate(node)) {
        node = this.moveRedRight(node);
      }

      _stack.push(node);
      // delete only when the right node have not child node.
      if (!node.right.right && !node.right.left) {
        node.right = null;
        break;
      }
      node = node.right;
    }
    let _preNode = this.balance(_stack.pop());
    while (_stack.size()) {
      const _currentNode = _stack.pop();
      _currentNode.right = _preNode;
      _preNode = this.balance(_currentNode);
    }
    this.head = _preNode;
    return this.head;
  }

  get (key) {
    let node = this.head;
    while (node) {
      if (node.key === key) {
        return node.value;
      }
      if (node.key > key) {
        node = node.left;
        continue;
      }
      if (node.key < key) {
        node = node.right;
        continue;
      }
    }
    return null;
  }

  isRed (node) {
    if (!node) {
      return false;
    }
    return node.isRed;
  }

  needLeftRotate (node) {
    if (node.left && !node.left.isRed && (!node.left.left || !node.left.left.isRed)) {
      return true;
    }
    return false;
  }

  needRightRotate (node) {
    if (node.right && !node.right.isRed && (!node.right.left || !node.right.left.isRed)) {
      return true;
    }
    return false;
  }

  moveRedLeft (node) {
    this.flipColor(node);
    if (this.isRed(node.right.left)) {
      node.right = this.rotateRight(node.right);
      node = this.rotateLeft(node);
      this.flipColor(node);
    }
    return node;
  }

  //       RN
  //    B        B
  //  B    B  B      B
  // in this case, just flip the color, like the blow. the balance will make it right.
  //       RN
  //    R        R
  //  B    B  B      B
  // if translate into this as f0llow.
  //   R
  // B    Rn
  //    B       R
  //         B      B
  // it will make the balance wrong.

  //       RN
  //    B        B
  //  R    B  B      B
  // as above, it will be translated into blow
  //                   B->RN
  //       R->B               RN->B
  //  NULL      NULL       B         B->R
  //                   NULL  NULL  B      B
  moveRedRight (node) {
    this.flipColor(node);
    if (this.isRed(node.left.left)) {
      node = this.rotateRight(node);
      this.flipColor(node);
    }
    return node;
  }

  min (node) {
    if (!node) {
      return null;
    }
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  delete (key) {
    let node = this.head;
    if (!node || (typeof key === 'undefined')) {
      return null;
    }

    if (this.get(key) === null) {
      return null;
    }

    const _stack = new Stack();
    while (node) {
      let nextNode;
      if (node.key > key) {
        if (this.needLeftRotate(node)) {
          node = this.moveRedLeft(node);
        }
        nextNode = node.left;
      } else {
        if (node.left && node.left.isRed) {
          node = this.rotateRight(node);
        }
        if (this.needRightRotate(node)) {
          node = this.moveRedRight(node);
        }
        if (node.key === key) {
          let minNode = this.min(node.right);
          let _root = this.deleteMin(node.right);
          if (!minNode) {
            // handle the condition when the node will be deleted is the leaf node;
            if (_stack.size()) {
              let _currentNode = _stack.pop();
              if (_currentNode.key > node.key) {
                _currentNode.left = null;
              } else {
                _currentNode.right = null;
              }
              node = _currentNode;
            } else {
              // only one node to be deleted.
              return (this.head = null);
            }
          } else {
            minNode.left = node.left;
            minNode.right = _root;
            minNode.isRed = node.isRed;
            node = minNode;
          }
          break;
        }
        nextNode = node.right;
      }
      _stack.push(node);
      node = nextNode;
    }

    node = this.balance(node);

    while (_stack.size()) {
      let _currentNode = _stack.pop();
      if (_currentNode.key > node.key) {
        _currentNode.left = node;
      } else {
        _currentNode.right = node;
      }
      node = this.balance(_currentNode);
    }

    this.head = node;
    return node;
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
