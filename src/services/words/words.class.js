/* eslint-disable no-unused-vars */

const fs = require('fs');

exports.Words = class Words {
  constructor (options, app) {
    this.app = app;
    this.words_lists = [];
    this.words_lists[0] = [];
    for (let i = 1; i <= 10; i++) {
      this.words_lists[i] = this._knownWordsWithLength(i);
    }
  }

  async find(params) {
    const { length, regExp } = params;
    if (! this._isValidLength(length)) return [];
    const words = this.words_lists[length];
    if (! regExp) return words;
    return words.filter(
      word => regExp.test(word)
    );
  }

  _isValidLength(length) {
    if (typeof length !== 'number') return false;
    if (length < 1 || length > 10) return false;
    return true;
  }

  _knownWordsWithLength(length) {
    try {
      const fileName = `word_lists/words${length}.txt`;
      const fileAsString = fs.readFileSync(fileName, 'utf8');
      const words = fileAsString.split('\n');
      return words.filter(
        word => /[A-Z]+/.test(word)
      );
    } catch (err) {
      console.error(err);
      return [];
    }
  }
};
