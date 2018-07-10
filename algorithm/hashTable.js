import stringHash from "string-hash";

class HashTable {
  constructor() {
    this.initLength = 10;
    this._table = new Array(this.initLength);
    this.length = 0;
  }

  resize(size) {
    const _len = this.length;

    this.initLength = size;
    const _table = this._table;
    this._table = new Array(this.initLength);
    _table.forEach(value => {
      if (typeof value !== "undefined") {
        this.set(value[0], value[1]);
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
    let _val = this._table[keyIndex];
    while (_val !== undefined) {
      if (_val[0] === key) {
        _val[1] = value;
        // this.length++;
        return;
      }
      _val = this._table[++keyIndex % this.initLength];
    }
    this.length++;
    this._table[keyIndex] = [key, value];
  }

  get(key) {
    let keyIndex = this.hashIndex(key);
    let _val = this._table[keyIndex];
    while (_val !== undefined) {
      if (_val[0] === key) {
        return _val[1];
      }
      _val = this._table[++keyIndex % this.initLength];
    }
    return null;
  }

  delete(key) {
    let valueDeleted = null;

    let keyIndex = this.hashIndex(key);
    let _val = this._table[keyIndex];
    while (_val !== undefined) {
      if (_val[0] === key) {
        valueDeleted = _val[1];
        this._table[keyIndex] = undefined;
        break;
      }
      _val = this._table[++keyIndex % this.initLength];
    }

    if (valueDeleted !== null) {
      _val = this._table[++keyIndex];
      while (_val !== undefined) {
        this._table[keyIndex] = undefined;
        --this.length; // must perform before set in case of table resize.
        this.set(_val[0], _val[1]);
        _val = this._table[++keyIndex % this.initLength];
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
