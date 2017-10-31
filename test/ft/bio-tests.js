import commonFeatures from './common';
const { buildResponse, setupChatbot } = commonFeatures;

const SESSION = 'BIO_TESTER';

describe('Bio tests', function() {
  describe(
    'As a registered user I want to provide my bio to the bot',
    function() {
      before(function() {
        setupChatbot(this, 'BIO_TESTS');
      });

      it(
        'after user has given his bio, it should ask for communication methods',
        function() {
          return expect(
              this.bot.receive(SESSION, 'My long bio in long text'))
            .to.eventually.become([
              buildResponse('@CONFIRM_BIO'),
              buildResponse('@REQUEST_COMMUNICATION_METHOD', [{
                'payload': 'SKYPE',
                'title': 'Skype',
              }, {
                'payload': 'PHONE',
                'title': 'Puhelin',
              }]),
            ]);
        });
    }
  );
});
