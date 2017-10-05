const assert = require('assert');
const handler = require('./../lib/handler');

describe('handler', () => {
  it('should return null', () => {
    const request = handler();
    assert.equal(request(), false);
  });
  it('should return an object', () => {
    const request = handler({});
    assert.ok(request() instanceof Object);
  });
});
