import commonFeatures from './common';
const { buildResponse, setupChatbot, QuickReplies } = commonFeatures;

import PersonalInformationFormatter from
  '../../src/lib/personal-information-formatter-service';

const SESSION = 'RESET_TESTER';

describe('Reset tests', function() {
  describe(
    'As a registered user I want to be able to restart the process and remove my data',
    function() {
      before(function() {
        setupChatbot(this);

        this.userInformation = {
          name: 'Reset Tester'
        };

        this.defaultUserInformation = {
          name: 'Matti Luukkainen'
        };
      });

      it(
        'should ask user for a confirmation when user has requested a reset',
        function() {
          return expect(
              this.bot.receive(SESSION, 'aloita alusta'))
            .to.eventually.become([
              buildResponse('@RESET_CONFIRMATION', [{
                'title': 'Kyllä',
                'payload': '@YES',
              }, {
                'title': 'Ei',
                'payload': '@NO',
              }]),
            ]);
        });

      it(
        'should repeat the last question if the user declines to reset',
        function() {
          return expect(
              this.bot.receive(SESSION, 'ei'))
            .to.eventually.become([
              buildResponse(
                PersonalInformationFormatter.formatFromTemplate(
                  '@DISPLAY_PROFILE', this.userInformation),
                PersonalInformationFormatter.getPersonalInformationbuttons(
                  this.context)),
            ]);
        });

      it(
        'should reset the context and go to the start if the user agrees to reset',
        function() {
          let backupContext = this.sessions.db.dump();

          let g = this.bot.receive(SESSION, 'aloita alusta');

          return g.then(_ => {
            let response = this.bot.receive(SESSION, 'kyllä');

            response.then(_ => this.sessions.db.load(backupContext));

            return expect(response)
              .to.eventually.become([
                buildResponse('@RESET_DONE'),
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
        }
      );

      it(
        'should confirm default name',
        function() {
          let response = this.bot.receive(SESSION, 'kyllä');

          return expect(response)
            .to.eventually.become([
              buildResponse('@GREAT'),
              buildResponse(
                PersonalInformationFormatter.formatFromTemplate(
                  '@CONFIRM_NAME',
                  this.defaultUserInformation)),
              buildResponse('@REQUEST_BIO'),
            ]);
        }
      );
    }
  );
});
