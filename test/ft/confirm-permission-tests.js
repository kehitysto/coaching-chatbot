import commonFeatures from './common';
const { buildResponse, setupChatbot } = commonFeatures;

const SESSION = 'CONFIRM_PERMISSION_TESTER';

describe('Confirm permission tests', function() {
  describe(
    'As a registered I want to find a pair',
    function() {
      before(function() {
        setupChatbot(this, 'CONFIRM_PERMISSION_TESTS');
      });

      it(
        'should ask for my permission',
        function () {
          return expect(
            this.bot.receive(SESSION, 'Etsi pari'))
            .to.eventually.become(
            [
              buildResponse('@PERMISSION_TO_RECEIVE_MESSAGES', [{
                'title': 'Kyllä',
                'payload': '@YES',
              }, {
                'title': 'Ei',
                'payload': '@NO',
              }]),
            ]
            );
        }
      );
    }
  );
});