import * as sinon from 'sinon';

import * as InMemoryDB from '../../../src/util/sessions-inmemory-provider';

describe('Inmemory database service', function() {
  before(function() {
    this.db = new InMemoryDB();
  });

  after(function() {
  });

  describe('#load()', function() {
    after(function() {
      this.db.load({});
    });

    it('should load data to the database', function() {
      const expected = {
        data: 'data',
      };

      this.db.load(expected);

      return expect(this.db.dump())
        .to.deep.equal(expected);
    });
  });

  describe('#dump()', function() {
    it('should dump data from the database', function() {
      const expected = {
        data: 'data',
      };

      this.db.load(expected);

      return expect(this.db.dump())
        .to.deep.equal(expected);
    });
  });

  describe('#write()', function() {
    it('should return a Promise', function() {
      const ret = this.db.write(
        'SESSION_ID', {
          key: 'value',
        });

      expect(ret)
        .to.be.a('Promise');

      return expect(ret)
        .to.eventually.be.fulfilled;
    });

    it('should return context with an unwritten session id', function() {
      return expect(this.db.read('SESSION_IDD'))
        .to.deep.equal({});
    });

    it('should return context with a written session id', function() {
      return expect(
          this.db.read('SESSION_ID')
        )
        .to.become({
          key: 'value',
        });
    });

    describe('#getAvailablePairs()', function() {
      after(function() {
        this.db.load({});
      });

      it('should return a Promise', function() {
        const ret = this.db.getAvailablePairs(
          'id',
        );

        expect(ret)
          .to.be.a('Promise');

        return expect(ret)
          .to.eventually.be.fulfilled;
      });

      it('should return pairs when there are some',
        function() {
          const context = {
            name: 'Pertti',
            searching: true,
            communicationMethods: {
              SKYPE: 'pertti_42',
            },
          };

          return this.db.write(
              'SESSION_ID', {
                searching: true,
              }
            )
            .then(
              () => this.db.write(
                'SESSION_IDD', context)
            )
            .then(() =>
              expect(this.db.getAvailablePairs('SESSION_ID'))
              .to.become([{
                id: 'SESSION_IDD',
              }])
            );
        });
    });
  });
});
