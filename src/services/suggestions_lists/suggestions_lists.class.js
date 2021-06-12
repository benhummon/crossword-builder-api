const {
  computeSubpatterns, computeSubpatternsTrimRight, computeSubpatternsTrimLeft
} = require('../../utilities/subpatterns');
const {
  buildBoardObject,
  leftBound, rightBound, topBound, bottomBound,
  computeHorizontalPattern, computeVerticalPattern
} = require('../../utilities/board');
const {
  firstCharacter, lastCharacter,
  trimFirstCharacter, trimLastCharacter
} = require('../../utilities/strings');
const { buildUppercaseAlphabet, filledSquareCharacter } = require('../../utilities/alphabet');

exports.SuggestionsLists = class SuggestionsLists {
  constructor (options, app) {
    this.app = app;
  }

  async create(data /*, params */) {
    try {
      const initialTimeStamp = Date.now();
      const suggestions = await this._suggestions(data);
      console.log('Search Took', Date.now() - initialTimeStamp);
      return suggestions;
    } catch (error) {
      console.error('Error occured in create method of suggestions-lists service:', error);
    }
  }

  async _suggestions(data) {
    if (typeof data.activeSquareIndex !== 'number') return [];
    const board = buildBoardObject(data);
    if (board.canSuggestFill) {
      return await this._suggestionsCanSuggestFill(board);
    } else {
      return await this._suggestionsCannotSuggestFill(board);
    }
  }

  async _suggestionsCanSuggestFill(board) {
    const horizontalPattern = computeHorizontalPattern(board, leftBound(board), rightBound(board));
    const verticalPattern = computeVerticalPattern(board, topBound(board), bottomBound(board));
    const [
      horizontalSuggestionsSet,
      verticalSuggestionsSet,
      suggestFill
    ] = await Promise.all([
      this._findSuggestions2(horizontalPattern),
      this._findSuggestions2(verticalPattern),
      this._suggestFill(board)
    ]);
    const letterSuggestions = toLettersArray(horizontalSuggestionsSet, verticalSuggestionsSet);
    if (suggestFill) return letterSuggestions.concat(filledSquareCharacter);
    return letterSuggestions;
  }

  async _suggestionsCannotSuggestFill(board) {
    const horizontalPattern = computeHorizontalPattern(board, leftBound(board), rightBound(board));
    const verticalPattern = computeVerticalPattern(board, topBound(board), bottomBound(board));
    const [
      horizontalSuggestionsSet,
      verticalSuggestionsSet,
    ] = await Promise.all([
      this._findSuggestions1(horizontalPattern),
      this._findSuggestions1(verticalPattern)
    ]);
    return toLettersArray(horizontalSuggestionsSet, verticalSuggestionsSet);
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
    const words = await this.app.service('words').find({ length, regExp }); // !!! this should not be here
    for (const word of words) {
      lettersSet.add(word.charAt(index));
    }
    return lettersSet;
  }

  async _suggestFill(board) {
    if (! board.canSuggestFill) return false;
    const leftPattern = computeHorizontalPattern(board, leftBound(board), board.activeColumn);
    const rightPattern = computeHorizontalPattern(board, board.activeColumn, rightBound(board));
    const topPattern = computeVerticalPattern(board, topBound(board), board.activeRow);
    const bottomPattern = computeVerticalPattern(board, board.activeRow, bottomBound(board));
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
