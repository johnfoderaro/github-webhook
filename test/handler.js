const assert = require('assert');
const http = require('http');
const handler = require('./../lib/handler');

describe('handler', () => {
  it('should return an object', () => {
    const request01 = handler({ port: 3002, endPoint: '/build/' });
    const request02 = handler({ port: 3003, endPoint: '/build/' });
    assert.ok(http.createServer(request01).listen(3002));
    assert.ok(http.createServer(request02).listen(3003));
  });
});
