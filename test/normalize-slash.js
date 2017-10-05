const assert = require('assert');
const normalizeSlash = require('./../lib/normalize-slash');

describe('normalizeSlash', () => {
  it('should return a string wtih a forward slash as last character', () => {
    assert.equal(normalizeSlash('test'), 'test/');
  });
  it('should return the same string that was passed as an argument', () => {
    assert.equal(normalizeSlash('test/'), 'test/');
  });
});
