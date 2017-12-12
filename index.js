import bubbleSort from './bubbleSort'
import getGenerateArray, {setDefaultArray, judgeTheString} from './lib/generateArray'
import {showInDom} from './lib/renderData'
import selectionSort from './selectionSort'
import insertionSort from './insertionSort'
import shellSort from './shellSort'
import {mergeSortIterate, mergeSortRecursive} from './mergeSort'

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
}

show()
document.getElementById('begin-sort').onclick = function () {
  show()
}
