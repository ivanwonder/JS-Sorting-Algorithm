import {BST} from '../algorithm/BST';
import {getTreeNodeNumber, isRBTree} from '../lib/testBST';
const assert = require('assert');

function theArrayValueIsAllSame (ar) {
  let flag = true;
  let number = null;
  ar.forEach(function (value) {
    if (number === null) {
      number = value;
    } else {
      if (value !== number) {
        flag = false;
      }
    }
  });
  return flag;
}

function testRBTree (tree) {
  const result = isRBTree(tree);
  if (theArrayValueIsAllSame(result.leafNodeBlackNumber) && !result.nodeRightIsRed) {
    assert.ok(true);
  } else {
    console.log(result);
    assert.fail('wrong tree');
  }
}

describe('BST', function () {
  const treeOne = [5];
  const treeThree = [2, 1, 3];
  const treeFour = [2, 1, 3, 4, 5];

  beforeEach(function () {
  })

  it('test random BST', function () {
    let times = 10;
    const bst = new BST();
    while (times--) {
      const key = bst.getRandom(times * 10);
      bst.put(key, key);
    }
    const node = bst.head;

    assert.deepEqual(bst.size(), getTreeNodeNumber(node));
    testRBTree(bst.head);
  })

  it('build one node tree and delete it', function () {
    const tree = new BST();
    treeOne.forEach((value) => {
      tree.put(value, value);
    });
    assert.equal(getTreeNodeNumber(tree.head), tree.size(), 'the node number of tree must be one');
    tree.delete(treeOne[0]);
    assert.equal(tree.head, null, 'the tree must be null');
  });

  it('test the deleteMin and deleteMax', function () {
    const tree = new BST();
    treeThree.forEach(function (value) {
      tree.put(value, value);
    });
    tree.deleteMin();
    testRBTree(tree.head);
    tree.deleteMax();
    assert.equal(tree.head.key, 2);
    tree.deleteMax();
    assert.equal(tree.head, null, 'the tree should be null');
    tree.put(1, 1);
    tree.deleteMin();
    assert.equal(tree.head, null, 'the tree must be null');
  });

  it('test the delete', function () {
    const tree = new BST();
    treeFour.forEach(function (value) {
      tree.put(value, value);
    });
    tree.delete(3);
    testRBTree(tree.head);
    tree.delete(2);
    testRBTree(tree.head);
    assert.equal(getTreeNodeNumber(tree.head), tree.size(), 'the node number of tree must be 3');
    tree.delete(1);
    tree.delete(4);
    tree.delete(5);
    assert.equal(tree.head, null, 'the tree must be null');
  });

  it('test keys', function () {
    const tree = new BST();
    treeFour.forEach(function (value) {
      tree.put(value, value);
    });
    const queue = tree.keys();
    const actual = [];
    while (queue.size()) {
      actual.push(queue.dequeue());
    }
    assert.deepEqual(actual.join(' '), '1 2 3 4 5');
  })
})
