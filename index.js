import bubbleSort from './algorithm/bubbleSort'
import getGenerateArray, {setDefaultArray, judgeTheString} from './lib/generateArray'
import {showInDom} from './lib/renderData'
import selectionSort from './algorithm/selectionSort'
import insertionSort from './algorithm/insertionSort'
import shellSort from './algorithm/shellSort'
import {mergeSortIterate, mergeSortRecursive} from './algorithm/mergeSort'
import heapSort from './algorithm/heapSort'
import radixSort from './algorithm/radixSort'

import {BST} from './algorithm/BST';
import {buildTreeCanvas} from './lib/buildTreeCanvas';
import {isRBTree} from './lib/testBST';

setDefaultArray('1,45,23,76,34,98,567,12,34,22,21,45')

function show () {
  if (!judgeTheString()) return

  showInDom()
    .show('bubbleSort', bubbleSort(getGenerateArray()))
    .show('selectionSort', selectionSort(getGenerateArray()))
    .show('insertionSort', insertionSort(getGenerateArray()))
    .show('shellSort', shellSort(getGenerateArray()))
    .show('mergeSortIterate', mergeSortIterate(getGenerateArray()))
    .show('mergeSortRecursive', mergeSortRecursive(getGenerateArray()))
    .show('heapSort', heapSort(getGenerateArray()))
    .show('radixSort', radixSort(getGenerateArray()))
}

show()
document.getElementById('begin-sort').onclick = function () {
  show()
}

var test = new BST();
test.buildRandomTree(10);
console.log(test.head);
let canvas = buildTreeCanvas(test.head);
const canvasContainer = document.getElementById('test');
canvasContainer.appendChild(canvas);
console.log(isRBTree(test.head));

document.getElementById('deleteMin').onclick = function () {
  // canvasContainer.removeChild(canvas);
  test.deleteMin();
  if (test.head) {
    canvas = buildTreeCanvas(test.head);
    canvasContainer.appendChild(canvas);
  }
}

document.getElementById('delete-button').onclick = function () {
  const value = document.getElementById('delete-value').value;
  const node = test.delete(test.head, Number(value));
  if (node) {
    canvas = buildTreeCanvas(test.head);
    canvasContainer.appendChild(canvas);
  }
};
