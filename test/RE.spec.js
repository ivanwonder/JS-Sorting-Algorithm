var assert = require('assert')
var {RE} = require('../algorithm/RE')
var {readLine} = require("../server/readGraph");
var path = require("path");

describe('Regular Expressions', function () {
  it('test RE', function (done) {
    assert.equal(new RE("((A*B|AC)D)").recognizes("AABD"), true);
    const reg = new RE("(.*(A*B|AC)D.*)");
    const _res = [];
    readLine(path.join(__dirname, "../server/resource/tinyL.txt")).then(source => {
      for (const txt of source) {
        if (reg.recognizes(txt.trim())) {
          _res.push(txt.trim());
        }
      }
      assert.deepEqual(_res, ["ABD", "ABCCBD"]);
      done();
    }).catch(done);
  })
})
