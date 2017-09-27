// normally undefined, set to 'dev' for local client only
process.env.RUN_ENV = 'dev';

import Builder from '../../src/chatbot/builder';
import Chatbot from '../../src/chatbot/chatbot-service';
import dialog from '../../src/coaching-chatbot/dialog';
import Strings from '../../src/coaching-chatbot/strings.json';
import PersonalInformationFormatter
from '../../src/lib/personal-information-formatter-service';
import CommunicationMethodsFormatter
from '../../src/lib/communication-methods-formatter';
import Sessions from '../../src/util/sessions-service';
import PairFormatter
from '../../src/lib/pair-formatter';

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

    this.expectedName = 'Matti';
    this.expectedJob = 'Opiskelija';
    this.expectedAge = '22';
    this.expectedPlace = 'Helsinki';
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
          });
        }
      );
    }
  );

  describe(
    'As a non-registered user I want the bot to ask for my name, when I have confirmed that I want to start searching for a peer',
    function() {
      it(
        'should ask user for a name when user has confirmed that they want to find a peer',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Kyllä')
            )
            .to.eventually.become([
              buildResponse('@GREAT'),
              buildResponse('@REQUEST_NAME'),
            ]);
        });
    });

  describe(
    'As a registered user I want to provide my name to the bot',
    function() {
      it(
        'should ask user their occupation when user has provided their name',
        function() {
          this.userInformation.name = this.expectedName;
          return expect(
              this.bot.receive(SESSION, this.userInformation.name)
            )
            .to.eventually.become([
              buildResponse(
                PersonalInformationFormatter.formatFromTemplate(
                  '@CONFIRM_NAME', this.userInformation)),
              buildResponse('@REQUEST_JOB'),
            ]);
        });
    });

  describe(
    'As a registered user I want to provide my occupation to the bot',
    function() {
      it(
        'after user has provided their occupation, it should show user their profile information and ask if the user want\'s to provide more info or start the search for a pair',
        function() {
          this.userInformation.job = this.expectedJob;
          return expect(
              this.bot.receive(SESSION, this.userInformation.job)
            )
            .to.eventually.become([
              buildResponse(
                PersonalInformationFormatter.formatFromTemplate(
                  '@CONFIRM_JOB', this.userInformation)),
              buildResponse(
                PersonalInformationFormatter.formatFromTemplate(
                  '@INFORMATION_ABOUT_BUTTONS')),
              buildResponse(
                PersonalInformationFormatter.formatFromTemplate(
                  '@DISPLAY_PROFILE', this.userInformation),
                PersonalInformationFormatter.getPersonalInformationbuttons(
                  this.context)),
            ]);
        });
    });

  describe(
    'As a registered user I don\'t want to be able to change my preferred meeting frequency before I have added any info for my communication methods',
    function() {
      it(
        'should show the user their profile information again when user tries to change the meeting frequency',
        function() {
          return expect(
              this.bot.receive(SESSION, 'muuta tapaamisväliä'))
            .to.eventually.become([
              buildResponse(
                PersonalInformationFormatter.formatFromTemplate(
                  '@DISPLAY_PROFILE', this.userInformation),
                PersonalInformationFormatter.getPersonalInformationbuttons(
                  this.context))
            ]);
        }
      );
    });

  describe(
    'As a registered user I want to provide my age to the bot',
    function() {
      it(
        'after the user has given their age, it should show the user their profile information and ask if the user want\'s to provide more info or start the search for a pair',
        function() {
          this.userInformation.age = this.expectedAge;
          return expect(
              this.bot.receive(
                SESSION,
                'Lisää ikä ' + this.userInformation.age))
            .to.eventually.become([
              buildResponse(
                PersonalInformationFormatter.formatFromTemplate(
                  '@CONFIRM_AGE', this.userInformation)),
              buildResponse(
                PersonalInformationFormatter.formatFromTemplate(
                  '@DISPLAY_PROFILE', this.userInformation),
                PersonalInformationFormatter.getPersonalInformationbuttons(
                  this.context)),
            ]);
        });
    });

  describe(
    'As a registered user I want to provide my location to the bot',
    function() {
      it(
        'after user has given his location, it should show the user their profile information and ask if the user want\'s to provide more info or start the search for a pair',
        function() {
          this.userInformation.place = this.expectedPlace;

          return expect(
              this.bot.receive(
                SESSION,
                'Lisää paikkakunta ' + this.userInformation.place))
            .to.eventually.become([
              buildResponse('@CONFIRM_PLACE'),
              buildResponse(
                PersonalInformationFormatter.formatFromTemplate(
                  '@DISPLAY_PROFILE', this.userInformation),
                PersonalInformationFormatter.getPersonalInformationbuttons(
                  this.context)),
            ]);
        });
    });

    describe(
      'As a registered user I want to provide my bio to the bot',
      function() {
        it(
          'after user has given his bio, it should confirm and ask for more information',
          function() {
            this.userInformation.bio = 'My long bio in long text';
  
            return expect(
                this.bot.receive(
                  SESSION,
                  'Aseta kuvaus ' + this.userInformation.bio))
              .to.eventually.become([
                buildResponse('@CONFIRM_BIO'),
                buildResponse(
                  PersonalInformationFormatter.formatFromTemplate(
                    '@DISPLAY_PROFILE', this.userInformation),
                  PersonalInformationFormatter.getPersonalInformationbuttons(
                    this.context)),
              ]);
          });
      });
  

  describe(
    'As a registered user I want to provide my acceptable methods of communication with quick replies',
    function() {
      it(
        'after user requests to start the search for a pair, it should tell the user there are no communication methods added yet',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Etsi pari'))
            .to.eventually.become(
              [
                buildResponse('@NO_METHODS_ADDED', [{
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

      it(
        'after agreeing should provide a list of communication methods from which the user can choose one',
        function() {
          return expect(
              this.bot.receive(SESSION, 'kyllä'))
            .to.eventually.become([
              buildResponse('@REQUEST_COMMUNICATION_METHOD',
                CommunicationMethodsFormatter
                .getCommunicationMethods(this.sessions.db.dump()[
                  SESSION])),
            ]);
        }
      );

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
                .getCommunicationMethods(this.sessions.db.dump()[
                  SESSION])),
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
        'should ask if I want to add more communication methods after giving my phone number',
        function() {
          return expect(
              this.bot.receive(SESSION, '040-123123'))
            .to.eventually.become(
              [buildResponse(PersonalInformationFormatter.formatFromTemplate(
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
        'if I answer yes to add more after giving my phone number, it should provide the list of communication methods again and it should show that I have already added Skype and Phone',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Kyllä'))
            .to.eventually.become([
              buildResponse('@REQUEST_COMMUNICATION_METHOD',
                CommunicationMethodsFormatter
                .getCommunicationMethods(this.sessions.db.dump()[
                  SESSION])),
            ]);
        }
      );

      it(
        'should ask for my phone number when I choose cafeteria as a communication method',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Kahvila'))
            .to.eventually.become([
              buildResponse('@REQUEST_PHONE_NUMBER'),
            ]);
        }
      );

      it(
        'should go straight to pair searching after all methods are given',
        function() {
          return expect(
              this.bot.receive(SESSION, '040-123123'))
            .to.eventually.become([
              buildResponse('@PERMISSION_TO_RECEIVE_MESSAGES', [{
                'title': 'Kyllä',
                'payload': '@YES',
              }, {
                'title': 'Ei',
                'payload': '@NO',
              }])
            ]);
        }
      );
    }
  );

  describe(
    'As a user searching for a pair I want to get a list of other users wanting to meet as often as I do',
    function() {
      it(
        'should provide user with the list of users who has same meeting frequency',
        function() {
          const testUser = {
            name: 'Matti',
            job: 'Ope',
            communicationMethods: {
              SKYPE: 'Matti123',
            },
            meetingFrequency: 'ONCE_EVERY_TWO_WEEKS',
            searching: true,
          };

          this.sessions.write('ID', testUser);

          const expected = buildResponse(
            PairFormatter.beautifyAvailablePairs(
              [{
                id: 'ID',
                context: testUser,
              }]
            ),
            Builder.QuickReplies.createArray(['@YES', '@NO', '@LATER'])
          );

          return expect(
              this.bot.receive(SESSION, 'YES'))
            .to.eventually.become([
              buildResponse('@TELL_HOW_TO_STOP_SEARCH'),
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
            job: 'Ope',
            communicationMethods: {
              SKYPE: 'Matti123',
            },
            meetingFrequency: 'ONCE_EVERY_TWO_WEEKS',
            searching: true,
          };

          this.sessions.write('ID', testUser);

          const testUser2 = {
            name: 'Laura',
            job: 'Student',
            communicationMethods: {
              SKYPE: 'Laura123',
            },
            meetingFrequency: 'ONCE_EVERY_TWO_WEEKS',
            searching: false,
          };

          this.sessions.write('ID1', testUser2);

          return expect(
              this.bot.receive(SESSION, 'seuraava'))
            .to.eventually.become([
              buildResponse('@INFORMATION_ABOUT_LIST'),
              buildResponse(
                PairFormatter.beautifyAvailablePairs(
                  [{
                    id: 'ID',
                    context: testUser,
                  }]),
                Builder.QuickReplies.createArray(['@YES', '@NO', '@LATER'])
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
              buildResponse('@NO_PAIRS_AVAILABLE'),
            ])
            .then(() => expect(this.sessions.read('ID'))
                .to.eventually.include.keys({ 'pairRequests': [SESSION] }));
        }
      );
    }
  );

  describe(
    'As a user searching for a pair I want to be able to stop my search for a pair',
    function() {
      it(
        'should request for confirmation from me, when I request to stop the search',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Lopeta haku'))
            .to.eventually.become([
              buildResponse('@CONFIRM_STOP_SEARCHING', [{
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
        'should go back to showing the situation of pair searching if I decline',
        function() {
          const testUser = {
            name: 'Matti',
            job: 'Ope',
            communicationMethods: {
              SKYPE: 'Matti123',
            },
            meetingFrequency: 'ONCE_EVERY_TWO_WEEKS',
            searching: true,
          };

          this.sessions.write('ID', testUser);

          return expect(
              this.bot.receive(SESSION, 'ei'))
            .to.eventually.become([
              buildResponse('@INFORMATION_ABOUT_LIST'),
              buildResponse(PairFormatter.beautifyAvailablePairs(
                [{
                  id: 'ID',
                  context: testUser,
                }]),
                Builder.QuickReplies.createArray(['@YES', '@NO', '@LATER'])
              ),
            ]);
        }
      );

      it(
        'should request for confirmation from me again, when I request to stop the search again',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Lopeta haku'))
            .to.eventually.become([
              buildResponse('@CONFIRM_STOP_SEARCHING', [{
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
        'should confirm me that the search has ended and show me the info of my profile and the quick reply buttons for modifying it',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Kyllä'))
            .to.eventually.become([
              buildResponse('@STOPPED_SEARCHING'),
              buildResponse(
                PersonalInformationFormatter.formatFromTemplate(
                  '@DISPLAY_PROFILE', this.userInformation),
                PersonalInformationFormatter.getPersonalInformationbuttons(
                  this.context)),
            ]);
        }
      );
      it(
        'should go straight to pair searching after all methods are given',
        function() {
          return expect(
              this.bot.receive(SESSION, 'etsi pari'))
            .to.eventually.become([
              buildResponse('@PERMISSION_TO_RECEIVE_MESSAGES', [{
                'title': 'Kyllä',
                'payload': '@YES',
              }, {
                'title': 'Ei',
                'payload': '@NO',
              }])
            ]);
        }
      );
    }
  );

  describe(
    'As a registered user I want to be able to restart the process and remove my data',
    function() {

      it(
        'should ask user for a confirmation when user has requested a reset',
        function() {
          return expect(
              this.bot.receive(
                SESSION,
                'aloita alusta'))
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
              this.bot.receive(
                SESSION,
                'ei'))
            .to.eventually.become([
              buildResponse('@PERMISSION_TO_RECEIVE_MESSAGES', [{
                'title': 'Kyllä',
                'payload': '@YES',
              }, {
                'title': 'Ei',
                'payload': '@NO',
              }]),
            ]);
        });

      it(
        'should reset the context and go to the start if the user agrees to reset',
        function() {
          let backupContext = this.sessions.db.dump();

          let g = this.bot.receive(
            SESSION,
            'aloita alusta');

          return g.then(_ => {
            let response = this.bot.receive(
              SESSION,
              'kyllä');

            response.then(_ => this.sessions.db.load(backupContext));

            return expect(response)
              .to.eventually.become([
                buildResponse('@RESET_DONE', []),
                buildResponse('@GREETING', [{
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
    });
});
