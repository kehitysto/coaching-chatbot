import sinon from 'sinon';

import Session from '../../../src/chatbot/session.js';

describe('chatbot sessions', function() {
  beforeEach(function() {
    this.dialog = sinon.stub();
    this.session = new Session(this.dialog);
  });
  describe('#_start', function() {
    it('start returns the session object', function() {
      const ret = this.session._start(
        {},
        ''
      );
      return expect(ret).to.equal(this.session);
    });
    it('should assign context to session ', function(){
      this.session._start(
        { foo: 'bar' },
        ''
      );

    return expect(this.session.context)
        .to.deep.equal({
          foo: 'bar'
        });
    });
    it('should assign input to session', function(){
      this.session._start(
        { foo: 'bar' },
        'something'
      );

      return expect(this.session._input)
        .to.deep.equal(
          'something'
        );
    });
  });

  describe('#switchDialog', function() {
    it('should switch to the given dialog', function() {
      this.session.switchDialog('/test');
      expect(this.session._state[this.session._state.length-1])
          .to.deep.equal(['test', 0]);
    });
  });
});
