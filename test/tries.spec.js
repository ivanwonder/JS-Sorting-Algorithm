const { TST } = require("../algorithm/Tries");
const assert = require("assert");

describe("Test Tries", function() {
  it("get\\put\\delete key|value", function() {
    const tst = new TST();
    tst.put("a", 1);
    tst.put("ab", 2);
    assert.strictEqual(tst.get("a"), 1);
    assert.strictEqual(tst.get("ab"), 2);
    tst.delete("a");
    assert.strictEqual(tst.get("a"), null);
    assert.strictEqual(tst.get("ab"), 2);
    tst.delete("ab");
    assert.strictEqual(tst.get("a"), null);
    assert.strictEqual(tst.get("ab"), null);
    tst.put("acd", 3);
    tst.put("add", 4);
    tst.put("dsd", 5);
    tst.put("ds", 6);
    assert.strictEqual(tst.get("dsd"), 5);
    assert.strictEqual(tst.longestPrefixOf("dsdaxsdf"), "dsd");
    assert.strictEqual(tst.longestPrefixOf("acdaxsdf"), "acd");
    assert.strictEqual(tst.longestPrefixOf("eadsdaxsdf"), "");
  });
});
