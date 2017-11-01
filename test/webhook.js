const assert = require('assert');
const fs = require('fs');

const Webhook = require('./../lib/webhook');
const post = require('./post');

describe('Webhook', () => {
  it('Webhook should return an instance of an Object', () => {
    const project = Webhook({
      port: 3001,
      endPoint: '/build/',
      token: '123456',
      secret: '123456',
      response: 'Payload received. Check logs for details.',
    });
    return assert.ok(project instanceof Object);
  });
  it('listen() should resolve promise with instance of Object', () => {
    const project = Webhook({
      port: 3001,
      endPoint: '/build/',
      token: '123456',
      secret: '123456',
      response: 'Payload received. Check logs for details.',
    });
    const stub = JSON.parse(fs.readFileSync('./test/data.json'));
    console.log(stub.header);
    post({
      port: 3001,
      endPoint: '/build/',
      data: {
        req: {
          headers: { 'x-hub-signature': stub.header },
        },
      },
    });
    project.payload = JSON.parse(fs.readFileSync('./test/data.json'));
    return project.listen().then((payload) => {
      project.server.close();
      return assert.ok(payload instanceof Object);
    }).catch((err) => {
      project.log(err);
      project.server.close();
      return assert.fail(err);
    });
  });
  it('execute() should resolve promise with instance of Object', () => {
    const project = Webhook({
      port: 3001,
      endPoint: '/build/',
      token: '123456',
      secret: '123456',
      response: 'Payload received. Check logs for details.',
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
