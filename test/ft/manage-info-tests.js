import commonFeatures from './common';
import PersonalInformationFormatter from '../../src/lib/personal-information-formatter-service';
const { buildResponse, FeatureTestStates, setupChatbot, QuickReplies } = commonFeatures;

const SESSION = 'MANAGE_INFO_TESTER';

describe('Manage info tests', function () {
  describe(
    'As a registered user I want to manage my info ',
    function () {
      before(function () {
        setupChatbot(this, 'MANAGE_INFO_TESTS');
      });

      it('should allow changing name', function () {
        return expect(this.bot.receive(SESSION, 'nimi'))
          .to.eventually.become([
            buildResponse('@REQUEST_NAME'),
          ]);
      });

      it('should not accept too long name', function () {
        return expect(this.bot.receive(SESSION, Array(51).fill('a').join('')))
          .to.eventually.become([
            buildResponse('@TOO_LONG_NAME'),
            buildResponse('@REQUEST_NAME'),
          ]);
      });

      it('should accept name with ok length', function () {
        return expect(
          this.bot.receive(SESSION, 'Henkilö, jolla on tasan 50 merkkiä pitkä nimi.....'))
          .to.eventually.become([
            buildResponse('Terve Henkilö, jolla on tasan 50 merkkiä pitkä nimi.....!'),
            buildResponse('@MANAGE_INFO', [{
              'title': 'Nimi',
              'payload': '@NAME',
            },
            {
              'title': 'Kuvaus',
              'payload': '@BIO',
            }, {
              'title': 'Yhteystiedot',
              'payload': '@COMMUNICATION_METHODS',
            }, {
              'title': 'Palaa',
              'payload': '@RETURN',
            }]),
          ]);
      });

      it('should allow changing bio', function () {
        return expect(this.bot.receive(SESSION, 'kuvaus'))
          .to.eventually.become([
            buildResponse('@REQUEST_BIO'),
          ]);
      });

      it('should accept bio',
        function () {
          return expect(
            this.bot.receive(SESSION, 'My long bio in long text'))
            .to.eventually.become([
              buildResponse('@CONFIRM_BIO'),
              buildResponse('@MANAGE_INFO', [{
                'title': 'Nimi',
                'payload': '@NAME',
              },
              {
                'title': 'Kuvaus',
                'payload': '@BIO',
              }, {
                'title': 'Yhteystiedot',
                'payload': '@COMMUNICATION_METHODS',
              }, {
                'title': 'Palaa',
                'payload': '@RETURN',
              }]),
            ]);
      });

      it('should allow changing communication methods', function () {
        return expect(this.bot.receive(SESSION, 'yhteystiedot'))
          .to.eventually.become([
            buildResponse('@REQUEST_COMMUNICATION_METHOD', [{
              'title': 'Skype',
              'payload': 'SKYPE',
            }, {
              'title': 'Puhelin',
              'payload': 'PHONE',
            }]),
          ]);
      });

      it('should ask for my Skype username when I choose Skype as a communication method',
        function () {
          return expect(
            this.bot.receive(SESSION, 'Skype'))
            .to.eventually.become([
              buildResponse('@REQUEST_SKYPE_NAME'),
            ]);
        });

      it('should ask if the user wants to add more methods',
        function () {
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
        });

      it('should go back to manage info when done', function () {
        return expect(this.bot.receive(SESSION, 'valmis'))
          .to.eventually.become([
            buildResponse('@MANAGE_INFO', [{
              'title': 'Nimi',
              'payload': '@NAME',
            },
            {
              'title': 'Kuvaus',
              'payload': '@BIO',
            }, {
              'title': 'Yhteystiedot',
              'payload': '@COMMUNICATION_METHODS',
            }, {
              'title': 'Palaa',
              'payload': '@RETURN',
            }]),
          ]);
      });

      it('should go back to profile', function () {
        return expect(
          this.bot.receive(SESSION, 'Palaa'))
          .to.eventually.become([
            buildResponse(
              PersonalInformationFormatter.formatFromTemplate(
                '@DISPLAY_PROFILE', FeatureTestStates['MANAGE_INFO_TESTS']['sessions'][SESSION]),
              PersonalInformationFormatter.getPersonalInformationbuttons(
                {})),
          ]);
      });
  })
});
