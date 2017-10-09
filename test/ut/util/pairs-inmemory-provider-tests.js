import * as sinon from 'sinon';

import * as Pairs from '../../../src/util/pairs-inmemory-provider';

describe('Inmemory database service', function() {
  before(function() {
    this.pairs = new Pairs();
  });

  describe('#load()', function() {
    it('should load provided data to the database', function() {
      const expected = {
        data: 'data',
      };

      this.pairs.load(expected);

      return expect(this.pairs.db)
        .to.deep.equal(expected);
    });
  });

  describe('#dump()', function() {
    it('should dump data from the database', function() {
      const expected = {
        data: 'data',
      };

      this.pairs.load(expected);

      return expect(this.pairs.dump())
        .to.deep.equal(expected);
    });
  });

  describe('#write()', function() {
    before(function() {
      this.pairs.load({});
    });

    it('should store data into the database', function() {
      const pairs = [
        1,
        2,
        3,
      ];

      const id = 123;

      const expected = {
        123: [
          1,
          2,
          3,
        ],
      };

      this.pairs.write(id, pairs);

      return expect(this.pairs.dump())
        .to.deep.equal(expected);
    });
  });

  describe('#read()', function() {
    before(function() {
      this.pairs.load({});
    });

    it('should return an empty list if nothing is found', function() {
      const expected = [];

      const id = 123;

      return expect(this.pairs.read(id))
        .to.eventually.deep.equal(expected);
    });

    it('should return user data if something is stored', function() {
      const expected = [1, 2, 3];

      const id = 123;

      this.pairs.write(id, expected);

      return expect(this.pairs.read(id))
        .to.eventually.deep.equal(expected);
    });
  });
});
