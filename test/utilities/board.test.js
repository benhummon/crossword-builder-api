const assert = require('assert');
const boardUtility = require('../../src/utilities/board');

function buildData(activeSquareIndex) {
  return {
    squareValues: [
      'A', 'C', 'E', '~',
      '~', 'A', '~', 'O',
      null, 'T', 'A', 'G',
    ],
    boardWidth: 4,
    boardHeight: 3,
    activeSquareIndex
  };
}

describe('"board" utility', () => {
  describe('buildBoard()', () => {
    it('builds a board object from the data', () => {
      const data = buildData(7);
      const board = boardUtility.buildBoard(data);
      assert.deepEqual(
        board.squareValues,
        data.squareValues
      );
      assert.deepEqual(
        board.width,
        4
      );
      assert.deepEqual(
        board.height,
        3
      );
      assert.equal(
        board.activeColumn,
        3
      );
      assert.equal(
        board.activeRow,
        1
      );
      assert.equal(
        board.squareValueAt(0, 0),
        'A'
      );
      assert.equal(
        board.squareValueAt(0, 2),
        null
      );
      assert.equal(
        board.squareValueAt(3, 1),
        'O'
      );
    });
  });
  describe('leftBound()', () => {
    it('travels left from the active square as far as possible without hitting a ~', () => {
      assert.equal(
        boardUtility.leftBound(boardUtility.buildBoard(buildData(7))),
        3
      );
      assert.equal(
        boardUtility.leftBound(boardUtility.buildBoard(buildData(6))),
        1
      );
      assert.equal(
        boardUtility.leftBound(boardUtility.buildBoard(buildData(2))),
        0
      );
      assert.equal(
        boardUtility.leftBound(boardUtility.buildBoard(buildData(8))),
        0
      );
    });
  });
  describe('rightBound()', () => {
    it('travels left from the active square as far as possible without hitting a ~', () => {
      assert.equal(
        boardUtility.rightBound(boardUtility.buildBoard(buildData(0))),
        2
      );
      assert.equal(
        boardUtility.rightBound(boardUtility.buildBoard(buildData(4))),
        1
      );
      assert.equal(
        boardUtility.rightBound(boardUtility.buildBoard(buildData(8))),
        3
      );
    });
  });
  describe('topBound()', () => {
    it('travels up from the active square as far as possible without hitting a ~', () => {
      assert.equal(
        boardUtility.topBound(boardUtility.buildBoard(buildData(0))),
        0
      );
      assert.equal(
        boardUtility.topBound(boardUtility.buildBoard(buildData(8))),
        2
      );
      assert.equal(
        boardUtility.topBound(boardUtility.buildBoard(buildData(11))),
        1
      );
    });
  });
  describe('bottomBound()', () => {
    it('travels down from the active square as far as possible without hitting a ~', () => {
      assert.equal(
        boardUtility.bottomBound(boardUtility.buildBoard(buildData(0))),
        0
      );
      assert.equal(
        boardUtility.bottomBound(boardUtility.buildBoard(buildData(1))),
        2
      );
      assert.equal(
        boardUtility.bottomBound(boardUtility.buildBoard(buildData(3))),
        2
      );
    });
  });
  describe('horizontalPatternFor()', () => {
    it('computes pattern strings from the board', () => {
      assert.equal(
        boardUtility.horizontalPatternFor(boardUtility.buildBoard(buildData(0)), 0, 2),
        '@CE'
      );
      assert.equal(
        boardUtility.horizontalPatternFor(boardUtility.buildBoard(buildData(0)), 0, 1),
        '@C'
      );
      assert.equal(
        boardUtility.horizontalPatternFor(boardUtility.buildBoard(buildData(0)), 0, 0),
        '@'
      );
      assert.equal(
        boardUtility.horizontalPatternFor(boardUtility.buildBoard(buildData(1)), 0, 2),
        'A@E'
      );
      assert.equal(
        boardUtility.horizontalPatternFor(boardUtility.buildBoard(buildData(8)), 0, 3),
        '@TAG'
      );
      assert.equal(
        boardUtility.horizontalPatternFor(boardUtility.buildBoard(buildData(9)), 0, 3),
        '.@AG'
      );
    });
  });
  describe('verticalPatternFor()', () => {
    it('computes pattern strings from the board', () => {
      assert.equal(
        boardUtility.verticalPatternFor(boardUtility.buildBoard(buildData(1)), 0, 2),
        '@AT'
      );
      assert.equal(
        boardUtility.verticalPatternFor(boardUtility.buildBoard(buildData(5)), 0, 2),
        'C@T'
      );
      assert.equal(
        boardUtility.verticalPatternFor(boardUtility.buildBoard(buildData(4)), 0, 2),
        'A@.'
      );
      assert.equal(
        boardUtility.verticalPatternFor(boardUtility.buildBoard(buildData(8)), 2, 2),
        '@'
      );
    });
  });
});
