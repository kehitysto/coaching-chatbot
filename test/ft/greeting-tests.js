import commonFeatures from './common';
const { buildResponse, setupChatbot } = commonFeatures;

const SESSION = 'DEFAULT';

describe('User story', function() {
  describe(
    'As a non-registered user I want to start a conversation with the bot so I can start the process of finding a peer',
    function() {
      before(function() {
        setupChatbot(this);
      });

      it('When the user sends a greeting MB should respond to the user',
        function() {
          return expect(this.bot.receive(SESSION, 'moi'))
            .to.eventually.become([
              buildResponse('@GREETING_1'),
              buildResponse('@GREETING_2'),
              buildResponse('@GREETING_3', [{
                'title': 'Kyllä',
                'payload': '@YES',
              }, {
                'title': 'Ei',
                'payload': '@NO',
              }]),
            ]);
        });
    });
});
