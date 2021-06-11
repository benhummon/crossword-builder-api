const assert = require('assert');
const app = require('../../src/app');

describe('\'suggestions_lists\' service', () => {
  it('registered the service', () => {
    const service = app.service('suggestions-lists');

    assert.ok(service, 'Registered the service');
  });
});
