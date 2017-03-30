import PersonalInformationFormatter
 from '../../../src/lib/personal-information-formatter-service';
import Strings from '../../../src/coaching-chatbot/strings.json';

var assert = require('assert');

describe('Formatter service', function() {
  before(function() {});

  after(function() {});

  describe('#formatFromTemplate()', function() {
    it('should format a pre-defined template correctly', function() {
      const templateName = '@CONFIRM_AGE';
      const context = {
        age: 45,
      };
      const expected = Strings['@CONFIRM_AGE'].replace('{age}',
        context.age);
      const formatted = PersonalInformationFormatter
        .formatFromTemplate(templateName, context);
      assert(formatted === expected);
    });

    it('should understand template arrays', function() {
      const template = '@UNCLEAR';
      const context = {};

      const formatted = PersonalInformationFormatter
        .formatFromTemplate(template, context);

      expect(Strings[template])
        .to.include(formatted);
    });
  });

  describe('#format()', function() {
    it('should format {name} correctly', function() {
      const template = '{name}';

      const context = {
        name: 'Pertti',
      };

      const expected = 'Pertti';
      const formatted = PersonalInformationFormatter.format(template, context);
      assert(formatted === expected);
    });

    it('should format {job} correctly', function() {
      const template = '{job}';

      const context = {
        job: 'Cook',
      };

      const expected = 'Cook';
      const formatted = PersonalInformationFormatter.format(template, context);
      assert(formatted === expected);
    });

    it('should format {age} correctly', function() {
      const template = '{age}';

      const context = {
        age: 45,
      };

      const expected = '45';
      const formatted = PersonalInformationFormatter.format(template, context);
      assert(formatted === expected);
    });

    it('should format {place} correctly', function() {
      const template = '{place}';

      const context = {
        place: 'Texas',
      };

      const expected = 'Texas';
      const formatted = PersonalInformationFormatter.format(template, context);
      assert(formatted === expected);
    });

    it('should format {profile} correctly (name)', function() {
      const template = '{profile}';

      const context = {
        name: 'Pertti',
      };

      const expected = 'Pertti';
      const formatted = PersonalInformationFormatter.format(template, context);
      assert(formatted === expected);
    });

    it('should format {profile} correctly (name, job)', function() {
      const template = '{profile}';

      const context = {
        name: 'Pertti',
        job: 'Cook',
      };

      const expected = 'Pertti, Cook';
      const formatted = PersonalInformationFormatter.format(template, context);
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
      const formatted = PersonalInformationFormatter.format(template, context);
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
        const formatted = PersonalInformationFormatter
          .format(template, context);
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
      const formatted = PersonalInformationFormatter
        .format(template, context);
      assert(formatted === expected);
    });
  });

  describe('#getMeetingFrequencyIdentifierByInput()', function() {
      it(
        'should return an identifier(EVERY_WEEKDAY) for the frequeny meeting method',
        function() {
          const input = 'arkipäivisin';
          const meetingFrequency = PersonalInformationFormatter
            .getMeetingFrequencyIdentifierByInput(input);
          const expected = 'EVERY_WEEKDAY';
          return expect(meetingFrequency)
            .to.deep
            .equal(expected);
        });

        it(
          'should return an identifier(ONCE_A_WEEK) for the frequeny meeting method',
          function() {
            const input = 'kerran viikossa';
            const meetingFrequency = PersonalInformationFormatter
              .getMeetingFrequencyIdentifierByInput(input);
            const expected = 'ONCE_A_WEEK';
            return expect(meetingFrequency)
              .to.deep
              .equal(expected);
          });

          it(
            'should return an identifier(ONCE_EVERY_TWO_WEEKS) for the frequeny meeting method',
            function() {
              const input = 'Joka toinen viikko';
              const meetingFrequency = PersonalInformationFormatter
                .getMeetingFrequencyIdentifierByInput(input);
              const expected = 'ONCE_EVERY_TWO_WEEKS';
              return expect(meetingFrequency)
                .to.deep
                .equal(expected);
            });
      });

      describe('#getMeetingFrequency', function() {
      it(
        'should return an array of all possible meeting-frequencies',
        function() {
          const context = {};
          const meetingFrequency = PersonalInformationFormatter
            .getMeetingFrequency(context);
          const expected = [{
              title: 'Arkipäivisin',
              payload: 'EVERY_WEEKDAY',
            },
            {
              title: 'Kerran viikossa',
              payload: 'ONCE_A_WEEK',
            },
            {
              title: 'Joka toinen viikko',
              payload: 'ONCE_EVERY_TWO_WEEKS',
            },
          ];
          return expect(meetingFrequency)
            .to.deep
            .equal(expected);
        });
      });
});
