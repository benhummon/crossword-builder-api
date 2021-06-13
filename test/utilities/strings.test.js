const assert = require('assert');
const strings = require('../../src/utilities/strings');

describe('"strings" utility', () => {
  describe('firstCharacter()', () => {
    it('returns the first character for a non-empty string', () => {
      assert.equal(
        strings.firstCharacter('gazebo'),
        'g'
      );
    });
    it('returns the empty string for an empty string', () => {
      assert.equal(
        strings.firstCharacter(''),
        ''
      );
    });
  });
  describe('lastCharacter()', () => {
    it('returns the last character for a non-empty string', () => {
      assert.equal(
        strings.lastCharacter('gazebo'),
        'o'
      );
    });
    it('returns the empty string for an empty string', () => {
      assert.equal(
        strings.lastCharacter(''),
        ''
      );
    });
  });
  describe('trimFirstCharacter()', () => {
    it('returns all of the string except the first character', () => {
      assert.equal(
        strings.trimFirstCharacter('gazebo'),
        'azebo'
      );
    });
    it('returns the empty string for an empty string', () => {
      assert.equal(
        strings.trimFirstCharacter(''),
        ''
      );
    });
  });
  describe('trimLastCharacter()', () => {
    it('returns all of the string except the last character', () => {
      assert.equal(
        strings.trimLastCharacter('gazebo'),
        'gazeb'
      );
    });
    it('returns the empty string for an empty string', () => {
      assert.equal(
        strings.trimLastCharacter(''),
        ''
      );
    });
  });
});
