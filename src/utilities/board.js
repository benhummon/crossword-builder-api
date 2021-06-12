const { remainderAndQuotient } = require('./math');
const { inclusiveIndicesArray } = require('./arrays');
const { filledSquareCharacter } = require('./alphabet');

function buildBoardObject(data) {
  const [activeColumn, activeRow] = remainderAndQuotient(data.activeSquareIndex, data.boardWidth);
  const board = {
    squareValues: data.squareValues,
    width: data.boardWidth,
    height: data.boardHeight,
    activeColumn,
    activeRow,
    canSuggestFill: data.canSuggestFill,
    squareValueAt(i, j) { return this.squareValues[j * this.width + i]; }
  };
  return board;
}

/* HORIZONTAL */

function leftBound(board) {
  let i = board.activeColumn;
  while (i - 1 >= 0 && board.squareValueAt(i - 1, board.activeRow) !== filledSquareCharacter) {
    i--;
  }
  return i;
}

function rightBound(board) {
  let i = board.activeColumn;
  while (i + 1 < board.width && board.squareValueAt(i + 1, board.activeRow) !== filledSquareCharacter) {
    i++;
  }
  return i;
}

function computeHorizontalPattern(board, from, to) {
  return inclusiveIndicesArray(from, to).map(i => {
    const character = board.squareValueAt(i, board.activeRow);
    if (i === board.activeColumn) return '@';
    if (character === null) return '.';
    if (/[A-Z]/.test(character)) return character;
    throw new Error(`Unexpected character: ${character}`);
  }).join('');
}

/* VERTICAL */

function topBound(board) {
  let j = board.activeRow;
  while (j - 1 >= 0 && board.squareValueAt(board.activeColumn, j - 1) !== filledSquareCharacter) {
    j--;
  }
  return j;
}

function bottomBound(board) {
  let j = board.activeRow;
  while (j + 1 < board.width && board.squareValueAt(board.activeColumn, j + 1) !== filledSquareCharacter) {
    j++;
  }
  return j;
}

function computeVerticalPattern(board, from, to) {
  return inclusiveIndicesArray(from, to).map(j => {
    const character = board.squareValueAt(board.activeColumn, j);
    if (j === board.activeRow) return '@';
    if (character === null) return '.';
    if (/[A-Z]/.test(character)) return character;
    throw new Error(`Unexpected character: ${character}`);
  }).join('');
}

module.exports = {
  buildBoardObject,
  leftBound,
  rightBound,
  computeHorizontalPattern,
  topBound,
  bottomBound,
  computeVerticalPattern
};