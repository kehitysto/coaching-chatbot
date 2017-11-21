import commonFeatures from './common';
const { buildResponse, setupChatbot } = commonFeatures;

const SESSION = 'PAIR_REQUEST_TESTER';

describe('Pair request tests', function() {
  describe(
    'As a user searching for a pair I want to send a request to an available pair',
    function() {
      before(function() {
        setupChatbot(this, 'PAIR_REQUEST_TESTS');
      });

      it(
        'should ask for a message to be sent for the selected pair',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Kyllä'))
            .to.eventually.become([
              buildResponse('@GIVE_PAIR_REQUEST_MESSAGE')
            ]);
        }
      );
      
      it(
        'should send the request when choosing a potential pair',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Olet parini ennen kuin huomaatkaan'))
            .to.eventually.become([
              buildResponse('@CONFIRM_NEW_PEER_ASK'),
              buildResponse('@NO_PAIRS_AVAILABLE', [{
                  'title': 'Profiiliin',
                  'payload': '@TO_PROFILE',
                },
                {
                  'title': 'Lopeta haku',
                  'payload': '@STOP_SEARCHING',
                }
              ]),
            ])
            .then(() => expect(this.sessions.read('PAIR_REQUEST_TESTER_PAIR'))
                .to.eventually.include.keys({ 'pairRequests': [SESSION] }));
        }
      );
    }
  );
});
