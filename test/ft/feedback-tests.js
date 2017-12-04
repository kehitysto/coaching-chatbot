import commonFeatures from './common';
import * as Session from '../../src/chatbot/session';
import * as sinon from 'sinon';
import PersonalInformationFormatter from
'../../src/lib/personal-information-formatter-service';
const { buildResponse, setupChatbot, QuickReplies, Strings, FeatureTestStates } = commonFeatures;

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
          let promise = this.bot.receive(SESSION, 'k');

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
        'should ask for feedback when a rating has been given',
        function() {
          let promise = this.bot.receive(SESSION, '3');

          return expect(promise)
            .to.eventually.become([
              buildResponse('@GIVE_FEEDBACK')
            ]);
        }
      );

      it('should not allow too long feedback', function() {
        return expect(
            this.bot.receive(SESSION, Array(601).fill('a').join('')))
              .to.eventually.become([
                buildResponse('@TOO_LONG_FEEDBACK'),
                buildResponse('@GIVE_FEEDBACK'),
              ]);
      });

      it('should ask for permission', function() {
        return expect(
          this.bot.receive(SESSION, 'palaute'))
            .to.eventually.become([
              buildResponse(
                '@CONFIRM_FEEDBACK',
                QuickReplies.createArray(['@YES', '@NO']))
            ]);
      });

      it('should thank for feedback', function() {
        return expect(
            this.bot.receive(SESSION, 'k'))
              .to.eventually.become([
                buildResponse('@THANKS_FOR_FEEDBACK'),
                buildResponse(
                  PersonalInformationFormatter.formatFromTemplate(
                    '@DISPLAY_PROFILE', FeatureTestStates['DEFAULT']['sessions'][SESSION]),
                  PersonalInformationFormatter.getPersonalInformationbuttons({})),
              ]);
      });
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
