const { Service } = require('feathers-nedb');
const fs = require('fs');

exports.WordsNedb = class WordsNedb extends Service {
  async create({ word }) {
    if (! word) return;
    if (word === '') return;
    return await super.create({
      _id: word,
      length: word.length
    });
  }

  async find({ length, regExp }) {
    try {
      const dbResults = await super.find({ query: this._query(length, regExp) });
      const results = dbResults.map(
        result => result._id
      );
      return results;
    } catch (error) {
      console.error('Errror occurred finding words:', error);
      return [];
    }
  }

  _query(length, regExp) {
    const hasLength = typeof length === 'number';
    if (regExp) {
      if (hasLength) {
        return { $and: [{ length }, { _id: regExp }] };
      } else {
        return { _id: regExp };
      }
    } else {
      if (hasLength) {
        return { length };
      } else {
        return {};
      }
    }
  }

  // !!! should I override the other standard methods that I don't want implemented?

  /* custom methods */

  async loadAllWords() {
    try {
      super.remove(null, { query: {} });
      console.log('Loading all words...');
      for (let i = 1; i <= 10; i++) {
        const fileName = `word_lists/words${i}.txt`;
        const fileAsString = fs.readFileSync(fileName, 'utf8'); // !!! sync?
        const words = fileAsString.split('\n');
        for (let word of words) {
          if (word && word !== '') {
            await this.create({ word });
          }
        }
      }
      console.log('Done loading all words.');
    } catch (err) {
      console.error('Error occurred while loading all words:', err);
    }
  }
};
