import { invariant } from "../lib/unit";

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

export {
  MinPQ,
  MaxPQ
}
