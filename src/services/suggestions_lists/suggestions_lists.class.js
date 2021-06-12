const {
  computeSubpatterns, computeSubpatternsTrimRight, computeSubpatternsTrimLeft
} = require('../../utilities/subpatterns');
const {
  buildBoard,
  leftBound, rightBound, topBound, bottomBound,
  horizontalPatternFor, verticalPatternFor
} = require('../../utilities/board');
const {
  firstCharacter, lastCharacter,
  trimFirstCharacter, trimLastCharacter
} = require('../../utilities/strings');
const { buildUppercaseAlphabet, filledSquareCharacter } = require('../../utilities/alphabet');
const { isNumber } = require('../../utilities/math');

function toLettersArray(setA, setB) {
  return buildUppercaseAlphabet().filter(
    letter => setA.has(letter) && setB.has(letter)
  );
}

exports.SuggestionsLists = class SuggestionsLists {
  constructor (options, app) {
    this.app = app;
  }

  async create(data /*, params */) {
    try {
      return await this._suggestions(data);
    } catch (error) {
      console.error('Error occured in create method of suggestions-lists service:', error);
    }
  }

  // END OF STANDARD METHODS

  async _suggestions(data) {
    if (! isNumber(data.activeSquareIndex)) return [];
    const board = buildBoard(data);
    if (data.canSuggestFill) {
      return await this._suggestionsCanSuggestFill(board);
    } else {
      return await this._suggestionsCannotSuggestFill(board);
    }
  }

  async _suggestionsCannotSuggestFill(board) {
    const horizontalPattern = horizontalPatternFor(board, leftBound(board), rightBound(board));
    const verticalPattern = verticalPatternFor(board, topBound(board), bottomBound(board));
    const [
      suggestionsSetA,
      suggestionsSetB,
    ] = await Promise.all([
      this._suggestionsSetForPattern(horizontalPattern),
      this._suggestionsSetForPattern(verticalPattern)
    ]);
    return toLettersArray(suggestionsSetA, suggestionsSetB);
  }

  async _suggestionsCanSuggestFill(board) {
    const horizontalPattern = horizontalPatternFor(board, leftBound(board), rightBound(board));
    const verticalPattern = verticalPatternFor(board, topBound(board), bottomBound(board));
    const [
      suggestionsSetA,
      suggestionsSetB,
      suggestFill
    ] = await Promise.all([
      this._suggestionsSetForAllSubpatterns(horizontalPattern),
      this._suggestionsSetForAllSubpatterns(verticalPattern),
      this._suggestFill(board)
    ]);
    const letters = toLettersArray(suggestionsSetA, suggestionsSetB);
    if (suggestFill) return letters.concat(filledSquareCharacter);
    return letters;
  }

  async _suggestionsSetForAllSubpatterns(pattern) {
    const lettersSet = new Set();
    const subpatterns = computeSubpatterns(pattern);
    for (const subpattern of subpatterns) {
      const lettersSetForSubpattern = await this._suggestionsSetForPattern(subpattern);
      for (const letter of lettersSetForSubpattern) {
        lettersSet.add(letter);
      }
    }
    return lettersSet;
  }

  async _suggestionsSetForPattern(pattern) {
    const lettersSet = new Set();
    const index = pattern.indexOf('@');
    const length = pattern.length;
    const regExpPattern = pattern.split('').map(
      character => character === '@' ? '.' : character
    ).join('');
    const regExp = new RegExp(`^${regExpPattern}$`);
    const words = await this.app.service('words').find({ length, regExp });
    for (const word of words) {
      lettersSet.add(word.charAt(index));
    }
    return lettersSet;
  }

  async _suggestFill(board) {
    const leftPattern = horizontalPatternFor(board, leftBound(board), board.activeColumn);
    const rightPattern = horizontalPatternFor(board, board.activeColumn, rightBound(board));
    const topPattern = verticalPatternFor(board, topBound(board), board.activeRow);
    const bottomPattern = verticalPatternFor(board, board.activeRow, bottomBound(board));
    const [fillOkForLeft, fillOkForRight, fillOkForTop, fillOkForBottom] = await Promise.all([
      this._suggestFillTrimLeft(leftPattern),
      this._suggestFillTrimRight(rightPattern),
      this._suggestFillTrimLeft(topPattern),
      this._suggestFillTrimRight(bottomPattern)
    ]);
    return fillOkForLeft && fillOkForRight && fillOkForTop && fillOkForBottom;
  }

  async _suggestFillTrimLeft(pattern) {
    if (lastCharacter(pattern) !== '@') throw new Error('Expected @ as last character');
    const subpatterns = computeSubpatternsTrimLeft(pattern);
    if (subpatterns.includes('@')) return true;
    for (const subpattern of subpatterns) {
      const regExpPattern = trimLastCharacter(subpattern);
      const hasMatch = await this._hasMatch(regExpPattern);
      if (hasMatch) return true;
    }
    return false;
  }

  async _suggestFillTrimRight(pattern) {
    if (firstCharacter(pattern) !== '@') throw new Error('Expected @ as first character');
    const subpatterns = computeSubpatternsTrimRight(pattern);
    if (subpatterns.includes('@')) return true;
    for (const subpattern of subpatterns) {
      const regExpPattern = trimFirstCharacter(subpattern);
      const hasMatch = await this._hasMatch(regExpPattern);
      if (hasMatch) return true;
    }
    return false;
  }

  async _hasMatch(regExpPattern) {
    const regExp = new RegExp(`^${regExpPattern}$`);
    const length = regExpPattern.length;
    const words = await this.app.service('words').find({ length });
    for (const word of words) {
      if (regExp.test(word)) return true;
    }
  }
};
