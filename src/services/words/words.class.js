const fs = require('fs');
const Stream = require('stream');
const { inclusiveIndicesArray } = require('../../utilities/arrays');
const { isNumber } = require('../../utilities/math');

const minWordLength = 1;
const maxWordLength = 10;

exports.Words = class Words {
  constructor (options, app) {
    this.app = app;
  }

  async find(params) {
    try {
      await this._ensureWordsLoaded();
      const { length } = params;
      if (! isNumber(length)) throw Error('Words service find() expects a length');
      if (length < minWordLength || length > maxWordLength) return [];
      return this._wordsOfLength(length);
    } catch (error) {
      console.error('Error occurred in find method of words service:', error);
    }
  }

  // END OF STANDARD METHODS

  _ensureWordsLoaded() {
    if (this._loadingWordsPromise) return this._loadingWordsPromise;
    this._loadingWordsPromise = this._loadWords();
    return this._loadingWordsPromise;
  }

  _wordsOfLength(i) {
    if (! this._wordsLists || ! this._wordsLists[i]) {
      throw Error('Words lists were not initialized');
    }
    return this._wordsLists[i];
  }

  async _loadWords() {
    try {
      this._wordsLists = [];
      await Promise.all(
        inclusiveIndicesArray(minWordLength, maxWordLength).map(
          i => this._loadWordsOfLength(i)
        )
      );
    } catch (error) {
      console.error('Error occurred loading words:', error);
    }
  }

  _loadWordsOfLength(i) {
    this._wordsLists[i] = [];
    return new Promise((resolve, reject) => {
      const readWordsStream = fs.createReadStream(this._wordsFileName(i));
      readWordsStream.on('error', (error) => { reject(error); });
      const storeWordsStream = this._storeWordsStream(this._wordsLists[i]);
      storeWordsStream.on('error', (error) => { reject(error); });
      storeWordsStream.on('finish', () => { resolve(); });
      readWordsStream.pipe(storeWordsStream);
    });
  }

  _wordsFileName(i) {
    return `word_lists/words${i}.txt`;
  }

  _storeWordsStream(array) {
    const storeWordsStream = new Stream.Writable();
    storeWordsStream._write = (chunk, encoding, next) => {
      const words = chunk.toString().split('\n');
      for (let word of words) {
        if (/[A-Z]+/.test(word)) {
          array.push(word);
        }
      }
      next();
    };
    return storeWordsStream;
  }
};