const assert = require('assert');

const webhook = require('./../lib/webhook');
const post = require('./post');

describe('webhook', () => {
  it('webhook should return an instance of an Object', () => {
    const project = webhook({
      port: 3001,
      endPoint: '/build/',
      token: 123456,
      secret: true,
      response: 'Payload received. Check logs for details.',
    });
    assert.ok(project instanceof Object);
    project.server().close();
  });
  it('listen() should resolve promose with instance of Object', () => {
    const project = webhook({
      port: 3001,
      endPoint: '/build/',
      token: 123456,
      secret: true,
      response: 'Payload received. Check logs for details.',
    });
    post({ port: 3001, endPoint: '/build/', data: { test: true } });
    return project.listen().then((payload) => {
      assert.ok(payload instanceof String);
      project.server().close();
    }).catch(err => console.error(err));
  });
  // it('spawn() should resolve promise with instance of Object', () => {
  //   const project = webhook({
  //     port: 3001,
  //     endPoint: '/build/',
  //     token: 123456,
  //     secret: true,
  //     response: 'Payload received. Check logs for details.',
  //   });
  //   return project.listen().then((payload) => {
  //     assert.ok(payload instanceof Object);
  //   }).catch(err => console.error(err));
  // });
});
