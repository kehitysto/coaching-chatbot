import * as sinon from 'sinon';

var assert = require('assert');
import Logger from '../../../src/lib/logger-service';
import {
  LEVELS
} from '../../../src/lib/logger-service';

describe('Logging service', function() {
  before(function() {
    this.spy = sinon.spy(console, 'log');
    this.message = 'juuh';
  });

  after(function() {
    this.spy.restore();
  });

  beforeEach(function() {
    this.spy.reset();
    Logger.setLevel(LEVELS.SILLY);
  });

  describe('#log()', function() {
    it('should indicate "ERROR" log level', function() {
      Logger.log(LEVELS.ERROR, this.message);
      assert(this.spy.calledWith('ERROR::juuh'));
    });

    it('should indicate "WARNING" log level', function() {
      Logger.log(LEVELS.WARNING, this.message);
      assert(this.spy.calledWith('WARNING::juuh'));
    });

    it('should indicate "INFO" log level', function() {
      Logger.log(LEVELS.INFO, this.message);
      assert(this.spy.calledWith('INFO::juuh'));
    });

    it('should indicate "DEBUG" log level', function() {
      Logger.log(LEVELS.DEBUG, this.message);
      assert(this.spy.calledWith('DEBUG::juuh'));
    });

    it('should indicate "SILLY" log level', function() {
      Logger.log(LEVELS.SILLY, this.message);
      assert(this.spy.calledWith('SILLY::juuh'));
    });

    it('should not log messages with priority above log level', function() {
      Logger.setLevel(LEVELS.DEBUG);
      Logger.log(LEVELS.SILLY, this.message);
      assert(this.spy.notCalled);

      Logger.setLevel(LEVELS.DEBUG);
      Logger.log(LEVELS.DEBUG, this.message);
      assert(this.spy.calledOnce);
    });
  });

  describe('#error()', function() {
    it('should indicate "ERROR" log level', function() {
      Logger.error(this.message);
      assert(this.spy.calledWith('ERROR::juuh'));
    });
  });

  describe('#warning()', function() {
    it('should indicate "WARNING" log level', function() {
      Logger.warning(this.message);
      assert(this.spy.calledWith('WARNING::juuh'));
    });
  });

  describe('#info()', function() {
    it('should indicate "DEBUG" log level', function() {
      Logger.info(this.message);
      assert(this.spy.calledWith('INFO::juuh'));
    });
  });

  describe('#debug()', function() {
    it('should indicate "DEBUG" log level', function() {
      Logger.debug(this.message);
      assert(this.spy.calledWith('DEBUG::juuh'));
    });
  });

  describe('#silly()', function() {
    it('should indicate "SILLY" log level', function() {
      Logger.silly(this.message);
      assert(this.spy.calledWith('SILLY::juuh'));
    });
  });

  describe('#setLevel()', function() {
    it('should have "SILLY" log level with too high log level', function() {
      Logger.setLevel(15);
      assert(Logger.getLevel() == LEVELS.SILLY);
    });

    it('should have "ERROR" log level with too low log level', function() {
      Logger.setLevel(-1);
      assert(Logger.getLevel() == LEVELS.ERROR);
    });
  });
});
