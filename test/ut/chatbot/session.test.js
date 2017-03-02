import sinon from 'sinon';

import Session from '../../../src/chatbot/session.js';

describe('chatbot sessions', function() {
  beforeEach(function() {
    this.dialog = sinon.stub();
    this.session = new Session(this.dialog);
  });
  describe('#beginDialog', function() {
    this.session.beginDialog(ths.dialog);

    expect(this.session._state).to.equal(this.dialog)
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

});
