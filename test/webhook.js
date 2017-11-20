const assert = require('assert');
const fs = require('fs');

const webhook = require('./../index');
const post = require('./post');

describe('webhook', () => {
  it('webhook should throw error if incorrect options', () => {
    assert.throws(() => webhook(), Error);
    assert.throws(() => webhook({
      port: '3001',
      endPoint: '/build/',
      secret: '123456',
      response: 'Payload received. Check logs for details.',
    }), Error);
    assert.throws(() => webhook({
      port: 3001,
      endPoint: true,
      secret: [],
      response: {},
    }), Error);
  });
  it('webhook should return an instance of an Object', () => {
    const project = webhook({
      port: 3001,
      endPoint: '/build/',
      secret: '123456',
      response: 'Payload received. Check logs for details.',
    });
    return assert.ok(project instanceof Object);
  });

  it('listen() should resolve promise with instance of Object', () => {
    const project = webhook({
      port: 3001,
      endPoint: '/build/',
      secret: '123456',
      response: 'Payload received. Check logs for details.',
    });
    const mock = JSON.parse(fs.readFileSync('./test/mock.json'));
    post({ mock, port: 3001, endPoint: '/build/' });
    project.listen(payload => assert.ok(JSON.parse(payload) instanceof Object));
  });

  it('execute() should resolve promise with valid stdout data', () => {
    const mock = ['.\n..\n.eslintrc.js\n.git\n.gitignore\n.npmignore\nindex.js\nnode_modules\npackage-lock.json\npackage.json\nreadme.md\ntest\n'];
    const project = webhook({
      port: 3001,
      endPoint: '/build/',
      secret: '123456',
      response: 'Payload received. Check logs for details.',
    });
    const commands = [{
      command: 'ls',
      args: ['-a'],
      options: { env: process.env },
    }];
    project.execute(commands, (err, data) => assert.ok(data.stdout[0] === mock[0]));
  });
});
