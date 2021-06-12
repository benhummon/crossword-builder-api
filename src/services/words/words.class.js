const fs = require('fs');
const Stream = require('stream');
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

  _loadWordsOfLength(i) {
    this.words_lists[i] = [];
    return new Promise((resolve, reject) => {
      const readWordsStream = fs.createReadStream(this._wordsFileName(i));
      readWordsStream.on('error', (error) => { reject(error); });
      const storeWordsStream = this._storeWordsStream(this.words_lists[i]);
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