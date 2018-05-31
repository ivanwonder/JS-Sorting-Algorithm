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

export {
  getTreeNodeNumber
}
