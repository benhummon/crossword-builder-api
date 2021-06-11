// Initializes the `words` service on path `/words`
const { Words } = require('./words.class');
const hooks = require('./words.hooks');

module.exports = function (app) {
  const options = {};
  app.use('/words', new Words(options, app));
  const service = app.service('words');
  service.hooks(hooks);
};
