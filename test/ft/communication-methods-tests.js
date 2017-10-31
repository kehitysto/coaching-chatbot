import commonFeatures from './common';
import CommunicationMethodsFormatter from '../../src/lib/communication-methods-formatter';
import PersonalInformationFormatter from '../../src/lib/personal-information-formatter-service';
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
        'if I answer yes to add more after giving my Skype id, it should provide the list of communication methods again and it should show that I have already added Skype',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Kyllä'))
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
        'should not go straight to profile after all methods are given',
        function() {
          return expect(
              this.bot.receive(SESSION, '040-123123'))
            .to.eventually.become([
              buildResponse(PersonalInformationFormatter.formatFromTemplate(
                '@CONFIRM_COMMUNICATION_METHODS', {
                  communicationMethods: {
                    SKYPE: 'nickname',
                    PHONE: '040-123123'
                  }
                })),
              buildResponse('@PROVIDE_OTHER_COMMUNICATION_METHODS', [{
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
        'should go to profile after refusing from giving any communication methods',
        function() {
          return expect(
            this.bot.receive(SESSION, 'ei'))
            .to.eventually.become([
              buildResponse(
                PersonalInformationFormatter.formatFromTemplate(
                  '@DISPLAY_PROFILE', FeatureTestStates['COMMUNICATION_METHODS_TESTS']['sessions'][SESSION]),
                PersonalInformationFormatter.getPersonalInformationbuttons(
                  {})),
            ]);
        }
      );
    }
  );
});