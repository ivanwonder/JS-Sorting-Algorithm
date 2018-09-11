import { invariant, isUndefined } from "../lib/unit";

class PQ {
  constructor() {
    this._pq = [];
    this._size = 0;
  }

  less(i, j) {
    invariant(false, "less should be implement");
  }

  exch(i, j) {
    const cache = this._pq[i];
    this._pq[i] = this._pq[j];
    this._pq[j] = cache;
  }

  swim(root) {
    while (root > 1 && this.less(root, Math.floor(root / 2))) {
      this.exch(root, Math.floor(root / 2));
      root = Math.floor(root / 2);
    }
  }

  sink(root) {
    while (2 * root <= this._size) {
      let min = 2 * root;
      if (min + 1 <= this._size && !this.less(min, min + 1)) {
        ++min;
      }
      if (this.less(min, root)) {
        this.exch(min, root);
      } else {
        break;
      }
      root = min;
    }
  }

  insert(key) {
    this._pq[++this._size] = key;
    this.swim(this._size);
  }

  size() {
    return this._size;
  }

  isEmpty() {
    return this._size === 0;
  }
}

class MinPQ extends PQ {
  delMin() {
    const min = this._pq[1];
    this.exch(1, this._size);
    this._size--;
    this.sink(1);
    return min;
  }

  less(i, j) {
    const first = this._pq[i];
    const second = this._pq[j];
    if (first.compareTo && second.compareTo) {
      return first.compareTo(second) < 0;
    } else {
      return first < second;
    }
  }
}

class MaxPQ extends PQ {
  delMax() {
    const min = this._pq[1];
    this.exch(1, this._size);
    this._size--;
    this.sink(1);
    return min;
  }

  less(i, j) {
    const first = this._pq[i];
    const second = this._pq[j];
    if (first.compareTo && second.compareTo) {
      return first.compareTo(second) > 0;
    } else {
      return first > second;
    }
  }
}

class IndexMinPQ {
  constructor() {
    this._keyToIndex = []; // associate the key to the position in _pq
    this._pq = []; // save the key
    this._key = []; // save the item associated with key
    this._size = 0;
  }

  swim(root) {
    while (root > 1 && this.less(root, Math.floor(root / 2))) {
      this.exch(root, Math.floor(root / 2));
      root = Math.floor(root / 2);
    }
  }

  sink(root) {
    while (2 * root <= this._size) {
      let min = 2 * root;
      if (min + 1 <= this._size && !this.less(min, min + 1)) {
        ++min;
      }
      if (this.less(min, root)) {
        this.exch(min, root);
      } else {
        break;
      }
      root = min;
    }
  }

  less(i, j) {
    const first = this._key[this._pq[i]];
    const second = this._key[this._pq[j]];
    if (first.compareTo && second.compareTo) {
      return first.compareTo(second) < 0;
    } else {
      return first < second;
    }
  }

  exch(from, to) {
    const cache = this._pq[from];
    this._pq[from] = this._pq[to];
    this._pq[to] = cache;
    this._keyToIndex[this._pq[to]] = to;
    this._keyToIndex[this._pq[from]] = from;
  }

  /**
   * @description insert item ; associate it with key
   * @param {number} key
   * @param {*} item
   */
  insert(key, item) {
    invariant(!this.contains(key), "key is already in the priority queue");
    this._pq[++this._size] = key;
    this._keyToIndex[key] = this._size;
    this._key[key] = item;
    this.swim(this._size);
  }

  /**
   * @description change the item associated with key to item
   * @param {number} key
   * @param {*} item
   */
  change(key, item) {
    this._key[key] = item;
    this.swim(this._keyToIndex[key]);
    this.sink(this._keyToIndex[key]);
  }

  /**
   * @description is k associated with some item?
   * @param {number} key
   */
  contains(key) {
    return !isUndefined(this._keyToIndex[key]);
  }

  /**
   * @description remove k and its associated item
   * @param {number} key
   */
  delete(key) {
    const index = this._keyToIndex[key];
    this.exch(index, this._size--);
    this.swim(index);
    this.sink(index);

    this._clearKey(key);
  }

  _clearKey(key) {
    this._key[key] = undefined;
    this._pq[this._keyToIndex[key]] = undefined;
    this._keyToIndex[key] = undefined;
  }

  /**
   * @description return a minimal item
   */
  min() {
    return this._key[this._pq[1]];
  }

  /**
   * @description return a minimal item’s index
   */
  minIndex() {
    return this._pq[1];
  }

  /**
   * @description remove a minimal item and return its index
   */
  delMin() {
    const key = this._pq[1];
    this.delete(key);
    return key;
  }

  /**
   * @description is the priority queue empty?
   */
  isEmpty() {
    return this._size === 0;
  }

  /**
   * @description number of items in the priority queue
   */
  size() {
    return this._size;
  }
}

export {
  MinPQ,
  MaxPQ,
  IndexMinPQ
}
