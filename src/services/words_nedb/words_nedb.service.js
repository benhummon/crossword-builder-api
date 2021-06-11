// Initializes the `words_nedb` service on path `/words-nedb`
const { WordsNedb } = require('./words_nedb.class');
const createModel = require('../../models/words_nedb.model');
const hooks = require('./words_nedb.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    whitelist: ['$and'],
    multi: ['remove']
  };
  app.use('/words-nedb', new WordsNedb(options, app));
  const service = app.service('words-nedb');
  service.hooks(hooks);
};
