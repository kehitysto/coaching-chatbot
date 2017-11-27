import commonFeatures from './common';
const { buildResponse, setupChatbot, Strings } = commonFeatures;

const SESSION = 'INVALID_INPUT_TESTER';

describe('Invalid input tests', function() {
  describe(
    'As a user I want the bot to respond if my input is not understood so that I can reply with a valid input',
    function() {
      before(function() {
        setupChatbot(this, 'INVALID_INPUT_TESTS');
      });

      it(
        'should tell that the input is not understood if the input is bad',
        function() {
          const promise = this.bot.receive(SESSION, 'invalid input');
          return promise.then((ret) => {
            expect(Strings['@UNCLEAR'])
              .to.include(ret[0].message);
            expect(ret[1])
              .to.deep.equal(
                buildResponse('@GREETING_1'),
                buildResponse('@GREETING_2'),
                buildResponse('@GREETING_3', [{
                  'title': 'Kyllä',
                  'payload': '@YES',
                }, {
                  'title': 'Ei',
                  'payload': '@NO',
                }])
              );
          })
          .then(() => this.bot.receive(SESSION, 'kyllä'));
        });
    });
});
