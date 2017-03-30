import sinon from 'sinon';

import Session from '../../../src/chatbot/session.js';

describe('chatbot sessions', function() {
  beforeEach(function() {
    this.dialog = {
      checkIntent: sinon.stub(),
      getSubStateCount: sinon.stub(),
    };
    this.session = new Session(this.dialog);

    this.session._start('SESSION', {}, '');
    this.dialog.getSubStateCount.returns(1);
  });

  describe('#beginDialog', function() {
    it('should push the given dialog to top of the dialog stack', function() {
      this.session.beginDialog('test');
      return expect(this.session._state)
          .to.deep.equal([['', 0], ['test', 0]]);
    });
    it('should increment the substate of the current dialog', function() {
      this.dialog.getSubStateCount.returns(2);

      this.session.beginDialog('test');
      return expect(this.session._state)
          .to.deep.equal([['', 1], ['test', 0]]);
    });
    it('should throw an Error if the dialog is already in the dialog stack', function() {
      this.session.beginDialog('foo');
      this.session.beginDialog('bar');
      return expect(this.session.beginDialog, 'foo')
          .to.throw(Error);
    });
  });

  describe('#endDialog', function() {
    it('should return to the previous dialog', function() {
      this.session.beginDialog('foo');
      this.session.beginDialog('bar');

      this.session.endDialog();
      return expect(this.session._state)
          .to.deep.equal([['', 0], ['foo', 0]]);
    });
  });

  describe('#switchDialog', function() {
    it('should switch to the given dialog', function() {
      this.session.switchDialog('/test');
      expect(this.session._state[this.session._state.length-1])
          .to.deep.equal(['test', 0]);
    });
  });

  describe('#checkIntent', function() {
    it('should call Builder.checkIntent', function() {
      this.dialog.checkIntent.returns('OK');

      const ret = this.session.checkIntent('test_intent');
      expect(this.dialog.checkIntent)
          .to.have.been.calledWith('test_intent', this.session);
      return expect(ret).to.equal('OK');
    });
  });

  describe('#_start', function() {
    it('start returns the session object', function() {
      const ret = this.session._start('SESSION', {}, '');
      return expect(ret).to.equal(this.session);
    });
    it('should assign context to session ', function(){
      this.session._start(
        'SESSION',
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
        'SESSION',
        { foo: 'bar' },
        'something'
      );

      return expect(this.session._input)
        .to.deep.equal(
          'something'
        );
    });
  });

  describe('#_finalize', function() {
    beforeEach(function() {
      this.session.context = {};
    });
    it('returns the session object', function() {
      const ret = this.session._finalize();
      return expect(ret).to.equal(this.session);
    });
    it('serializes the current state to context', function() {
      this.session._state = [['', 1], ['first', 3], ['second', 0]];

      const ret = this.session._finalize();
      return expect(this.session.context.state).to.deep.equal(
          '/?1/first?3/second?0');
    });
  });

  describe('#_getStateArray', function() {
    it('should produce a state array from state string', function() {
      this.session.context = { 'state': '/?1/first?3/second?0' };

      const ret = this.session._getStateArray();
      return expect(ret).to.deep.equal(
          [['', 1], ['first', 3], ['second', 0]]);
    });
    it('should return base state if no state is set', function() {
      this.session.context = {};

      const ret = this.session._getStateArray();
      return expect(ret).to.deep.equal([['', 0]]);
    });
  });

  describe('#_setStateArray', function() {
    it('should generate a state string from a state array', function() {
      const ret = this.session._setStateArray(
          [['', 1], ['first', 3], ['second', 0]]);
      return expect(ret).to.deep.equal('/?1/first?3/second?0');
    });
  });
});
