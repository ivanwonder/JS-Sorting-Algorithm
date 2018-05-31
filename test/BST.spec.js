import {BST} from '../algorithm/BST';
import {getTreeNodeNumber} from '../lib/testBST';
const assert = require('assert');

describe('BST', function () {
  const nodeSet = new Set();
  let node;
  beforeEach(function () {
    let times = 10;
    let bst = new BST();
    while (times--) {
      const key = bst.getRandom(times * 10);
      nodeSet.add(key);
      bst.put(key, key);
    }
    node = bst.head;
  })

  it('test BST node number', function () {
    assert.deepEqual(nodeSet.size, getTreeNodeNumber(node));
  })
})
