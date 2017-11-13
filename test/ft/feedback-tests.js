import commonFeatures from './common';
import * as Session from '../../src/chatbot/session';
import * as sinon from 'sinon';
const { buildResponse, setupChatbot, QuickReplies, Strings } = commonFeatures;

const sessionSpy = sinon.spy(Session.prototype, 'runActions');

const SESSION = 'FEEDBACK_TESTER';

describe('Feedback tests', function() {
  describe(
    'As a user I want to be able to give feedback',
    function() {
      before(function() {
        setupChatbot(this);
      });

      it(
        'should ask for feedback and give rating buttons',
        function() {
          let promise = this.bot.receive('FEEDBACK_TESTER', 'k');

          return expect(promise)
            .to.eventually.become([
              buildResponse(
                '@FEEDBACK_ABOUT_MEETING',
                QuickReplies.createArray(['1', '2', '3', '4'])),
            ]);
        }
      );

      it(
        'should ask for feedback again if unexisting button was pressed',
        function() {
          let promise = this.bot.receive(SESSION, '11');

          return promise.then((output) => {
            expect(Strings['@UNCLEAR'])
              .to.include(output[0].message);
            expect(output[1])
              .to.deep.equal(
                buildResponse(
                  '@FEEDBACK_ABOUT_MEETING',
                  QuickReplies.createArray(['1', '2', '3', '4'])),
              );
          });
        }
      );

      it(
        'should ask for feedback when a low rating is given',
        function() {
          let promise = this.bot.receive(SESSION, '1');

          return expect(promise)
            .to.eventually.become([
              buildResponse('@GIVE_FEEDBACK')
            ]);
        }
      );
    }
  );

  describe(
    'As a user I want to activate reminder and feedback sending system',
    function() {
      before(function() {
        setupChatbot(this);
      });

      it(
        'should allow me to send test command',
        function() {

          let promise = this.bot.receive('FEEDBACK_AND_REMINDER_TESTER', 'test');

          return promise.then(() => {
            return expect(sessionSpy.lastCall.args[0])
              .to.include('testReminderAndFeedback');
          });
        }
      );
  });
});
