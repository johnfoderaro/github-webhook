const assert = require('assert');
const handler = require('./../lib/handler');

describe('handler', () => {
  it('should return an object', () => {
    const request01 = handler();
    const request02 = handler({});
    assert.ok(request01() instanceof Object);
    assert.ok(request02() instanceof Object);
  });
});
