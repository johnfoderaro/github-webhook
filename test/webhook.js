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
    const mock = JSON.parse(fs.readFileSync('./test/mock.json'));
    post({ mock, port: 3001, endPoint: '/build/' });
    return project.listen().then((payload) => {
      project.server.close();
      return assert.ok(payload instanceof Object);
    }).catch((err) => {
      project.log(err);
      project.server.close();
      return assert.fail(err);
    });
  });

  it('execute() should resolve promise with valid stdout data', () => {
    const mock = [ '.\n..\n.eslintrc.js\n.git\n.gitignore\nexample\nindex.js\nlib\nnode_modules\npackage-lock.json\npackage.json\nreadme.md\ntest\n' ];
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
      .then((data) => {
        console.log(data);        
        assert.ok(data.);
      })
      .catch(err => project.log(err));
  });
});
