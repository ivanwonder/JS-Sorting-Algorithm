import stringHash from "string-hash";

class LinearProbingHashST {
  constructor(size) {
    this.size = size;
    this.keys = new Array(size);
    this.values = new Array(size);
  }
}

class HashTable {
  constructor() {
    this.initLength = 10;
    // this._table = new Array(this.initLength);
    this._table = new LinearProbingHashST(this.initLength);
    this.length = 0;
  }

  resize(size) {
    const _len = this.length;

    this.initLength = size;
    const _table = this._table;
    // this._table = new Array(this.initLength);
    this._table = new LinearProbingHashST(this.initLength);
    _table.keys.forEach((value, index) => {
      if (typeof value !== "undefined") {
        this.set(value, _table.values[index]);
      }
    });

    // make sure the length is the same as the size before resize;
    this.length = _len;
  }

  hashIndex(key) {
    return stringHash(key) % this.initLength;
  }

  set(key, value) {
    if (this.length >= this.initLength / 2) {
      this.resize(this.initLength * 2);
    }
    let keyIndex = this.hashIndex(key);
    let _key = this._table.keys[keyIndex];
    while (_key !== undefined) {
      if (_key === key) {
        this._table.values[keyIndex] = value;
        // this.length++;
        return;
      }
      _key = this._table.keys[++keyIndex % this.initLength];
    }
    this.length++;
    this._table.keys[keyIndex] = key;
    this._table.values[keyIndex] = value;
  }

  get(key) {
    let keyIndex = this.hashIndex(key);
    let _key = this._table.keys[keyIndex];
    while (_key !== undefined) {
      if (_key === key) {
        return this._table.values[keyIndex];
      }
      _key = this._table.keys[++keyIndex % this.initLength];
    }
    return null;
  }

  delete(key) {
    let valueDeleted = null;

    let keyIndex = this.hashIndex(key);
    let _key = this._table.keys[keyIndex];
    while (_key !== undefined) {
      if (_key === key) {
        valueDeleted = this._table.values[keyIndex];
        this._table.keys[keyIndex] = undefined;
        break;
      }
      _key = this._table.keys[++keyIndex % this.initLength];
    }

    if (valueDeleted !== null) {
      _key = this._table.keys[++keyIndex];
      while (_key !== undefined) {
        this._table.keys[keyIndex] = undefined;
        --this.length; // must perform before set in case of table resize.
        this.set(_key, this._table.values[keyIndex]);
        _key = this._table.keys[++keyIndex % this.initLength];
      }
      --this.length;
    }

    if (this.length <= this.initLength / 8) {
      this.resize(this.initLength / 2);
    }

    return valueDeleted;
  }
}

export { HashTable };
