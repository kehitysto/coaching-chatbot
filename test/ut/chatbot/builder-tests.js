import sinon from 'sinon';

import Builder from '../../../src/chatbot/builder.js';

describe('Chatbot builder', function() {
  beforeEach(function() {
    this.builder = new Builder({});
    this.builder.dialog('', [() => undefined]);
    this.session = {
      getInput: sinon.stub(),
      getUserData: sinon.stub(),
    };
  });

  describe('#run', function() {
    it('should return a Promise', function() {
      const ret = this.builder.run({}, {});

      expect(ret)
        .to.be.a('Promise');
    });

    it('should reset state if dialog does not exist', function() {
      const ret = this.builder.run( { 'state': '/foobar?666' }, 'moi');
      return expect(ret).to.eventually
          .have.property('stateId', '');
    });
  });

  describe('#runAction', function() {
    it('should return a Promise', function() {
      const ret = this.builder.runAction({}, {}, {});

      expect(ret)
        .to.be.a('Promise');
    });

    it('should return an Error when there is no such actionId', function() {
      const action = 'UNDEFINED_ACTION';
      const ret = this.builder.runAction(action, {}, {});

      return expect(ret).to.be.rejectedWith('No such action: ' + action);
      });

    it('should return A Promise if actionId is found', function() {
      this.builder.action('setInterest', () => ({}, {}, {}));
      const action = 'setInterest';
      const ret = this.builder.runAction(action, this.session, {});

      return expect(ret).to.be.a('Promise');
    });
  });

  describe('#checkIntent', function() {
    it('should return false if intent is undefined', function() {
      const ret = this.builder.checkIntent('UNDEFINED_INTENT', this
        .session);

      return expect(ret).to.be.false;
    });
  });

  describe('#getSubStateCount', function() {
    it('should return a 0 if tree stateId is undefined', function() {
      const stateId = 'UNDEFINED_STATEID';
      const ret = this.builder.getSubStateCount(stateId);

      return expect(ret).to.equal(0);
    });
  });

  describe('#_runStep', function() {
    it('should return a Promise', function() {
      this.session.stateId = '';

      const ret = this.builder._runStep(0, this.session, 'message');

      expect(ret).to.be.a('Promise');
      return expect(ret.catch(() => null)).to.be.fulfilled;
    });

    it('should run all actions before resolving', function() {
      const actions = ['foo', 'bar', 'baz'];

      this.session.stateId = '';
      this.session.subStateId = '0';
      this.session.runQueue = Promise.resolve();
      this.session.next = () => null;
      this.builder.dialog(
        '',
        [(session) => {
          for (let action of actions) {
            session.runQueue = session.runQueue.then(
              () => this.builder.runAction(action, this.session, '')
            );
          }
        }]
      );

      const results = [];
      for (let action of actions) {
        this.builder.action(action, () => {
          return new Promise((resolve, reject) => {
            setTimeout(
                () => {
                  results.push(action);
                  resolve({});
                },
                    50);
          });
        });
      }

      const ret = this.builder._runStep(0, this.session, 'message');

      return expect(ret).to.be.fulfilled
          .then(() => expect(results).to.deep.equal(actions));
    });
  });
});
