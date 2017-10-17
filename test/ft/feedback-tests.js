import commonFeatures from './common';
const { buildResponse, setupChatbot, QuickReplies, Strings } = commonFeatures;

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
          let promise = this.bot.receive('FEEDBACK_TESTER', '_');

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
          let promise = this.bot.receive('FEEDBACK_TESTER', '11');

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
          let promise = this.bot.receive('FEEDBACK_TESTER', '1');

          return expect(promise)
            .to.eventually.become([
              buildResponse(
                '@GIVE_FEEDBACK',
                [])
            ]);
        }
      );
    }
  );
});
