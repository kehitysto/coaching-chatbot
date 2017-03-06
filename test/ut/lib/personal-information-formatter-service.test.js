import sinon from 'sinon';

import Formatter from '../../../src/lib/personal-information-formatter-service';
import Strings from '../../../src/coaching-chatbot/strings.json';

var assert = require('assert');

describe('Formatter service', function() {
  before(function() {});

  after(function() {});

  describe('#formatFromTemplate()', function() {
    it('should format a pre-defined template correctly', function() {
      const templateName = '@confirm_age';

      const context = {
        age: 45,
      };

      const expected = Strings['@confirm_age'].replace('{age}',
        context.age);
      const formatted = Formatter.formatFromTemplate(templateName,
        context);
      assert(formatted === expected);
    });
  });

  describe('#format()', function() {
    it('should format {name} correctly', function() {
      const template = '{name}';

      const context = {
        name: 'Pertti',
      };

      const expected = 'Pertti';
      const formatted = Formatter.format(template, context);
      assert(formatted === expected);
    });

    it('should format {job} correctly', function() {
      const template = '{job}';

      const context = {
        job: 'Cook',
      };

      const expected = 'Cook';
      const formatted = Formatter.format(template, context);
      assert(formatted === expected);
    });

    it('should format {age} correctly', function() {
      const template = '{age}';

      const context = {
        age: 45,
      };

      const expected = '45';
      const formatted = Formatter.format(template, context);
      assert(formatted === expected);
    });

    it('should format {place} correctly', function() {
      const template = '{place}';

      const context = {
        place: 'Texas',
      };

      const expected = 'Texas';
      const formatted = Formatter.format(template, context);
      assert(formatted === expected);
    });

    it('should format {profile} correctly (name)', function() {
      const template = '{profile}';

      const context = {
        name: 'Pertti',
      };

      const expected = 'Pertti';
      const formatted = Formatter.format(template, context);
      assert(formatted === expected);
    });

    it('should format {profile} correctly (name, job)', function() {
      const template = '{profile}';

      const context = {
        name: 'Pertti',
        job: 'Cook',
      };

      const expected = 'Pertti, Cook';
      const formatted = Formatter.format(template, context);
      assert(formatted === expected);
    });

    it('should format {profile} correctly (name, job, age)', function() {
      const template = '{profile}';

      const context = {
        name: 'Pertti',
        job: 'Cook',
        age: 45,
      };

      const expected = 'Pertti, Cook, 45';
      const formatted = Formatter.format(template, context);
      assert(formatted === expected);
    });

    it('should format {profile} correctly (name, job, age, place)',
      function() {
        const template = '{profile}';

        const context = {
          name: 'Pertti',
          job: 'Cook',
          age: 45,
          place: 'Texas',
        };

        const expected = 'Pertti, Cook, 45, Texas';
        const formatted = Formatter.format(template, context);
        assert(formatted === expected);
      });

    it('should format {profile} correctly (name, job, place)', function() {
      const template = '{profile}';

      const context = {
        name: 'Pertti',
        job: 'Cook',
        place: 'Texas',
      };

      const expected = 'Pertti, Cook, Texas';
      const formatted = Formatter.format(template, context);
      assert(formatted === expected);
    });
  });

  it('should understand template arrays', function() {
    const template = ['test', 'test'];
    const context = {};

    const formatted = Formatter.format(template, context);

    assert(formatted === 'test');
  });
});
