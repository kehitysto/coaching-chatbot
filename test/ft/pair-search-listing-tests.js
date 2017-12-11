import commonFeatures from './common';
import PairFormatter from '../../src/lib/pair-formatter';
const { buildResponse, FeatureTestStates, setupChatbot, QuickReplies } = commonFeatures;

const SESSION = 'PAIR_SEARCH_LISTING_TESTER';

describe('Pair search listing tests', function() {
  describe(
    'As a user searching for a pair I want to get a list of other users searching for a pair',
    function() {
      before(function() {
        setupChatbot(this, 'PAIR_SEARCH_LISTING_TESTS');
      });

      it(
        'should provide user with the list of users',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Etsi vertaisohjaajaa'))
            .to.eventually.become([
              buildResponse('@INFORMATION_ABOUT_LIST'),
              buildResponse('Vertaisohjaaja: 1/2'),
              buildResponse(
                PairFormatter.beautifyAvailablePairs(
                  [{
                    id: 'SEARCHING#1',
                    context: FeatureTestStates['PAIR_SEARCH_LISTING_TESTS']['sessions']['SEARCHING#1'],
                  }]),
                QuickReplies.createArray(['@YES', '@NO', '@NEXT', '@EXIT', '@STOP_SEARCHING',])
              ),
            ]);
        }
      );

      it(
        'shouldnt put in the list users who are not in searching mode',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Ei'))
            .to.eventually.become([
              buildResponse('Vertaisohjaaja: 1/1'),
              buildResponse(
                PairFormatter.beautifyAvailablePairs(
                  [{
                    id: 'SEARCHING#2',
                    context: FeatureTestStates['PAIR_SEARCH_LISTING_TESTS']['sessions']['SEARCHING#2'],
                  }]),
                QuickReplies.createArray(['@YES', '@NO', '@NEXT', '@EXIT', '@STOP_SEARCHING',])
              ),
            ]);
        }
      );
    }
  );
});
