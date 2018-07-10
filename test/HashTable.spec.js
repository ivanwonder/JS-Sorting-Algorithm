var assert = require("assert");
var HashTable = require("../algorithm/hashTable").HashTable;

describe("test hash table", function() {
  var _map = new HashTable();
  const mapSize = 100;

  beforeEach(function() {
    _map = new HashTable();
    for (let i = 1; i <= mapSize; i++) {
      _map.set(`ivan${i}`, `name${i}`);
    }
  });

  it("test base hash table", function() {
    _map.set("ivan100", "wx2");
    assert.equal(_map.get("ivan100"), "wx2");
    assert.equal(_map.length, 100);
  });

  it("test resize", function() {
    assert.equal(_map.get("ivan15"), "name15");
    assert.equal(_map.get("ivan100"), "name100");
    assert.equal(_map.get("ivan25"), "name25");
    assert.equal(_map.length, mapSize);
  });

  it("test delete", function() {
    const deleteNum = 59;
    for (let i = 1; i <= deleteNum; i++) {
      _map.delete(`ivan${i}`);
    }
    assert.equal(_map.get("ivan1"), null);
    assert.equal(_map.length, mapSize - deleteNum);
    assert.equal(_map._table.length, 320);
    _map.delete(`ivan${deleteNum + 1}`);
    assert.equal(_map._table.length, 160);
  });
});
