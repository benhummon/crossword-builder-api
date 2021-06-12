// Initializes the `suggestions-lists` service on path `/suggestions-lists`

const { SuggestionsLists } = require('./suggestions_lists.class');
const hooks = require('./suggestions_lists.hooks');

module.exports = function (app) {
  const options = {};
  app.use('/suggestions-lists', new SuggestionsLists(options, app));
  const service = app.service('suggestions-lists');
  service.hooks(hooks);
};
