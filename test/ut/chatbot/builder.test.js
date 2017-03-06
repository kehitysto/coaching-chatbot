import sinon from 'sinon';

import Builder from '../../../src/chatbot/builder.js';

describe('Chatbot builder', function() {
  beforeEach(function() {
    this.builder = new Builder({});
    this.builder.dialog('', [() => undefined]);
    this.session = {
      getInput: sinon.stub(),
    };
  });

  describe('#run', function() {
    it('should return a Promise', function() {
      const ret = this.builder.run({}, {});

      expect(ret)
        .to.be.a('Promise');
    });

    it('should reset state if dialog does not exist', function() {
      const ret = this.builder.run({'state': '/foobar?666'}, "moi");
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

    it('should return an Error when there is no such actionId',
      function() {
        const action = 'UNDEFINED_ACTION';
        const ret = this.builder.runAction(action, {}, {});

        return expect(ret)
          .to
          .be.rejectedWith('No such action: ' + action);
      });
  });

  describe('#checkIntent', function() {
    it('should return false if intent is undefined', function() {
      const ret = this.builder.checkIntent('UNDEFINED_INTENT', this
        .session);

      return expect(ret)
        .to.be.false;
    });
  });
});
