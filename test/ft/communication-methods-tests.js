import commonFeatures from './common';
import PersonalInformationFormatter from '../../src/lib/personal-information-formatter-service';
import CommunicationMethodsFormatter from '../../src/lib/communication-methods-formatter';
const { buildResponse, FeatureTestStates, setupChatbot, QuickReplies } = commonFeatures;

const SESSION = 'COMMUNICATION_METHODS_TESTER';

describe('Communication methods tests', function() {
  describe(
    'As a registered user I want to provide my acceptable methods of communication with quick replies',
    function() {
      before(function() {
        setupChatbot(this, 'COMMUNICATION_METHODS_TESTS');
      });

      it(
        'should ask for my phone number when I choose phone as a communication method',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Puhelin'))
            .to.eventually.become([
              buildResponse('@REQUEST_PHONE_NUMBER'),
            ]);
        }
      );

      it('should not allow too long phone number', function () {
        return expect(
          this.bot.receive(SESSION, Array(51).fill('a').join('')))
          .to.eventually.become([
            buildResponse('@TOO_LONG_COMMUNICATION_METHOD'),
            buildResponse('@REQUEST_COMMUNICATION_METHOD', [{
              'title': 'Skype',
              'payload': 'SKYPE',
            }, {
              'title': 'Puhelin',
              'payload': 'PHONE',
            }]),
          ]);
      });

      it(
        'should ask for my Skype username when I choose Skype as a communication method',
        function () {
          return expect(
            this.bot.receive(SESSION, 'Skype'))
            .to.eventually.become([
              buildResponse('@REQUEST_SKYPE_NAME'),
            ]);
        }
      );

      it('should not allow too long Skype username', function () {
        return expect(
          this.bot.receive(SESSION, Array(51).fill('a').join('')))
          .to.eventually.become([
            buildResponse('@TOO_LONG_COMMUNICATION_METHOD'),
            buildResponse('@REQUEST_COMMUNICATION_METHOD', [{
              'title': 'Skype',
              'payload': 'SKYPE',
            }, {
              'title': 'Puhelin',
              'payload': 'PHONE',
            }]),
          ]);
      });

      it(
        'should ask for my Skype username when I choose Skype as a communication method',
        function () {
          return expect(
            this.bot.receive(SESSION, 'Skype'))
            .to.eventually.become([
              buildResponse('@REQUEST_SKYPE_NAME'),
            ]);
        }
      );

      it(
        'should ask if the user wants to add more methods',
        function() {
          return expect(
              this.bot.receive(SESSION, 'nickname'))
            .to.eventually.become([
              buildResponse(PersonalInformationFormatter.formatFromTemplate(
                '@CONFIRM_COMMUNICATION_METHODS', {
                  communicationMethods: {
                    SKYPE: 'nickname'
                  }
                })),
              buildResponse('@PROVIDE_OTHER_COMMUNICATION_METHODS', [{
                'title': 'Lisää',
                'payload': '@EDIT',
              }, {
                'title': 'Poista',
                'payload': '@DELETE',
              }, {
                'title': 'Valmis',
                'payload': '@DONE',
              }]),
            ]);
        }
      );

      it('should give me options of communications methods when I say Lisää',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Lisää'))
            .to.eventually.become([
              buildResponse('@REQUEST_COMMUNICATION_METHOD',
                CommunicationMethodsFormatter
                .getCommunicationMethods({})),
            ]);
        }
      );

      it(
        'should ask for my phone number when I choose phone as a communication method',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Puhelin'))
            .to.eventually.become([
              buildResponse('@REQUEST_PHONE_NUMBER')
            ]);
        }
      );

      it(
        'should go back to asking for more communication methods after adding one',
        function() {
          return expect(
              this.bot.receive(SESSION, '040404'))
            .to.eventually.become([
              buildResponse(PersonalInformationFormatter.formatFromTemplate(
                '@CONFIRM_COMMUNICATION_METHODS', {
                  communicationMethods: {
                    SKYPE: 'nickname',
                    PHONE: '040404'
                  }
                })),
              buildResponse('@PROVIDE_OTHER_COMMUNICATION_METHODS', [{
                'title': 'Lisää',
                'payload': '@EDIT',
              }, {
                'title': 'Poista',
                'payload': '@DELETE',
              }, {
                'title': 'Valmis',
                'payload': '@DONE',
              }]),
            ]);
        }
      );

      it(
        'should go to removing when user wants it to',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Poista'))
            .to.eventually.become([
              buildResponse('@REQUEST_COMMUNICATION_METHOD_DELETE', [{
                'title': 'Skype',
                'payload': 'SKYPE',
              }, {
                'title': 'Puhelin',
                'payload': 'PHONE',
              }, {
                'title': 'Palaa',
                'payload': '@RETURN',
              }]),
            ]);
        }
      );

      it(
        'should go back to asking when a communication method is removed',
        function() {
          return expect(
              this.bot.receive(SESSION, 'SKYPE'))
            .to.eventually.become([
              buildResponse(PersonalInformationFormatter.formatFromTemplate(
                '@CONFIRM_COMMUNICATION_METHODS', {
                  communicationMethods: {
                    PHONE: '040404'
                  }
                })),
              buildResponse('@PROVIDE_OTHER_COMMUNICATION_METHODS', [{
                'title': 'Lisää',
                'payload': '@EDIT',
              }, {
                'title': 'Poista',
                'payload': '@DELETE',
              }, {
                'title': 'Valmis',
                'payload': '@DONE',
              }]),
            ]);
        }
      );
  });

  describe(
    'As a registered user I want to be able to remove my communication methods, add them again and modify them',
    function() {
      before(function() {
        setupChatbot(this, 'COMMUNICATION_METHODS_REMOVAL_TESTS');
      });

      it(
        'should ask for my Skype username when I choose Skype as a communication method',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Skype'))
            .to.eventually.become([
              buildResponse('@REQUEST_SKYPE_NAME'),
            ]);
        }
      );

      it(
        'should ask if the user wants to add more methods',
        function() {
          return expect(
              this.bot.receive(SESSION, 'nickname'))
            .to.eventually.become([
              buildResponse(PersonalInformationFormatter.formatFromTemplate(
                '@CONFIRM_COMMUNICATION_METHODS', {
                  communicationMethods: {
                    SKYPE: 'nickname'
                  }
                })),
              buildResponse('@PROVIDE_OTHER_COMMUNICATION_METHODS', [{
                'title': 'Lisää',
                'payload': '@EDIT',
              }, {
                'title': 'Poista',
                'payload': '@DELETE',
              }, {
                'title': 'Valmis',
                'payload': '@DONE',
              }]),
            ]);
        }
      );

      it(
        'should allow removing the only communication method',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Poista'))
            .to.eventually.become([
              buildResponse('@REQUEST_COMMUNICATION_METHOD_DELETE', [{
                'title': 'Skype',
                'payload': 'SKYPE',
              }, {
                'title': 'Palaa',
                'payload': '@RETURN',
              }]),
            ]);
        }
      );

      it(
        'should ask for methods without letting the user go to profile',
        function() {
          return expect(
              this.bot.receive(SESSION, 'SKYPE'))
            .to.eventually.become([
              buildResponse('@REQUEST_COMMUNICATION_METHOD', [{
                'title': 'Skype',
                'payload': 'SKYPE',
              }, {
                'title': 'Puhelin',
                'payload': 'PHONE',
              }]),
            ]);
        }
      );

      it(
        'should allow adding already once removed methods',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Skype'))
            .to.eventually.become([
              buildResponse('@REQUEST_SKYPE_NAME'),
            ]);
        }
      );

      it(
        'should ask if the user wants to add more methods',
        function() {
          return expect(
              this.bot.receive(SESSION, 'nickname'))
            .to.eventually.become([
              buildResponse(PersonalInformationFormatter.formatFromTemplate(
                '@CONFIRM_COMMUNICATION_METHODS', {
                  communicationMethods: {
                    SKYPE: 'nickname'
                  }
                })),
              buildResponse('@PROVIDE_OTHER_COMMUNICATION_METHODS', [{
                'title': 'Lisää',
                'payload': '@EDIT',
              }, {
                'title': 'Poista',
                'payload': '@DELETE',
              }, {
                'title': 'Valmis',
                'payload': '@DONE',
              }]),
            ]);
        }
      );

      it('should allow adding methods after removal',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Lisää'))
            .to.eventually.become([
              buildResponse('@REQUEST_COMMUNICATION_METHOD',
                CommunicationMethodsFormatter
                .getCommunicationMethods({})),
            ]);
        }
      );

      it(
        'should allow editing methods already provided',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Skype'))
            .to.eventually.become([
              buildResponse('@REQUEST_SKYPE_NAME'),
            ]);
        }
      );

      it(
        'should ask if the user wants to add more methods',
        function() {
          return expect(
              this.bot.receive(SESSION, 'someothernickname'))
            .to.eventually.become([
              buildResponse(PersonalInformationFormatter.formatFromTemplate(
                '@CONFIRM_COMMUNICATION_METHODS', {
                  communicationMethods: {
                    SKYPE: 'someothernickname'
                  }
                })),
              buildResponse('@PROVIDE_OTHER_COMMUNICATION_METHODS', [{
                'title': 'Lisää',
                'payload': '@EDIT',
              }, {
                'title': 'Poista',
                'payload': '@DELETE',
              }, {
                'title': 'Valmis',
                'payload': '@DONE',
              }]),
            ]);
        }
      );
    }
  );
});
