// normally undefined, set to 'dev' for local client only
process.env.RUN_ENV = 'dev';

import Chatbot from '../../src/chatbot/chatbot-service';
import dialog from '../../src/coaching-chatbot/dialog';
import PersonalInformationFormatter
 from '../../src/lib/personal-information-formatter-service';
import CommunicationMethodsFormatter
 from '../../src/lib/communication-methods-formatter';
import Strings from '../../src/coaching-chatbot/strings.json';
import Sessions from '../../src/util/sessions-service';

const SESSION = 'SESSION';

function buildResponse(templateId, quickReplies = []) {
  let message = Strings[templateId];
  if (message === undefined) {
    message = templateId;
  }

  return {
    message,
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
    'As a user I want the bot to respond if my input is not understood so that I can reply with valid input',
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
        'should ask user for a name when user has confirmed that he wants to find a peer',
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
    'As a registered user I want to provide my name to the bot so other people can see it and ask for occupation after name is confirmed',
    function() {
      it(
        'should ask user for a occupation when user has provided his/her name',
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
    'As a registered user I want to provide my occupation to the bot so other people can see it and bot will show the information and asks for additional information',
    function() {
      it(
        'should ask user for a occupation when user has provided his/her name',
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
                  PersonalInformationFormatter.getPersonalInformationbuttons(this.context)),
            ]);
        });
    });

  describe(
    'As a registered user I want to provide my age to the bot so other people can see it and bot will show the information and asks for additional information',
    function() {
      it(
        'should ask user for a additional information when user has provided his/her name and occupation',
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
                  PersonalInformationFormatter.getPersonalInformationbuttons(this.context)),
            ]);
        });
    });

  describe(
    'As a registered user I want to provide my location to the bot so other people can see it and bot will show the information',
    function() {
      it(
        'should ask user for a additional information when user has provided his/her name and occupation',
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
                  PersonalInformationFormatter.getPersonalInformationbuttons(this.context)),
            ]);
        });
    });

  describe(
    'As a registered user I want to provide my acceptable methods of communication with quick replies',
    function() {
      it(
        'should tell the user there are no communication methods added yet',
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
                  .getCommunicationMethods(this.sessions.db.dump()[SESSION])),
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
                  .getCommunicationMethods(this.sessions.db.dump()[SESSION])),
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
                  .getCommunicationMethods(this.sessions.db.dump()[SESSION])),
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
              buildResponse('@REQUEST_MEETING_FREQUENCY', PersonalInformationFormatter
               .getMeetingFrequency(this.sessions.db.dump()[SESSION]))]);
        }
      );
    }
  );

  describe(
    'As a registered user I want to provide my preferred meeting frequency with quick replies',
    function() {
      it(
        'after providing preferred meeting frequency as "every weekdays", it should tell that no other users with the same preferred frequency are searching for a peer',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Arkipäivisin'))
            .to.eventually.become([
              buildResponse('@CHANGE_MEETING_FREQUENCY'),
              buildResponse('@NO_PAIRS_AVAILABLE'),
            ]);
        }
      );
    }
  );

  describe(
    'As a registered user I want to be able to change my preferred meeting frequency',
    function() {
      it(
        'should ask for my preferred meeting frequency after I ask to change my preferred meeting frequency',
        function() {
          return expect(
              this.bot.receive(SESSION, 'muuta tapaamisväliä'))
            .to.eventually.become([
              buildResponse('@REQUEST_MEETING_FREQUENCY', PersonalInformationFormatter
               .getMeetingFrequency(this.sessions.db.dump()[SESSION]))]);
        }
      );

      it(
        'after providing preferred meeting frequency as "every second week", it should tell that no other users with the same preferred frequency are searching for a peer',
        function() {
          return expect(
              this.bot.receive(SESSION, 'Joka toinen viikko'))
            .to.eventually.become([
              buildResponse('@CHANGE_MEETING_FREQUENCY'),
              buildResponse('@NO_PAIRS_AVAILABLE'),
            ]);
        }
      );
    }
  );
});
