import {Stack} from './stack';

function getTreeNodeNumber (node) {
  if (!node) {
    return 0;
  }
  const _stack = new Stack();
  let counter = 1;
  _stack.push(node);
  while (_stack.size()) {
    const currentNode = _stack.pop();
    if (currentNode.left) {
      _stack.push(currentNode.left);
      counter++;
    }
    if (currentNode.right) {
      _stack.push(currentNode.right);
      counter++;
    }
  }
  return counter;
}

class NodeInfo {
  constructor () {
    this.blackNumber = 0;
    this.node = null;
    this.left = null;
    this.right = null;
  }
}

function loopLeft (nodeInfo, _stack) {
  while (nodeInfo.node.left) {
    nodeInfo.left = new NodeInfo();
    nodeInfo.left.node = nodeInfo.node.left;
    nodeInfo.left.blackNumber = nodeInfo.blackNumber;
    if (!nodeInfo.left.node.isRed) {
      nodeInfo.left.blackNumber += 1;
    }
    nodeInfo = nodeInfo.left;
    _stack.push(nodeInfo);
  }
  return nodeInfo;
}

function isRBTree (node) {
  if (!node) {
    return null;
  }

  const leafNodeBlackNumber = [];
  let nodeIndex = 0;

  const _stack = new Stack();
  let nodeInfo = new NodeInfo();

  nodeInfo.node = node;
  if (!nodeInfo.node.isRed) {
    nodeInfo.blackNumber += 1;
  }

  _stack.push(nodeInfo);

  loopLeft(nodeInfo, _stack);

  while (_stack.size()) {
    let currentNode = _stack.pop();
    if (currentNode.node.right) {
      currentNode.right = new NodeInfo();
      currentNode.right.node = currentNode.node.right;
      currentNode.right.blackNumber = currentNode.blackNumber;
      if (!currentNode.right.node.isRed) {
        currentNode.right.blackNumber += 1;
      }
      currentNode = currentNode.right;
      _stack.push(currentNode);

      loopLeft(currentNode, _stack);
    } else {
      if (!currentNode.left) {
        leafNodeBlackNumber[nodeIndex] = currentNode.blackNumber;
        nodeIndex++;
      }
    }
  }

  return leafNodeBlackNumber;
}

export {
  getTreeNodeNumber,
  isRBTree
}
