const assert = require('assert');

const WebHook = require('./../lib/webhook');
const post = require('./post');

describe('WebHook', () => {
  it('should return an instance of WebHook', () => {
    const project = WebHook({ port: 3001, endPoint: '/build/' });
    assert.ok(project instanceof Object);
  });
  it('stream() should return an object', () => {
    const project = WebHook({ port: 3002, endPoint: '/build/' });
    post({ port: 3002, endPoint: '/build/', data: { test: true } });    
    project.stream((data) => {
      assert.ok(data instanceof Object);
      return this.server.close();
    });
  });
  // it('commands() should return an object', () => {
  //   const project = WebHook({ port: 3003, endPoint: '/build/' });
  //   project.commands(repo => console.log(`git clone ${repo}`));
  // });
});
