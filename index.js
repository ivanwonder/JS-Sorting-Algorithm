import bubbleSort from "./algorithm/bubbleSort";
import getGenerateArray, {
  setDefaultArray,
  judgeTheString
} from "./lib/generateArray";
import { showInDom } from "./lib/renderData";
import selectionSort from "./algorithm/selectionSort";
import insertionSort from "./algorithm/insertionSort";
import shellSort from "./algorithm/shellSort";
import { mergeSortIterate, mergeSortRecursive } from "./algorithm/mergeSort";
import heapSort from "./algorithm/heapSort";
import radixSort from "./algorithm/radixSort";

import { BST } from "./algorithm/BST";
import { buildTreeCanvas } from "./lib/buildTreeCanvas";
import { isRBTree } from "./lib/testBST";
// import { HashTable } from "./algorithm/hashTable";
import { RE } from "./algorithm/RE";
import {
  CollisionSystem,
  Particle,
  Environment
} from "./algorithm/Event-Driven-Simulation";

setDefaultArray("1,45,23,76,34,98,567,12,34,22,21,45");

function show() {
  if (!judgeTheString()) return;

  showInDom()
    .show("bubbleSort", bubbleSort(getGenerateArray()))
    .show("selectionSort", selectionSort(getGenerateArray()))
    .show("insertionSort", insertionSort(getGenerateArray()))
    .show("shellSort", shellSort(getGenerateArray()))
    .show("mergeSortIterate", mergeSortIterate(getGenerateArray()))
    .show("mergeSortRecursive", mergeSortRecursive(getGenerateArray()))
    .show("heapSort", heapSort(getGenerateArray()))
    .show("radixSort", radixSort(getGenerateArray()));
}

show();
document.getElementById("begin-sort").onclick = function() {
  show();
};

var test = new BST();
test.buildRandomTree(10);
console.log(test.head);
let canvas = buildTreeCanvas(test.head);
const canvasContainer = document.getElementById("test");
canvasContainer.appendChild(canvas);
console.log(isRBTree(test.head));

document.getElementById("deleteMin").onclick = function() {
  // canvasContainer.removeChild(canvas);
  test.deleteMin();
  if (test.head) {
    canvas = buildTreeCanvas(test.head);
    canvasContainer.appendChild(canvas);
  }
};

document.getElementById("deleteMax").onclick = function() {
  test.deleteMax();
  if (test.head) {
    canvas = buildTreeCanvas(test.head);
    canvasContainer.appendChild(canvas);
  }
};

document.getElementById("delete-button").onclick = function() {
  const value = document.getElementById("delete-value").value;
  const node = test.delete(Number(value));
  if (node) {
    canvas = buildTreeCanvas(test.head);
    canvasContainer.appendChild(canvas);
  }
};

// function testHastTable() {
//   class OwnMap {
//     constructor() {
//       this._table = {};
//     }

//     set(key, value) {
//       this._table[key] = value;
//     }

//     get(key) {
//       return this._table[key];
//     }
//   }

//   const _map = new HashTable();
//   const obj = new OwnMap();
//   const mapSize = 1000000;
//   for (let i = 1; i <= mapSize; i++) {
//     _map.set(`ivan${i}`, `name${i}`);
//     obj.set(`ivan${i}`, `name${i}`);
//   }

//   const jsobj = 'jsobj';
//   const hashTable = 'hashTable';

//   console.time(hashTable);
//   _map.get('ivan1');
//   console.timeEnd(hashTable);

//   console.time(jsobj);
//   obj.get('ivan1');
//   console.timeEnd(jsobj);
// }

// testHastTable();

class Simulates {
  constructor() {
    this._simu = [];
  }

  stop() {
    for (const iterator of this._simu) {
      iterator.stop();
    }
    this._simu = [];
  }

  add(simu) {
    this._simu.push(simu);
  }
}

const simulates = new Simulates();

document.querySelector("#reg-check").onclick = function() {
  const reg = document.querySelector("#reg-exp").value;
  const string = document.querySelector("#reg-string").value;
  alert(new RE(reg).recognizes(string));
};

function eventDrivenSimulation(exam) {
  const canvas = document.querySelectorAll(".event-driven-simulation canvas");

  let particles = [];
  switch (exam) {
    case 0:
      particles = [
        new Particle(30, 90, 135, 0, 15, 300),
        new Particle(150, 90, -135, 0, 5, 150),
        new Particle(270, 95, -135, 0, 15, 300)
      ];
      break;
    case 1:
      particles = [
        new Particle(123, 240, 0, 0, 10, 100),
        new Particle(143.001, 240, 0, 0, 10, 100),
        new Particle(163.002, 240, 0, 0, 10, 100),
        new Particle(183.003, 240, 0, 0, 10, 100),
        new Particle(132, 220, 0, 0, 10, 100),
        new Particle(152.001, 220, 0, 0, 10, 100),
        new Particle(172.002, 220, 0, 0, 10, 100),
        new Particle(141, 202, 0, 0, 10, 100),
        new Particle(161.001, 202, 0, 0, 10, 100),
        new Particle(150, 182, 0, 0, 10, 100),
        new Particle(120, 30, 0, 150, 10, 400)
      ];
      break;
    case 2:
      particles = [
        new Particle(30, 90, 150, 0, 10, 100),
        new Particle(135, 90, 0, 0, 10, 100),
        new Particle(155.001, 90, 0, 0, 10, 100),
        new Particle(175.002, 90, 0, 0, 10, 100)
      ];
      break;
    default:
      break;
  }

  const simulate = new CollisionSystem(
    particles,
    new Environment(300, 300, canvas[0])
  ).simulate(new Date().getTime() + 5 * 60 * 1000);

  simulates.stop();
  simulates.add(simulate);
}

document.querySelector("#run-eds").onclick = function() {
  const canvas = document.querySelectorAll(".event-driven-simulation canvas");
  const width = document.querySelector("#canvas-width").value || 300;
  const height = document.querySelector("#canvas-height").value || 300;
  const num = document.querySelector("#particle-number").value || 10;

  const simu = new CollisionSystem(
    buildRandomEDS(width, height, num),
    new Environment(width, height, canvas[0])
  ).simulate(new Date().getTime() + 5 * 60 * 1000);

  simulates.stop();
  simulates.add(simu);
};

function buildRandomEDS(width, height, num) {
  /**
   * @type {Array<Particle>}
   */
  const randomParticles = [];
  function buildRandomParticle() {
    const radius = Math.round(10 * Math.random() + 10);
    const intervalRx = width - 2 * radius;
    const intervalRy = height - 2 * radius;
    const rx = Math.random() * intervalRx + radius;
    const ry = Math.random() * intervalRy + radius;
    const vx = Math.random() * 100 + 100;
    const vy = Math.random() * 100 + 100;
    return new Particle(rx, ry, vx, vy, radius, 100);
  }

  loop1: while (randomParticles.length < num) {
    const _par = buildRandomParticle();
    for (const _particle of randomParticles) {
      if (_particle.isOverlapped(_par)) {
        continue loop1;
      }
    }
    randomParticles.push(_par);
  }

  return randomParticles;
}

document.querySelector("#example-one").onclick = function() {
  eventDrivenSimulation(0);
};

document.querySelector("#example-two").onclick = function() {
  eventDrivenSimulation(1);
};

document.querySelector("#example-three").onclick = function() {
  eventDrivenSimulation(2);
};
