// normally undefined, set to 'dev' for local client only
process.env.RUN_ENV = 'dev';

import * as Builder from '../../src/chatbot/builder';
import * as Chatbot from '../../src/chatbot/chatbot-service';
import dialog from '../../src/coaching-chatbot/dialog';
import * as Strings from '../../src/coaching-chatbot/strings.json';
import PersonalInformationFormatter
from '../../src/lib/personal-information-formatter-service';
import CommunicationMethodsFormatter
from '../../src/lib/communication-methods-formatter';
import * as Sessions from '../../src/util/sessions-service';
import PairFormatter
from '../../src/lib/pair-formatter';
import * as FeatureTestStates from './states.json';

const SESSION = 'SESSION';

function getTemplate(templateId) {
  return (Strings[templateId] !== undefined) ?
      Strings[templateId] :  templateId;
}

function buildResponse(templateId, quickReplies = []) {
  for (let i = 0; i < quickReplies.length; ++i) {
    quickReplies[i].title = getTemplate(quickReplies[i].title);
  }

  return {
    message: getTemplate(templateId),
    quickReplies,
  };
}

describe('User story', function() {
  before(function() {
    this.sessions = new Sessions();

    this.bot = new Chatbot(dialog, this.sessions);

    this.expectedName = 'Matti Luukkainen';
    this.userInformation = {};
  });

  describe(
    'As a non-registered user I want to start a conversation with the bot so I can start the process of finding a peer',
    function() {
      it('When the user sends a greeting MB should respond to the user',
        function() {
          return expect(this.bot.receive(SESSION, 'moi'))
            .to.eventually.become([
              buildResponse('@GREETING', [{
                'title': 'Kyllä',
                'payload': '@YES',
              }, {
                'title': 'Ei',
                'payload': '@NO',
              }]),
            ]);
        });
    });

  describe(
    'As a user I want the bot to respond if my input is not understood so that I can reply with a valid input',
    function() {
      it(
        'should tell that the input is not understood if the input is bad',
        function() {
          const promise = this.bot.receive(SESSION, 'invalid input');
          return promise.then((ret) => {
            expect(Strings['@UNCLEAR'])
              .to.include(ret[0].message);
            expect(ret[1])
              .to.deep.equal(
                buildResponse('@GREETING', [{
                  'title': 'Kyllä',
                  'payload': '@YES',
                }, {
                  'title': 'Ei',
                  'payload': '@NO',
                }])
              );
          })
          .then(() => this.bot.receive(SESSION, 'kyllä'));
        }
      );
    }
  );

    describe(
      'As a registered user I want to provide my bio to the bot',
      function() {
        it(
          'after user has given his bio, it should ask for communication methods',
          function() {
            this.userInformation.bio = 'My long bio in long text';
            this.userInformation.name = this.expectedName;
            return expect(
                this.bot.receive(SESSION, this.userInformation.bio))
              .to.eventually.become([
                buildResponse('@CONFIRM_BIO'),
                buildResponse('@REQUEST_COMMUNICATION_METHOD', [{
                  'payload': 'SKYPE',
                  'title': 'Skype',
                }, {
                  'payload': 'PHONE',
                  'title': 'Puhelin',
                }]),
              ]);
          });
      });
});
