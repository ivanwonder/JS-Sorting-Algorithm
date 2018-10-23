const { LZW } = require("../algorithm/DataCompression");
const assert = require("assert");

describe("test LZW", function() {
  it("DataCompression", function() {
    let compress = LZW.compress("a");
    let expand = LZW.expand(compress);
    assert.strictEqual(expand, "a");

    compress = LZW.compress("ABABABA");
    expand = LZW.expand(compress);
    assert.strictEqual(expand, "ABABABA");
  })
});
