import CommunicationMethodsFormatter
from '../../../src/lib/communication-methods-formatter';

describe('Communication methods formatter', function() {
  before(function() {});

  after(function() {});

  describe('#getCommunicationMethods()', function() {
    it(
      'should not include skype in communication methods if it has been selected already',
      function() {
        const context = {
          communicationMethods: {
            SKYPE: '',
          },
        };

        const communicationMethods = CommunicationMethodsFormatter
          .getCommunicationMethods(context);

        const expected = [{
            title: 'Puhelin',
            payload: 'PHONE',
          },
        ];

        return expect(communicationMethods)
          .to.deep
          .equal(expected);
      });

    it('should get all communication methods', function() {
      const communicationMethods = CommunicationMethodsFormatter
        .getCommunicationMethods(context);

      const expected = [{
          title: 'Skype',
          payload: 'SKYPE',
        },
        {
          title: 'Puhelin',
          payload: 'PHONE',
        },
      ];

      return expect(communicationMethods)
        .to.deep
        .equal(expected);
    });
  });

  describe('#getCommunicationMethodByIdentifier()', function() {
    it(
      'should find right string to ask for right communication Method(Skype)',
      function() {
        const input = 'SKYPE';

        const expected = {
          identifier: 'SKYPE',
          name: 'Skype',
          infoRequestText: '@REQUEST_SKYPE_NAME',
        };

        return expect(CommunicationMethodsFormatter
            .getCommunicationMethodByIdentifier(input))
          .to.deep
          .equal(expected);
      });
  });

  describe('#getCommunicationMethodByInput()', function() {
    it(
      'should find right string to ask for right communication Method(Skype)',
      function() {
        const input = 'Skype';

        const expected = {
          identifier: 'SKYPE',
          name: 'Skype',
          infoRequestText: '@REQUEST_SKYPE_NAME',
        };

        return expect(CommunicationMethodsFormatter
            .getCommunicationMethodByInput(input))
          .to.deep
          .equal(expected);
      });

    it(
      'should find right string to ask for right communication Method(Phonenumber)',
      function() {
        const input = 'Puhelin';
        const expected = {
          identifier: 'PHONE',
          name: 'Puhelin',
          infoRequestText: '@REQUEST_PHONE_NUMBER',
        };

        return expect(CommunicationMethodsFormatter
            .getCommunicationMethodByInput(input))
          .to.deep
          .equal(expected);
      });
  });

  describe('#createCommunicationMethodslist()', function() {
    it(
      'should return an array of added communication methods',
      function() {
        const context = {
          communicationMethods: {
            SKYPE: 'nickname',
          },
        };

        return expect(CommunicationMethodsFormatter
            .createCommunicationMethodslist(context))
          .to.deep
          .equal([' Skype (nickname)']);
      });
  });
});
