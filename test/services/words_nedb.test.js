const assert = require('assert');
const app = require('../../src/app');

describe('\'words_nedb\' service', () => {
  it('registered the service', () => {
    const service = app.service('words-nedb');

    assert.ok(service, 'Registered the service');
  });
});
