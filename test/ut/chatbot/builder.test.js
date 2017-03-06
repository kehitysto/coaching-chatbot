import sinon from 'sinon';

import Builder from '../../../src/chatbot/builder.js';

describe('Chatbot builder', function() {
    beforeEach(function() {
      this.builder = new Builder({});
      this.session = {
        getInput: sinon.stub(),
      };
    });

    describe('#run', function() {
      it('should return a Promise', function() {
        const ret = this.builder.run({}, {});

        expect(ret).to.be.a('Promise');
      });
    });

    describe('#runAction', function() {
      it('should return a Promise', function() {
        const ret = this.builder.runAction({}, {}, {});

        expect(ret).to.be.a('Promise');
      });

      it('should return an Error when there is no such actionId', function() {
        const ret = this.builder.runAction('UNDEFINED_ACTION', {}, {});

        return expect(ret).to
        .be.rejectedWith('No such action: UNDEFINED_ACTION');
      });
    });

    describe('#checkIntent', function() {
      it('should return false if intent is undefined', function() {
        const ret = this.builder.checkIntent('UNDEFINED_INTENT', this.session);

        expect(ret).to.be.false;
      });
    });
});
