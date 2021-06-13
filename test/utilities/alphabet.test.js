const assert = require('assert');
const alphabet = require('../../src/utilities/alphabet');

describe('"alphabet" utility', () => {
  describe('buildLowercaseAlphabet()', () => {
    it('builds the lowercase alphabet', () => {
      assert.equal(
        alphabet.buildLowercaseAlphabet().length,
        26,
      );
      assert.equal(
        alphabet.buildLowercaseAlphabet()[0],
        'a',
      );
      assert.equal(
        alphabet.buildLowercaseAlphabet()[25],
        'z',
      );
    });
  });
  describe('buildUppercaseAlphabet()', () => {
    it('builds the uppercase alphabet', () => {
      assert.equal(
        alphabet.buildUppercaseAlphabet().length,
        26,
      );
      assert.equal(
        alphabet.buildUppercaseAlphabet()[0],
        'A',
      );
      assert.equal(
        alphabet.buildUppercaseAlphabet()[25],
        'Z',
      );
    });
  });
});
