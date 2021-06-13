const assert = require('assert');
const arrays = require('../../src/utilities/arrays');

describe('"arrays" utility', () => {
  describe('arrayOfSize()', () => {
    it('creates an array of size zero', () => {
      assert.equal(
        arrays.arrayOfSize(0).length,
        0
      );
    });
    it('creates an array of size three', () => {
      assert.equal(
        arrays.arrayOfSize(3).length,
        3
      );
    });
    it('creates initializes each of the values in the array to null', () => {
      assert.deepEqual(
        arrays.arrayOfSize(3),
        [null, null, null]
      );
    });
  });
  describe('arrayShallowEquivalent()', () => {
    it('says that equal arrays are equivalent', () => {
      const a = ['a', 'b', 'c'];
      assert.ok(
        arrays.arrayShallowEquivalent(a, a)
      );
    });
    it('correctly identifies equivalent, non-equal arrays', () => {
      assert.ok(
        arrays.arrayShallowEquivalent([1, 2, 3], [1, 2, 3])
      );
    });
    it('correctly identifies non-equivalent arrays', () => {
      assert.ok(
        ! arrays.arrayShallowEquivalent([1, 2, 3], [1, 3, 2])
      );
    });
  });
  describe('indicesArray()', () => {
    it('works when both starting and ending arguments are included', () => {
      assert.deepEqual(
        arrays.indicesArray(3, 7),
        [3, 4, 5, 6]
      );
    });
    it('is an empty array when the arguments are equal', () => {
      assert.deepEqual(
        arrays.indicesArray(4, 4),
        []
      );
    });
    it('starts at zero when only one argument is included', () => {
      assert.deepEqual(
        arrays.indicesArray(3),
        [0, 1, 2]
      );
    });
    it('is an empty array when the only argument is zero', () => {
      assert.deepEqual(
        arrays.indicesArray(0),
        []
      );
    });
  });
  describe('inclusiveIndicesArray()', () => {
    it('works when both starting and ending arguments are included', () => {
      assert.deepEqual(
        arrays.inclusiveIndicesArray(3, 7),
        [3, 4, 5, 6, 7]
      );
    });
    it('is a singleton array when the arguments are equal', () => {
      assert.deepEqual(
        arrays.inclusiveIndicesArray(4, 4),
        [4]
      );
    });
    it('throws an exception if missing an argument', () => {
      assert.throws(() => {
        arrays.inclusiveIndicesArray(6);
      });
    });
  });
});
