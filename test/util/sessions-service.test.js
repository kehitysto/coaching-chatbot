import sinon from 'sinon';

import AWS from 'aws-sdk';
import Sessions from '../../src/util/sessions-service';

describe('Sessions service', function() {
  before(function() {
    this.db = sinon.stub(AWS.DynamoDB, 'DocumentClient');
    this.sessions = new Sessions();
  });

  after(function() {
    this.db.restore();
  });

  describe('#read()', function() {
    before(function() {
      this.db.prototype.get = sinon.stub()
        .callsArgWith(
          1,
          null, {
            Item: {
              id: 'SESSION_ID',
              context: {
                key: 'value'
              }
            }
          }
        );
    });

    it('should return a Promise', function() {
      const ret = this.sessions.read('SESSION_ID');

      expect(ret)
        .to.be.a('Promise');

      return ret;
    });

    it('should request the session context from DynamoDB', function() {
      return expect(
          this.sessions.read('SESSION_ID')
        )
        .to.eventually.be.fulfilled.then(() => {
          return expect(this.db.prototype.get)
            .to.have.been.calledWith(
              sinon.match({
                Key: {
                  id: 'SESSION_ID'
                },
                TableName: sinon.match.string
              }),
              sinon.match.func
            );
        });
    });

    it('should resolve with context from DynamoDB', function() {
      return expect(
          this.sessions.read('SESSION_ID')
        )
        .to.become({
          key: 'value'
        });
    });
  });

  describe('#write()', function() {
    before(function() {
      this.db.prototype.put = sinon.stub()
        .callsArg(1);
    });

    it('should return a Promise', function() {
      const ret = this.sessions.write('SESSION_ID', {
        key: 'value'
      });

      expect(ret)
        .to.be.a('Promise');

      return expect(ret)
        .to.eventually.be.fulfilled;
    });

    it('should post the session context to DynamoDB', function() {
      return expect(
          this.sessions.write('SESSION_ID', {
            key: 'value'
          })
        )
        .to.eventually.be.fulfilled.then(() => {
          return expect(this.db.prototype.put)
            .to.have.been.calledWith(
              sinon.match({
                TableName: sinon.match.string,
                Item: {
                  id: 'SESSION_ID',
                  context: {
                    key: 'value'
                  }
                },
              }),
              sinon.match.func
            );
        });
    });

    it('should resolve with context from DynamoDB', function() {
      return expect(
          this.sessions.write('SESSION_ID', {
            key: 'value'
          })
        )
        .to.become({
          key: 'value'
        });
    });
  });
});
