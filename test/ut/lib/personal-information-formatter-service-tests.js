import sinon from 'sinon';

import Formatter from '../../../src/lib/personal-information-formatter-service';
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
      const formatted = Formatter.formatFromTemplate(templateName,
        context);
      assert(formatted === expected);
    });

    it('should understand template arrays', function() {
      const template = '@UNCLEAR';
      const context = {};

      const formatted = Formatter.formatFromTemplate(template,
        context);

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

    it('should get all communication methods', function() {

      const communicationMethods = Formatter.getCommunicationMethods(
        context);

      const expected = [{
          title: 'Skype',
          payload: 'SKYPE',
        },
        {
          title: 'Puhelin',
          payload: 'PHONE',
        },
        {
          title: 'Kahvila',
          payload: 'CAFETERIA',
        },
      ];

      return expect(communicationMethods)
        .to.deep
        .equal(expected);
    });

    it(
      'should find right string to ask for right communication Method(Skype)',
      function() {
        const input = 'Skype';

        const expected = {
          identifier: 'SKYPE',
          name: 'Skype',
          infoRequestText: '@REQUEST_SKYPE_NAME',
        };

        return expect(Formatter.getCommunicationMethodByInput(input))
          .to.deep
          .equal(expected);
      });

      it(
        'should find right string to ask for right communication Method(Skype)',
        function() {
          const input = 'SKYPE';

          const expected = {
            identifier: 'SKYPE',
            name: 'Skype',
            infoRequestText: '@REQUEST_SKYPE_NAME',
          };

          return expect(Formatter.getCommunicationMethodsByIdentifier(input))
            .to.deep
            .equal(expected);
        });


    it(
      'should not include skype in communication methods if it has been selected already',
      function() {
        const context = {
          communicationMethods: {
              SKYPE : '',
          },
        };

        const communicationMethods = Formatter.getCommunicationMethods(
          context);

        const expected = [{
            title: 'Puhelin',
            payload: 'PHONE',
          },
          {
            title: 'Kahvila',
            payload: 'CAFETERIA',
          },
        ];

        return expect(communicationMethods)
          .to.deep
          .equal(expected);
      });

    it(
      'should find right string to ask for right communication Method(Phonenumber)',
      function() {
        const input = 'Kahvila';
        const expected = {
          identifier: 'CAFETERIA',
          name: 'Kahvila',
          infoRequestText: '@REQUEST_PHONE_NUMBER',
        };

        return expect(Formatter.getCommunicationMethodByInput(input))
          .to.deep
          .equal(expected);
      });

    it('should only include cafeteria in communication methods if the others have been selected',
      function() {
          const context = {
              communicationMethods: {
                  SKYPE: '',
                  PHONE: '',
              },
          };

        const communicationMethods = Formatter.getCommunicationMethods(
          context);

        const expected = [{
          title: 'Kahvila',
          payload: 'CAFETERIA',
        }];

        return expect(communicationMethods)
          .to.deep
          .equal(expected);
      });

    it(
      'should find right string to ask for right communication Method(CAFETERIA)',
      function() {
        const input = 'Puhelin';
        const expected = {
          identifier: 'PHONE',
          name: 'Puhelin',
          infoRequestText: '@REQUEST_PHONE_NUMBER',
        };

        return expect(Formatter.getCommunicationMethodByInput(input))
          .to.deep
          .equal(expected);
      });
      it(
        'should retrun a array of added communication methods',
        function() {
          const context = {
            communicationMethods: {
                SKYPE : 'nickname',
            },
          };
          return expect(Formatter.createCommunicationMethodslist(context))
           .to.deep
           .equal('Skype (nickname)');
        }
      );
      it(
        'should return an identifier(EVERY_WEEKDAY) for the frequeny meeting method',
        function() {
          const input = 'arkipäivisin';

          const meetingFrequency = Formatter.getMeetingFrequencyIdentifierByInput(
            input);

          const expected = 'EVERY_WEEKDAY';

          return expect(meetingFrequency)
            .to.deep
            .equal(expected);
        });
        it(
          'should return an identifier(ONCE_A_WEEK) for the frequeny meeting method',
          function() {
            const input = 'kerran viikossa';

            const meetingFrequency = Formatter.getMeetingFrequencyIdentifierByInput(
              input);

            const expected = 'ONCE_A_WEEK';

            return expect(meetingFrequency)
              .to.deep
              .equal(expected);
          });
          it(
            'should return an identifier(ONCE_EVERY_TWO_WEEKS) for the frequeny meeting method',
            function() {
              const input = 'kerran kahdessa viikossa';

              const meetingFrequency = Formatter.getMeetingFrequencyIdentifierByInput(
                input);

              const expected = 'ONCE_EVERY_TWO_WEEKS';

              return expect(meetingFrequency)
                .to.deep
                .equal(expected);
            });
      it(
        'should return an array of all possible meeting-frequencies',
        function() {
          const context = {};

          const meetingFrequency = Formatter.getMeetingFrequency(
            context);

          const expected = [{
              title: 'Arkipäivisin',
              payload: 'EVERY_WEEKDAY',
            },
            {
              title: 'Kerran viikossa',
              payload: 'ONCE_A_WEEK',
            },
            {
              title: 'Kerran kahdessa viikossa',
              payload: 'ONCE_EVERY_TWO_WEEKS',
            },
          ];

          return expect(meetingFrequency)
            .to.deep
            .equal(expected);
        });
      });
});
