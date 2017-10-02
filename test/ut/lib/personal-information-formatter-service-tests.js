import PersonalInformationFormatter
from '../../../src/lib/personal-information-formatter-service';
import PairFormatter
from '../../../src/lib/pair-formatter';
import Strings from '../../../src/coaching-chatbot/strings.json';

var assert = require('assert');

describe('Formatter service', function() {
  before(function() {});

  after(function() {});

  describe('#formatFromTemplate()', function() {
    it('should format a pre-defined template correctly', function() {
      const templateName = '@CONFIRM_AGE';

      const context = {
        age: '45',
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
      const formatted = PersonalInformationFormatter.format(
        template, context);

      assert(formatted === expected);
    });

    it('should format {job} correctly', function() {
      const template = '{job}';

      const context = {
        job: 'Cook',
      };

      const expected = 'Cook';
      const formatted = PersonalInformationFormatter.format(
        template, context);

      assert(formatted === expected);
    });

    it('should format {age} correctly', function() {
      const template = '{age}';

      const context = {
        age: '45',
      };

      const expected = '45';
      const formatted = PersonalInformationFormatter.format(
        template, context);

      assert(formatted === expected);
    });

    it('should format {place} correctly', function() {
      const template = '{place}';

      const context = {
        place: 'Texas',
      };

      const expected = 'Texas';
      const formatted = PersonalInformationFormatter.format(
        template, context);

      assert(formatted === expected);
    });

    it('should format {profile} correctly (name)', function() {
      const template = '{profile}';

      const context = {
        name: 'Pertti',
      };

      const expected = 'Pertti';
      const formatted = PersonalInformationFormatter.format(
        template, context);

      assert(formatted === expected);
    });

    it('should format {profile} correctly (name, job)', function() {
      const template = '{profile}';

      const context = {
        name: 'Pertti',
        job: 'Cook',
      };

      const expected = 'Pertti, Cook';
      const formatted = PersonalInformationFormatter.format(
        template, context);

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
      const formatted = PersonalInformationFormatter.format(
        template, context);

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

  describe('#getPersonalInformationbuttons', function() {
    it(
      'should return an array containing all possible ways to change personal information',
      function() {
        const context = {};
        const personalInformationChangers =
          PersonalInformationFormatter
          .getPersonalInformationbuttons(context);

        const expected = [{
          title: 'Etsi pari',
          payload: 'LOOK_FOR_PEER',
          },
          {
            title: 'Aseta nimi',
            payload: 'CHANGE_NAME',
          },
          {
            title: 'Aseta ammatti',
            payload: 'CHANGE_JOB',
          },
          {
            title: 'Aseta ikä',
            payload: 'SET_AGE',
          },
          {
            title: 'Aseta paikkakunta',
            payload: 'SET_PLACE',
          },
          {
            title: 'Aseta kuvaus',
            payload: 'SET_BIO',
          }
        ];

        return expect(personalInformationChangers)
          .to.deep
          .equal(expected);
      });
  });

  describe('#beautifyAvailablePairs', function() {
    it(
      'should return a beautiful string constisting of available pairs',
      function() {
        const dumps = [{
            id: '12345',
            context: {
              searching: true,
              name: 'Pertti',
              communicationMethods: {
                SKYPE: 'pertti_52',
              },
              state: '/?0/profile?0/',
              job: 'muurari',
              age: '58',
              place: 'Kuopio',
            },
          },
          {
            id: '67890',
            context: {
              searching: true,
              name: 'Seppo',
              communicationMethods: {
                SKYPE: 'sala.seppo42',
                CAFETERIA: 'Salainen',
              },
              state: '/?0/profile?0',
              job: 'valastaja',
              age: '62',
              place: 'Oulu',
            },
          },
        ];

        const expected =
          'Pertti, muurari, 58, Kuopio\n  - Skype\n\nSeppo, valastaja, 62, Oulu\n  - Skype\n  - Kahvila';

        const beautifulPairs = PairFormatter.beautifyAvailablePairs(
          dumps);

        return expect(beautifulPairs)
          .to.deep
          .equal(expected);
      });
  });
});
