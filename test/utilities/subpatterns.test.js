const assert = require('assert');
const subpatterns = require('../../src/utilities/subpatterns');

describe('"subpatterns" utility', () => {
  describe('computeSubpatternsTrimLeft()', () => {
    it('computes subpatterns on the left', () => {
      assert.deepEqual(
        subpatterns.computeSubpatternsTrimLeft('a..b.@c.d'),
        ['@c.d', 'b.@c.d', '.b.@c.d', 'a..b.@c.d']
      );
      assert.deepEqual(
        subpatterns.computeSubpatternsTrimLeft('a..b.@'),
        ['@', 'b.@', '.b.@', 'a..b.@']
      );
      assert.deepEqual(
        subpatterns.computeSubpatternsTrimLeft('@'),
        ['@']
      );
      assert.throws(() => {
        subpatterns.computeSubpatternsTrimLeft('a..b.c.d');
      });
    });
  });
  describe('computeSubpatternsTrimRight()', () => {
    it('computes subpatterns on the right', () => {
      assert.deepEqual(
        subpatterns.computeSubpatternsTrimRight('a..b.@c.d'),
        ['a..b.@c', 'a..b.@c.d']
      );
      assert.deepEqual(
        subpatterns.computeSubpatternsTrimRight('@c.d'),
        ['@c', '@c.d']
      );
      assert.deepEqual(
        subpatterns.computeSubpatternsTrimRight('@'),
        ['@']
      );
      assert.throws(() => {
        subpatterns.computeSubpatternsTrimRight('a..b.c.d');
      });
    });
  });
  describe('computeSubpatterns()', () => {
    it('computes subpatterns trimming on both sides', () => {
      assert.deepEqual(
        subpatterns.computeSubpatterns('a..b.@c.d').sort(),
        ['@c', '@c.d', 'b.@c', '.b.@c', 'b.@c.d', '.b.@c.d', 'a..b.@c', 'a..b.@c.d'].sort()
      );
      assert.deepEqual(
        subpatterns.computeSubpatterns('a..b.@c.d').map(pattern => pattern.length),
        [2, 4, 4, 5, 6, 7, 7, 9]
      );
      assert.deepEqual(
        subpatterns.computeSubpatterns('@c.d'),
        ['@c', '@c.d']
      );
      assert.deepEqual(
        subpatterns.computeSubpatterns('a..b.@'),
        ['@', 'b.@', '.b.@', 'a..b.@']
      );
      assert.deepEqual(
        subpatterns.computeSubpatterns('@'),
        ['@']
      );
      assert.throws(() => {
        subpatterns.computeSubpatterns('a..b.c.d');
      });
    });
  });
});
