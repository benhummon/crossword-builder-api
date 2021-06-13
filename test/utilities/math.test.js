const assert = require('assert');
const math = require('../../src/utilities/math');

describe('"math" utility', () => {
  describe('isNumber()', () => {
    it('identifies 7 as a number', () => {
      assert.equal(
        math.isNumber(7),
        true
      );
    });
    it('identifies 0 as a number', () => {
      assert.equal(
        math.isNumber(0),
        true
      );
    });
    it('identifies "a" as not a number', () => {
      assert.equal(
        math.isNumber('a'),
        false
      );
    });
    it('identifies NaN as not a number', () => {
      assert.equal(
        math.isNumber(NaN),
        false
      );
    });
    it('identifies Infinity as not a number', () => {
      assert.equal(
        math.isNumber(Infinity),
        false
      );
      assert.equal(
        math.isNumber(- Infinity),
        false
      );
    });
  });
  describe('remainderAndQuotient()', () => {
    it('returns an array with the remainder at index zero', () => {
      assert.equal(
        math.remainderAndQuotient(14, 3)[0],
        2
      );
      assert.equal(
        math.remainderAndQuotient(2, 3)[0],
        2
      );
      assert.equal(
        math.remainderAndQuotient(0, 3)[0],
        0
      );
    });
    it('returns an array with the quotient at index one', () => {
      assert.equal(
        math.remainderAndQuotient(14, 3)[1],
        4
      );
      assert.equal(
        math.remainderAndQuotient(2, 3)[1],
        0
      );
      assert.equal(
        math.remainderAndQuotient(0, 3)[1],
        0
      );
    });
    it('throws an exception when the denominator is zero', () => {
      assert.throws(() => {
        math.remainderAndQuotient(5, 0);
      });
      assert.throws(() => {
        math.remainderAndQuotient(0, 0);
      });
    });
  });
});
