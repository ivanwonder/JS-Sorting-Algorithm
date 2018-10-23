import { invariant, isNull } from "../lib/unit";

class Node {
  constructor() {
    this.key = null;
    this.value = null;
    this.left = null;
    this.mid = null;
    this.right = null;
  }

  hasChild() {
    return this.left || this.mid || this.right;
  }
}

function keyValid(key) {
  invariant(typeof key === "string", "key must be a string!");
  invariant(key !== "", "key should not be ''");
}

function valueValid(value) {
  invariant(!isNull(value), "value can not be null");
}

class TST {
  constructor() {
    /**
     * @type {null | Node}
     */
    this.head = null;
  }

  /**
   * @param {string} key
   */
  get(key) {
    return this.getWithNode(this.head, key, 0);
  }

  /**
   * @param {Node} node
   * @param {string} key
   * @param {number} depth
   */
  getWithNode(node, key, depth) {
    keyValid(key);

    if (!node) {
      return null;
    }

    const _key = key.charAt(depth);

    if (node.key < _key) {
      return this.getWithNode(node.right, key, depth);
    } else if (node.key > _key) {
      return this.getWithNode(node.left, key, depth);
    } else if (key.length - 1 > depth) {
      return this.getWithNode(node.mid, key, depth + 1);
    } else {
      return node.value;
    }
  }

  delete(key) {
    this.head = this.deleteWithNode(this.head, key, 0);
  }

  /**
   * @param {Node} node
   * @param {string} key
   * @param {*} depth
   */
  deleteWithNode(node, key, depth) {
    keyValid(key);
    if (!node) {
      return null;
    }

    const _key = key.charAt(depth);

    if (node.key < _key) {
      node.right = this.deleteWithNode(node.right, key, depth);
    } else if (node.key > _key) {
      node.left = this.deleteWithNode(node.left, key, depth);
    } else if (key.length - 1 > depth) {
      node.mid = this.deleteWithNode(node.mid, key, depth + 1);
    } else {
      node.value = null;
    }

    if (isNull(node.value) && !node.hasChild()) {
      return null;
    }

    return node;
  }

  /**
   * @description put key-value pair into table
   * @param {string} key
   * @param {*} value
   */
  put(key, value) {
    this.head = this.putWithNode(this.head, key, value, 0);
  }

  /**
   * @param {Node} node
   * @param {string} key
   * @param {*} value
   * @param {number} depth
   */
  putWithNode(node, key, value, depth) {
    keyValid(key);
    valueValid(value);

    const _key = key.charAt(depth);

    if (!node) {
      node = new Node();
      node.key = _key;
    }

    if (node.key < _key) {
      node.right = this.putWithNode(node.right, key, value, depth);
    } else if (node.key > _key) {
      node.left = this.putWithNode(node.left, key, value, depth);
    } else if (depth < key.length - 1) {
      node.mid = this.putWithNode(node.mid, key, value, depth + 1);
    } else {
      node.value = value;
    }

    return node;
  }

  /**
   * @description the longest key that is prefix of key
   * @param {string} key
   */
  longestPrefixOf(key) {
    keyValid(key);
    let longPrefixLength = 0;
    let depth = 0;
    let node = this.head;

    while (node && depth < key.length) {
      const _key = key.charAt(depth);
      if (node.key < _key) {
        node = node.right;
      } else if (node.key > _key) {
        node = node.left;
      } else {
        depth++;
        if (!isNull(node.value)) {
          longPrefixLength = depth;
        }
        node = node.mid;
      }
    }

    return key.substring(0, longPrefixLength);
  }
}

export { TST };
