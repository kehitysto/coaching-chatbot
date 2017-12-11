import commonFeatures from './common';
const { buildResponse, setupChatbot, QuickReplies, Strings } = commonFeatures;
import PersonalInformationFormatter from '../../src/lib/personal-information-formatter-service';
import PairFormatter from '../../src/lib/pair-formatter';

const SESSION = 'STOP_SEARCH_TESTER';

describe('Stop searching', () => {
  describe(
    'As a user searching for a pair I want to be able to stop my search for a pair', () => {
      before(function () {
        setupChatbot(this, 'STOP_SEARCH_TESTS');
        this.userInformation = {
          name: 'Liisa Hakija',
        };
      });

      it(
        'should request for confirmation from me, when I request to stop the search',
        function () {
          return expect(
            this.bot.receive(SESSION, 'Lopeta haku'))
            .to.eventually.become([
              buildResponse('@CONFIRM_STOP_SEARCHING', [{
                'title': 'Kyllä',
                'payload': '@YES',
              }, {
                'title': 'Ei',
                'payload': '@NO',
              }]),
            ]);
        }
      );

      it(
        'should go back to showing the situation of pair searching if I decline',
        function () {
          const testUser = {
            name: 'Matti',
            communicationMethods: {
              SKYPE: 'Matti123',
            },
            searching: true,
          };

          this.sessions.write('ID', testUser);

          return expect(
            this.bot.receive(SESSION, 'ei'))
            .to.eventually.become([
              buildResponse('@INFORMATION_ABOUT_LIST'),
              buildResponse('Vertaisohjaaja: 1/1'),
              buildResponse(PairFormatter.beautifyAvailablePairs(
                [{
                  id: 'ID',
                  context: testUser,
                }]),
                QuickReplies.createArray(['@YES', '@NO', '@NEXT', '@EXIT', '@STOP_SEARCHING',])
              ),
            ]);
        }
      );

      it(
        'should request for confirmation from me again, when I request to stop the search again',
        function () {
          return expect(
            this.bot.receive(SESSION, 'Lopeta haku'))
            .to.eventually.become([
              buildResponse('@CONFIRM_STOP_SEARCHING', [{
                'title': 'Kyllä',
                'payload': '@YES',
              }, {
                'title': 'Ei',
                'payload': '@NO',
              }]),
            ]);
        }
      );

      it(
        'should confirm me that the search has ended and show me the info of my profile and the quick reply buttons for modifying it',
        function () {
          return expect(
            this.bot.receive(SESSION, 'Kyllä'))
            .to.eventually.become([
              buildResponse('@STOPPED_SEARCHING'),
              buildResponse(
                PersonalInformationFormatter.formatFromTemplate('@DISPLAY_PROFILE', this.userInformation),
                PersonalInformationFormatter.getPersonalInformationbuttons()),
            ]);
        }
      );
    }
  );
});
