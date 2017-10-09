const assert = require('assert');

const webhook = require('./../lib/webhook');
const post = require('./post');

describe('webhook', () => {
  it('webhook() should return an instance of an Object', () => {
    const project = webhook({
      port: 3001,
      endPoint: '/build/',
      token: 123456,
      secret: true,
    });
    assert.ok(project instanceof Object);
    project.server().close();
  });
  it('webhook().listen() should return an instance of an Object', () => {
    const project = webhook({
      port: 3001,
      endPoint: '/build/',
      token: 123456,
      secret: true,
    });
    project.listen().then((payload) => {
      assert.ok(payload instanceof Object)
    }).catch(err => console.error(err));
    post({ port: 3001, endPoint: '/build/', data: { test: true } });
  });
});
