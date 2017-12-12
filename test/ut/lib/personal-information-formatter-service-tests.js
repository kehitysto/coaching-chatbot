import PersonalInformationFormatter
from '../../../src/lib/personal-information-formatter-service';
import PairFormatter
from '../../../src/lib/pair-formatter';
import * as Strings from '../../../src/coaching-chatbot/strings.json';

var assert = require('assert');

describe('Formatter service', function() {
  before(function() {});

  after(function() {});

  describe('#formatFromTemplate()', function() {
    it('should format a pre-defined template correctly', function() {
      const templateName = '@CONFIRM_NAME';

      const context = {
        name: 'kaapo',
      };

      const expected = Strings['@CONFIRM_NAME'].replace('{name}',
        context.name);

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

    it('should format {profile} correctly (name, bio)', function() {
      const template = '{profile}';

      const context = {
        name: 'Pertti',
        bio: 'Pesusieni',
      };

      const expected = 'Pertti, Pesusieni';
      const formatted = PersonalInformationFormatter.format(
        template, context);

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
            title: 'Selaa ohjaajia',
            payload: 'LOOK_FOR_PEER',
          },
          {
            title: 'Hallitse tietoja',
            payload: 'MANAGE_INFO',
          },
          {
          payload: "MANAGE_REQUESTS",
          title: "Katso pyynnöt"
          },
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
              bio: 'pellavainen',
            },
          },
          {
            id: '67890',
            context: {
              searching: true,
              name: 'Seppo',
              communicationMethods: {
                SKYPE: 'sala.seppo42',
              },
              state: '/?0/profile?0',
              bio: 'seppäläinen'
            },
          },
        ];

        const expected =
          'Pertti, pellavainen\n  - Skype\n\nSeppo, seppäläinen\n  - Skype';

        const beautifulPairs = PairFormatter.beautifyAvailablePairs(
          dumps);

        return expect(beautifulPairs)
          .to.deep
          .equal(expected);
      });
  });
});
