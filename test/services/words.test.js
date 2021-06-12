const assert = require('assert');
const app = require('../../src/app');
const { buildUppercaseAlphabet } = require('../../src/utilities/alphabet');

describe('"words" service', () => {
  it('registered the service', () => {
    const service = app.service('words');
    assert.ok(
      service,
      'Registered the service'
    );
  });

  it('finds words of length two', async () => {
    const service = app.service('words');
    const results = await service.find({ length: 2 });
    assert.equal(
      results.length,
      427,
      'There are many words of length two'
    );
  });

  it('finds words of length one', async () => {
    const service = app.service('words');
    const results = await service.find({ length: 1 });
    assert.equal(
      results.length,
      26,
      'Returns twenty six words of length one'
    );
    assert.deepEqual(
      results,
      buildUppercaseAlphabet(),
      'The words of length one are just the letters of the alphabet'
    );
  });

  it('finds no words of length zero', async () => {
    const service = app.service('words');
    const results = await service.find({ length: 0 });
    assert.equal(
      results.length,
      0,
      'There are no words of length zero'
    );
  });

  it('finds no words when length is not specified correctly', async () => {
    const service = app.service('words');
    const results = await service.find({ length: 'a' });
    assert.equal(
      results.length,
      0,
      'Found no words'
    );
  });
});
