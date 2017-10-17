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


  describe(
    'As a registered user I want to provide my acceptable methods of communication with quick replies',
    function() {
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
              buildResponse('@INFORMATION_ABOUT_BUTTONS'),
              buildResponse(
                PersonalInformationFormatter.formatFromTemplate(
                  '@DISPLAY_PROFILE', this.userInformation),
                PersonalInformationFormatter.getPersonalInformationbuttons(
                  this.context)),
            ]);
        }
      );
    }
  );

  describe(
    'As a registered I want to find a pair',
    function() {
      it(
        'should ask for my permission',
        function () {
          return expect(
            this.bot.receive(SESSION, 'Etsi pari'))
            .to.eventually.become(
            [
              buildResponse('@PERMISSION_TO_RECEIVE_MESSAGES', [{
                'title': 'Kyllä',
                'payload': '@YES',
              }, {
                'title': 'Ei',
                'payload': '@NO',
              }]),
            ]
            );
        }
      );
    }
  );

  describe(
    'As a user searching for a pair I want to get a list of other users searching for a pair',
    function() {
      it(
        'should provide user with the list of users',
        function() {
          const testUser = {
            name: 'Pekka',
            communicationMethods: {
              SKYPE: 'Pekka123',
            },
            searching: true,
          };

          this.sessions.write('ID2', testUser);

          const expected = buildResponse(
            PairFormatter.beautifyAvailablePairs(
              [{
                id: 'ID2',
                context: testUser,
              }]
            ),
            Builder.QuickReplies.createArray(['@YES', '@NO', '@STOP_SEARCHING',])
          );

          return expect(
              this.bot.receive(SESSION, 'YES'))
            .to.eventually.become([
              buildResponse('@INFORMATION_ABOUT_LIST'),
              expected,
            ]);
        }
      );

      it(
        'shouldnt put in the list users who are not in searching mode',
        function() {
          const testUser = {
            name: 'Matti',
            communicationMethods: {
              SKYPE: 'Matti123',
            },
            searching: true,
          };

          this.sessions.write('ID', testUser);

          const testUser2 = {
            name: 'Laura',
            communicationMethods: {
              SKYPE: 'Laura123',
            },
            searching: false,
          };

          this.sessions.write('ID1', testUser2);

          return expect(
              this.bot.receive(SESSION, 'no'))
            .to.eventually.become([
              buildResponse('@INFORMATION_ABOUT_LIST'),
              buildResponse(
                PairFormatter.beautifyAvailablePairs(
                  [{
                    id: 'ID',
                    context: testUser,
                  }]),
                Builder.QuickReplies.createArray(['@YES', '@NO', '@STOP_SEARCHING',])
              ),
            ]);
        }
      );
    }
  );

  describe(
    'As a user searching for a pair I want to send a request to an available pair',
    function() {
      it(
        'should send the request when choosing a potential pair',
        function() {
          return expect(
              this.bot.receive(SESSION, 'kyllä'))
            .to.eventually.become([
              buildResponse('@CONFIRM_NEW_PEER_ASK'),
              buildResponse('@NO_PAIRS_AVAILABLE', [{
                'title': 'Lopeta haku',
                'payload': '@STOP_SEARCHING',
              }]),              ,
            ])
            .then(() => expect(this.sessions.read('ID'))
                .to.eventually.include.keys({ 'pairRequests': [SESSION] }));
        }
      );
    }
  );
});
