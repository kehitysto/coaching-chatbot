import commonFeatures from './common';
import * as strings from '../../src/coaching-chatbot/strings.json';
const { buildResponse, setupChatbot, QuickReplies, Strings } = commonFeatures;

const SESSION = 'MEETING_TESTER';

describe('Meeting tests', function() {
  describe(
    'As a user I want to be able to set a meeting date',
    function() {
      before(function() {
        setupChatbot(this, 'MEETING_TESTS');
      });

      it(
        'should allow setting a meeting date and then give weekday buttons',
        function() {
          let promise = this.bot.receive(SESSION, 'aseta tapaaminen');

          return expect(promise)
            .to.eventually.become([
              buildResponse(
                '@ASK_FOR_WEEKDAY',
                QuickReplies.createArray(strings['@WEEKDAYS'])),
            ]);
        }
      );

      it(
        'should ask for weekday again if undefined input was given',
        function() {
          let promise = this.bot.receive(SESSION, 'ueue');

          return promise.then((output) => {
            expect(Strings['@UNCLEAR'])
              .to.include(output[0].message);
            expect(output[1])
              .to.deep.equal(
                buildResponse(
                  '@ASK_FOR_WEEKDAY',
                  QuickReplies.createArray(strings['@WEEKDAYS'])),
              );
          });
        }
      );

      it(
        'should ask for time when a day is given',
        function() {
          let promise = this.bot.receive(SESSION, 'MA');

          return expect(promise)
            .to.eventually.become([
              buildResponse('@ASK_FOR_TIME')
            ]);
        }
      );

      it(
        'should ask for time again if invalid time was given',
        function() {
          let promise = this.bot.receive(SESSION, 'ueue');

          return promise.then((output) => {
            expect(Strings['@UNCLEAR'])
              .to.include(output[0].message);
            expect(output[1])
              .to.deep.equal(
                buildResponse('@ASK_FOR_TIME')
              );
          });
        }
      );

      it(
        'should go back to the accepted pair profile and display the meeting day',
        function() {
          let promise = this.bot.receive(SESSION, '11:11');
          return promise.then((output) => {
            expect(output[0])
              .to.deep.equal(
                buildResponse(
                    'Tapaaminen on viikoittain MA, klo 11:11',
                    QuickReplies.createArray([
                        '@SET_DATE', '@SKIP_MEETING', '@DISABLE_REMINDERS', '@SHOW_PAIR']),
                ));
          });
        }
      );
    }
  );
});