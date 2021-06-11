/* eslint-disable no-unused-vars */

const { computeSubpatterns, computeSubpatternsTrimRight, computeSubpatternsTrimLeft } = require('../../utilities/subpatterns');
const { firstCharacter, lastCharacter, trimFirstCharacter, trimLastCharacter } = require('../../utilities/strings');
const { buildUppercaseAlphabet, filledSquareCharacter } = require('../../utilities/alphabet');
const { remainderAndQuotient } = require('../../utilities/math');
const { inclusiveIndicesArray } = require('../../utilities/arrays');

exports.SuggestionsLists = class SuggestionsLists {
  constructor (options, app) {
    this.app = app;
  }

  async create(data, params) {
    const initialTimeStamp = Date.now();
    const suggestions = await this._computeSuggestions(data);
    console.log('Search Took', Date.now() - initialTimeStamp);
    return suggestions;
  }

  async _computeSuggestions(data) {
    if (typeof data.activeSquareIndex !== 'number') return [];
    const board = buildBoardObject(data);
    const horizontalPattern = computeHorizontalPattern(board, leftBound(board), rightBound(board));
    const verticalPattern = computeVerticalPattern(board, topBound(board), bottomBound(board));
    if (data.canSuggestFill) {
      const horizontalSuggestionsSet = await this._findSuggestions2(horizontalPattern);
      const verticalSuggestionsSet = await this._findSuggestions2(verticalPattern);
      const letterSuggestions = toLettersArray(horizontalSuggestionsSet, verticalSuggestionsSet);
      const suggestFill = await this._suggestFill(board);
      const suggestions = suggestFill ? [filledSquareCharacter].concat(letterSuggestions) : letterSuggestions;
      return suggestions;
    } else {
      const horizontalSuggestionsSet = await this._findSuggestions1(horizontalPattern);
      const verticalSuggestionsSet = await this._findSuggestions1(verticalPattern);
      const suggestions = toLettersArray(horizontalSuggestionsSet, verticalSuggestionsSet);
      return suggestions;
    }
  }

  async _suggestFill(board) {
    const leftPattern = computeHorizontalPattern(board, leftBound(board), board.activeColumn);
    const rightPattern = computeHorizontalPattern(board, board.activeColumn, rightBound(board));
    const topPattern = computeVerticalPattern(board, topBound(board), board.activeRow);
    const bottomPattern = computeVerticalPattern(board, board.activeRow, bottomBound(board));
    if (! await this._computeSuggestFillTrimLeft(leftPattern)) return false;
    if (! await this._computeSuggestFillTrimRight(rightPattern)) return false;
    if (! await this._computeSuggestFillTrimLeft(topPattern)) return false;
    if (! await this._computeSuggestFillTrimRight(bottomPattern)) return false;
    return true;
  }

  async _findSuggestions1(pattern) {
    return await this._findSuggestionsHelper(pattern);
  }

  async _findSuggestions2(pattern) {
    const lettersSet = new Set();
    const subpatterns = computeSubpatterns(pattern);
    for (const subpattern of subpatterns) {
      const lettersSetForSubpattern = await this._findSuggestionsHelper(subpattern);
      for (const letter of lettersSetForSubpattern) {
        lettersSet.add(letter);
      }
    }
    return lettersSet;
  }

  async _findSuggestionsHelper(pattern) {
    const lettersSet = new Set();
    const index = pattern.indexOf('@');
    const length = pattern.length;
    const regExp = buildRegExp(pattern);
    const words = await this.app.service('words').find({ length, regExp });
    // const words = await this.app.service('words-nedb').find({ length, regExp });
    for (const word of words) {
      lettersSet.add(word.charAt(index));
    }
    return lettersSet;
  }

  async _computeSuggestFillTrimLeft(pattern) {
    if (lastCharacter(pattern) !== '@') throw new Error('Expected @ as last character');
    const subpatterns = computeSubpatternsTrimLeft(pattern);
    if (subpatterns.includes('@')) return true;
    for (const subpattern of subpatterns) {
      const regExpPattern = trimLastCharacter(subpattern);
      const hasMatch = await this._hasMatchInDictionary(regExpPattern);
      if (hasMatch) return true;
    }
    return false;
  }

  async _computeSuggestFillTrimRight(pattern) {
    if (firstCharacter(pattern) !== '@') throw new Error('Expected @ as first character');
    const subpatterns = computeSubpatternsTrimRight(pattern);
    if (subpatterns.includes('@')) return true;
    for (const subpattern of subpatterns) {
      const regExpPattern = trimFirstCharacter(subpattern);
      const hasMatch = await this._hasMatchInDictionary(regExpPattern);
      if (hasMatch) return true;
    }
    return false;
  }

  async _hasMatchInDictionary(regExpPattern) {
    const length = regExpPattern.length;
    const words = await this.app.service('words').find({ length });
    // const words = await this.app.service('words-nedb').find({ length });
    const regExp = new RegExp(`^${regExpPattern}$`);
    for (const word of words) {
      if (regExp.test(word)) return true;
    }
  }
};

function buildBoardObject(data) {
  const [activeColumn, activeRow] = remainderAndQuotient(data.activeSquareIndex, data.boardWidth);
  const board = {
    squareValues: data.squareValues,
    width: data.boardWidth,
    height: data.boardHeight,
    activeColumn,
    activeRow,
    squareValueAt(i, j) { return this.squareValues[j * this.width + i]; }
  };
  return board;
}

function toLettersArray(setA, setB) {
  return buildUppercaseAlphabet().filter(
    letter => setA.has(letter) && setB.has(letter)
  );
}

function buildRegExp(pattern) {
  const regExpPattern = pattern.split('').map(
    character => character === '@' ? '.' : character
  ).join('');
  return new RegExp(`^${regExpPattern}$`);
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
