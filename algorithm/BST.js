import {Stack} from '../lib/stack';

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

class NodePosition {
  constructor (x, y, flag, node) {
    this.flag = flag; // the index corresponding to the index in complete binary tree
    this.x = x;
    this.y = y;
    this.node = node;
    this.left = null;
    this.right = null;
  }
}

function buildNodeFlag (node) {
  const _stack = new Stack();
  let maxFlag = 0;
  _stack.push(node);
  while (node.node.left) {
    node.left = new NodePosition();
    node.left.flag = 2 * node.flag + 1;
    node.left.node = node.node.left;
    _stack.push(node.left);
    node = node.left;
  }
  while (_stack.size()) {
    let _nodePosition = _stack.pop();
    maxFlag = maxFlag > _nodePosition.flag ? maxFlag : _nodePosition.flag;
    if (!_nodePosition.node.right) {
      continue;
    }
    _nodePosition.right = new NodePosition();
    _nodePosition.right.flag = 2 * _nodePosition.flag + 2;
    _nodePosition.right.node = _nodePosition.node.right;
    _nodePosition = _nodePosition.right;
    _stack.push(_nodePosition);

    while (_nodePosition.node.left) {
      _nodePosition.left = new NodePosition();
      _nodePosition.left.flag = 2 * _nodePosition.flag + 1;
      _nodePosition.left.node = _nodePosition.node.left;
      _stack.push(_nodePosition.left);
      _nodePosition = _nodePosition.left;
    }
  }
  return maxFlag;
}

const radius = 10;
const nodeGap = 50;
const leftOffset = 2;
const nodeHeightWithParent = 50;
const nodeGapWithDifferentParent = 2;

function getXByFlag (left, right) {
  const offsetWithSameLevel = right - left;
  return (Math.floor(offsetWithSameLevel / 2)) * (nodeGapWithDifferentParent + nodeGap) + offsetWithSameLevel % 2 * nodeGap + leftOffset + offsetWithSameLevel * radius * 2 + radius;
}

function calculateXPoint (node, height) {
  const currentHeight = getHeightByFlag(node.flag);
  const leftPointFlag = Math.pow(2, height) - 1;
  const _offset = height - currentHeight;
  const currentLeftPointFlag = node.flag * Math.pow(2, _offset) + Math.pow(2, _offset) - 1;
  const currentRightPointFlag = node.flag * Math.pow(2, _offset) + Math.pow(2, _offset) * 2 - 2;
  const currentLeftPointX = getXByFlag(leftPointFlag, currentLeftPointFlag);
  const currentRightPointX = getXByFlag(leftPointFlag, currentRightPointFlag);
  return (currentLeftPointX + currentRightPointX) / 2;
}

function drawCircle (canvas, node, height) {
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    const currentHeight = getHeightByFlag(node.flag);
    let x, y;
    x = calculateXPoint(node, height);
    y = currentHeight * nodeHeightWithParent + radius;
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.stroke();

    ctx.font = '12px';
    ctx.strokeText(node.flag, x, y);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  }
}

function getHeightByFlag (flag) {
  return Math.floor(Math.log2(flag + 1));
}

function buildTreeCanvas (node = new Node()) {
  const head = new NodePosition();
  head.flag = 0;
  head.node = node;
  const maxFlag = buildNodeFlag(head);
  const height = getHeightByFlag(maxFlag);

  const canvasDOM = document.createElement('canvas');
  canvasDOM.width = 1500;
  canvasDOM.height = 1500;

  const _stack = new Stack();
  _stack.push(head);
  while (_stack.size()) {
    const _node = _stack.pop();
    drawCircle(canvasDOM, _node, height);
    if (_node.left) {
      _stack.push(_node.left);
    }
    if (_node.right) {
      _stack.push(_node.right);
    }
  }
  console.log(head);
  console.log(height);

  return canvasDOM;
}

export {
  BST,
  buildTreeCanvas
}
