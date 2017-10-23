const assert = require('assert');

const Webhook = require('./../lib/webhook');
const post = require('./post');

describe('Webhook', () => {
  it('Webhook should return an instance of an Object', () => {
    const project = Webhook({
      port: 3001,
      endPoint: '/build/',
      token: '123456',
      secret: 'true',
      response: 'Payload received. Check logs for details.',
    });
    assert.ok(project instanceof Object);
  });
  it('listen() should resolve promose with instance of Object', () => {
    const project = Webhook({
      port: 3001,
      endPoint: '/build/',
      token: '123456',
      secret: 'true',
      response: 'Payload received. Check logs for details.',
    });
    post({ port: 3001, endPoint: '/build/', data: { test: true } });
    return project.listen().then((payload) => {
      project.server.close();
      return assert.ok(payload instanceof Object);
    }).catch(err => console.error(err));
  });
  it('execute() should resolve promise with instance of Object', () => {
    const project = Webhook({
      endPoint: '/build/',
      port: 3001,
      response: 'Payload received. Check logs for details.',
      secret: 'true',
      token: '123456',
    });
    const commands = [{
      command: 'ls',
      args: ['-a'],
      options: { env: process.env },
    }];
    return project.execute(commands)
      .then(data => assert.ok(data))
      .catch(err => project.log(err));
  });
});
