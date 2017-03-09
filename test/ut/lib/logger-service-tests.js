import sinon from 'sinon';

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

  describe('#log()', function() {
    it('should indicate "ERROR" log level', function() {
      Logger.setLevel(LEVELS.ERROR);
      Logger.log(this.message);
      assert(this.spy.calledWith('ERROR::juuh'));
    });

    it('should indicate "WARNING" log level', function() {
      Logger.setLevel(LEVELS.WARNING);
      Logger.log(this.message);
      assert(this.spy.calledWith('WARNING::juuh'));
    });

    it('should indicate "INFO" log level', function() {
      Logger.setLevel(LEVELS.INFO);
      Logger.log(this.message);
      assert(this.spy.calledWith('INFO::juuh'));
    });

    it('should indicate "DEBUG" log level', function() {
      Logger.setLevel(LEVELS.DEBUG);
      Logger.log(this.message);
      assert(this.spy.calledWith('DEBUG::juuh'));
    });

    it('should indicate "SILLY" log level', function() {
      Logger.setLevel(LEVELS.SILLY);
      Logger.log(this.message);
      assert(this.spy.calledWith('SILLY::juuh'));
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

  describe('#_logMessage()', function() {
    it('should have "SILLY" log level with too high log level',
      function() {
        Logger.setLevel(15);
        assert(Logger.getLevel() == LEVELS.SILLY);
      });
  });

  describe('#_logMessage()', function() {
    it('should have "ERROR" log level with too high log level',
      function() {
        Logger.setLevel(-1);
        assert(Logger.getLevel() == LEVELS.ERROR);
      });
  });
});
