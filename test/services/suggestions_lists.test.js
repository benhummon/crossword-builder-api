const assert = require('assert');
const app = require('../../src/app');
const { buildUppercaseAlphabet } = require('../../src/utilities/alphabet');

const wordsForMock = buildUppercaseAlphabet().concat([
  'AC', 'AT', 'OG', 'LA',
  'CAT', 'ABS', 'ACE', 'DOG', 'SAT', 'SOG',
  'ACED', 'ACES', 'ACER', 'CATS', 'DOGS', 'RACE', 'SOGS'
]);

function mockWordService() {
  const mockedService = {
    async find({ length }) {
      return wordsForMock.filter(word => word.length === length);
    }
  };
  app.use('/words', mockedService);
}

describe('"suggestions_lists" service', () => {
  it('registered the service', () => {
    const service = app.service('suggestions-lists');
    assert.ok(
      service,
      'Registered the service'
    );
  });
  describe('create()', () => {
    let originalWordService;
    before(() => {
      originalWordService = app.service('/words');
    });
    after(() => {
      app.use('/words', originalWordService);
    });
    describe('for canSuggestFill=false', () => {
      const canSuggestFill = false;
      it('works when active square is null', async () => {
        const data = {
          boardWidth: 4,
          boardHeight: 1,
          squareValues: [
            'A', 'C', 'E', null,
          ],
          activeSquareIndex: 3,
          canSuggestFill
        };
        mockWordService();
        const results = await app.service('suggestions-lists').create(data);
        assert.deepEqual(
          results,
          ['D', 'R', 'S']
        );
      });
      it('works when active square is filled', async () => {
        const data = {
          boardWidth: 4,
          boardHeight: 1,
          squareValues: [
            'A', 'C', 'E', '~',
          ],
          activeSquareIndex: 3,
          canSuggestFill
        };
        mockWordService();
        const results = await app.service('suggestions-lists').create(data);
        assert.deepEqual(
          results,
          ['D', 'R', 'S']
        );
      });
      it('works when active square is a letter', async () => {
        const data = {
          boardWidth: 4,
          boardHeight: 1,
          squareValues: [
            'A', 'C', 'E', 'D',
          ],
          activeSquareIndex: 3,
          canSuggestFill
        };
        mockWordService();
        const results = await app.service('suggestions-lists').create(data);
        assert.deepEqual(
          results,
          ['D', 'R', 'S']
        );
      });
      it('works when constrained in two dimensions', async () => {
        const data = {
          boardWidth: 4,
          boardHeight: 3,
          squareValues: [
            'A', 'C', 'E', '~',
            '~', 'A', '~', 'O',
            null, 'T', 'A', 'G',
          ],
          activeSquareIndex: 3,
          canSuggestFill
        };
        mockWordService();
        const results = await app.service('suggestions-lists').create(data);
        assert.deepEqual(
          results,
          ['D', 'S']
        );
      });
    });
    describe('works for canSuggestFill=true', () => {
      const canSuggestFill = true;
      it('works when active square is surrounded by filled squares', async () => {
        const data = {
          boardWidth: 4,
          boardHeight: 1,
          squareValues: [
            'A', null, null, null,
          ],
          activeSquareIndex: 2,
          canSuggestFill
        };
        mockWordService();
        const results = await app.service('suggestions-lists').create(data);
        assert.deepEqual(
          results,
          buildUppercaseAlphabet().concat('~')
        );
      });
      it('works when active square is adjancent to a letter', async () => {
        const data = {
          boardWidth: 4,
          boardHeight: 1,
          squareValues: [
            'A', null, null, null,
          ],
          activeSquareIndex: 1,
          canSuggestFill
        };
        mockWordService();
        const results = await app.service('suggestions-lists').create(data);
        assert.deepEqual(
          results,
          ['B', 'C', 'T', '~']
        );
      });
      it('works when active square is between letters', async () => {
        const data = {
          boardWidth: 4,
          boardHeight: 1,
          squareValues: [
            'A', null, 'S', null,
          ],
          activeSquareIndex: 1,
          canSuggestFill
        };
        mockWordService();
        const results = await app.service('suggestions-lists').create(data);
        assert.deepEqual(
          results,
          ['B', '~']
        );
      });
      it('works when active square is between letters', async () => {
        const data = {
          boardWidth: 4,
          boardHeight: 1,
          squareValues: [
            'A', null, 'S', null,
          ],
          activeSquareIndex: 1,
          canSuggestFill
        };
        mockWordService();
        const results = await app.service('suggestions-lists').create(data);
        assert.deepEqual(
          results,
          ['B', '~']
        );
      });
      it('works when constrained in two dimensions', async () => {
        const data = {
          boardWidth: 4,
          boardHeight: 3,
          squareValues: [
            'A', 'C', 'E', '~',
            '~', 'A', '~', 'O',
            null, 'T', 'A', 'G',
          ],
          activeSquareIndex: 3,
          canSuggestFill
        };
        mockWordService();
        const results = await app.service('suggestions-lists').create(data);
        assert.deepEqual(
          results,
          ['D', 'S', '~']
        );
      });
    });
  });
});
