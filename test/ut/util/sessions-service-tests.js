import * as sinon from 'sinon';

import * as AWS from 'aws-sdk';
import * as strings from '../../../src/coaching-chatbot/strings.json';
import * as Sessions from '../../../src/util/sessions-service';
import * as DynamoDBProvider from '../../../src/util/sessions-dynamodb-provider';
import * as InMemoryProvider from '../../../src/util/sessions-inmemory-provider';

describe('Sessions service', function() {
  before(function() {
    this.db = sinon.stub(AWS.DynamoDB, 'DocumentClient');
    this.sessions = new Sessions();

    // force reinitialization of provider
    this.sessions.db = new DynamoDBProvider();
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
                key: 'value',
              },
            },
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
                  id: 'SESSION_ID',
                },
                TableName: sinon.match.string,
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
          key: 'value',
        });
    });
  });

  describe('#write()', function() {
    before(function() {
      this.db.prototype.put = sinon.stub()
        .callsArg(1);
    });

    it('should return a Promise', function() {
      const ret = this.sessions.write(
        'SESSION_ID', {
          key: 'value',
        });

      expect(ret)
        .to.be.a('Promise');

      return expect(ret)
        .to.eventually.be.fulfilled;
    });

    it('should return an error if id is null', function() {
      const ret = this.sessions.write(null, {
        key: 'value',
      });

      return expect(ret)
        .to.be.rejectedWith('No session ID');
    });

    it('should post the session context to DynamoDB', function() {
      return expect(
          this.sessions.write('SESSION_ID', {
            key: 'value',
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
                    key: 'value',
                  },
                },
              }),
              sinon.match.func
            );
        });
    });

    it('should resolve with context from DynamoDB', function() {
      return expect(
          this.sessions.write('SESSION_ID', {
            key: 'value',
          })
        )
        .to.become({
          key: 'value',
        });
    });
  });

  describe('#getAvailablePairs()', function () {
    it('should scan DynamoDB for available pairs', function () {
      const scanStub = sinon.stub();
      scanStub.callsArgWith(
        1,
        undefined,
        [{ id: 'TEST1' }, { id: 'TEST2' }]
      );

      this.sessions.db.table.db.scan = scanStub;

      return this.sessions.getAvailablePairs('SESSION_ID').then(() => {
        expect(scanStub).to.have.been.calledOnce;
      });
    });
  });

  describe('#getAvailablePairs()', function () {
    it('should return filtered pairs', function () {
      const phoneContext = { context: { communicationMethods: {
            PHONE: '03030', }}};

      const skypeContext = { context: { communicationMethods: {
            SKYPE: 'skype', }}};

      const scanStub = sinon.stub(
        this.sessions.db.table, 'scan'
      ).returns(Promise.resolve([
        { id: 'PHONE1', ...phoneContext },
        { id: 'SKYPE1', ...skypeContext },
        { id: 'PHONE2', ...phoneContext },
        { id: 'SKYPE2', ...skypeContext }]
      ));

      const readStub = sinon.stub(
        this.sessions.db, 'read'
      ).returns(Promise.resolve({ ...skypeContext.context }));

      return this.sessions.getAvailablePairs('SESSION_ID').then((items) => {
        expect(items).to.deep.equal([
          { id: 'SKYPE1', ...skypeContext },
          { id: 'SKYPE2', ...skypeContext }])
      });
    });
  });

  describe('#readAll', function() {
    it('should return all users', function() {
      const context1 = {
        name: 'Kaapo'
      };
      const context2 = {
        name: 'Katriina'
      }
      const sessions = new Sessions();
      sessions.db = new InMemoryProvider();
      return sessions.write('id1', context1).then(function() {
        return sessions.write('id2', context2).then(function() {
          return expect(sessions.readAll()).to.deep.equal({
            'id1': context1,
            'id2': context2,
          });
        });
      });
    });
  });

  describe('#readAllWithReminders', function() {
    it('should return users with reminders', function() {
      let d = new Date();
      let utc = d.getTime() + (d.getTimezoneOffset() * 60 * 1000);
      // UTC + 2 -> Suomen aika
      let currentDate = new Date(utc + (2 * 60 * 60 * 1000));
      let currentMinutes = ('0' + currentDate.getMinutes()).substr(-2, 2);
      const context1 = {
        name: 'Kaapo',
        remindersEnabled: true,
        weekDay: strings['@WEEKDAYS'][new Date().getDay() % 7].substr(0, 2),
        time: currentDate.getHours() + ':' + currentMinutes
      };
      const context2 = {
        name: 'Katriina'
      }
      const sessions = new Sessions();
      sessions.db = new InMemoryProvider();
      return sessions.write('id1', context1).then(function() {
        return sessions.write('id2', context2).then(function() {
          return expect(sessions.readAllWithReminders()).to.eventually.become([{
            'id': 'id1',
            'context': context1,
          }]);
        });
      });
    });
  });

  describe('#readAllWithFeedbacks', function() {
    it('should return users with reminders', function() {
      let d = new Date();
      let utc = d.getTime() + (d.getTimezoneOffset() * 60 * 1000);
      // UTC + 2 -> Suomen aika
      let currentDate = new Date(utc + (2 * 60 * 60 * 1000));
      let currentMinutes = ('0' + currentDate.getMinutes()).substr(-2, 2);
      const context1 = {
        name: 'Katriina',
        remindersEnabled: true,
        weekDay: strings['@WEEKDAYS'][(new Date().getDay() + 6) % 7].substr(0, 2),
        time: ((currentDate.getHours() - 1) % 24)  + ':' + currentMinutes
      };
      const context2 = {
        name: 'Kaapo',
        remindersEnabled: true,
        weekDay: strings['@WEEKDAYS'][(new Date().getDay()) % 7].substr(0, 2),
        time: ((currentDate.getHours() - 1) % 24) + ':' + currentMinutes
      }
      const sessions = new Sessions();
      sessions.db = new InMemoryProvider();
      return sessions.write('id1', context1).then(function() {
        return sessions.write('id2', context2).then(function() {
          return expect(sessions.readAllWithFeedbacks()).to.eventually.become([{
            'id': 'id1',
            'context': context1,
          }]);
        });
      });
    });
  });
});
