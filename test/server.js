const assert = require('assert');
const http = require('http');
const server = require('./../lib/server');

describe('server', () => {
  it('should return an http object', () => {
    const options = {
      port: 3001,
    };
    assert.ok(server(options) instanceof http.Server);
  });
});
