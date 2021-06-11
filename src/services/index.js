const suggestionsLists = require('./suggestions_lists/suggestions_lists.service.js');
const wordsNedb = require('./words_nedb/words_nedb.service.js');
const words = require('./words/words.service.js');

module.exports = function (app) {
  app.configure(suggestionsLists);
  app.configure(wordsNedb);
  app.configure(words);
};