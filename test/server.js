const assert = require('assert');
const http = require('http');
const server = require('./../lib/server');

describe('server', () => {
  it('should return an http.Server object', async () => {
    const options = { port: 3001, endPoint: '/build/' };
    const request01 = await server(options);
    assert.ok(request01 instanceof http.Server);
    request01.close();
  });
});
