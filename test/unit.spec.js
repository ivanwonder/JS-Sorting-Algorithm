const assert = require("assert");
const {invariant, isUndefined, isNull} = require("../lib/unit");

describe("test unit", function() {
  it("invariant", function() {
    try {
      invariant(false, "test argus %s %s, %s", 1, 2, "hello");
    } catch (e) {
      assert.equal(e.message, "test argus 1 2, hello");
    }
    invariant(true);
  });

  it("undefined", function() {
    assert.equal(isUndefined(undefined), true);
    assert.equal(isUndefined(null), false);
    assert.equal(isUndefined(0), false);
    assert.equal(isUndefined(""), false);
  })

  it("null", function() {
    assert.equal(isNull(undefined), false);
    assert.equal(isNull(null), true);
    assert.equal(isNull(0), false);
    assert.equal(isNull(""), false);
  })
});
