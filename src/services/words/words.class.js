/* eslint-disable no-unused-vars */

const fs = require('fs');
const { inclusiveIndicesArray } = require('../../utilities/arrays');

const minWordLength = 1;
const maxWordLength = 10;

exports.Words = class Words {
  constructor (options, app) {
    this.app = app;
  }

  async find(params) {
    try {
      const { length, regExp } = params;
      if (! this._isValidLength(length)) return [];
      await this._ensureWordsLoaded();
      const words = this.words_lists[length];
      if (! regExp) return words;
      return words.filter(
        word => regExp.test(word)
      );
    } catch (error) {
      console.error('Error occurred in find method of words service:', error);
    }
  }

  _isValidLength(length) {
    if (typeof length !== 'number') return false;
    if (length < minWordLength || length > maxWordLength) return false;
    return true;
  }

  _ensureWordsLoaded() {
    if (this._loadingWordsPromise) return this._loadingWordsPromise;
    this._loadingWordsPromise = this._loadWords();
    return this._loadingWordsPromise;
  }

  async _loadWords() {
    try {
      this.words_lists = [];
      await Promise.all(
        inclusiveIndicesArray(minWordLength, maxWordLength).map(
          i => this._loadWordsOfLength(i)
        )
      );
    } catch (error) {
      console.error('Error occurred loading words:', error);
    }
  }

  async _loadWordsOfLength(i) {
    try {
      const fileName = `word_lists/words${i}.txt`;
      const fileAsString = fs.readFileSync(fileName, 'utf8');
      const words = fileAsString.split('\n');
      this.words_lists[i] = words.filter(
        word => /[A-Z]+/.test(word)
      );
    } catch (error) {
      console.error(`Error occurred loading words of length ${i}:`, error);
      return [];
    }
  }
};
