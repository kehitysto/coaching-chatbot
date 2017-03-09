import Chatbot from '../../src/chatbot/chatbot-service';
import dialog from '../../src/coaching-chatbot/dialog';
import Formatter from '../../src/lib/personal-information-formatter-service';
import Strings from '../../src/coaching-chatbot/strings.json';

const SESSION = 'SESSION';

describe('User story', function() {
  before(function() {
    let context = {};
    const sessions = {
      read: (sessionId) => {
        return Promise.resolve(context);
      },

      write: (sessionId, ctx) => {
        context = ctx;
        return Promise.resolve(context);
      },
    };

    this.bot = new Chatbot(dialog, sessions);

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
          return expect(
              this.bot.receive(SESSION, 'moi')
            )
            .to.eventually.become([Strings['@GREETING']]);
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
            expect(Strings['@UNCLEAR']).to.include(ret[0]);
            expect(ret[1]).to.deep.equal(Strings['@GREETING']);
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
            .to.eventually.become([Strings['@GREAT'], Strings[
              '@REQUEST_NAME']]);
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
            .to.eventually.become([Formatter.formatFromTemplate(
                '@CONFIRM_NAME', this.userInformation),
              Strings[
                '@REQUEST_JOB']
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
            .to.eventually.become([Formatter.formatFromTemplate(
              '@DISPLAY_PROFILE', this.userInformation)]);
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
              this.bot.receive(SESSION, 'Lisää ikä ' + this.userInformation
                .age)
            )

            .to.eventually.become([Formatter.formatFromTemplate(
                '@CONFIRM_AGE', this.userInformation),
              Formatter.formatFromTemplate('@DISPLAY_PROFILE', this.userInformation)
            ]);
        });
    });

  describe(
    'As a registered user I want to provide my location to the bot so other people can see it and bot will show the information ',
    function() {
      it(
        'should ask user for a additional information when user has provided his/her name and occupation',
        function() {
          this.userInformation.place = this.expectedPlace;
          return expect(
              this.bot.receive(SESSION, 'Lisää paikkakunta ' + this.userInformation
                .place)
            )
            .to.eventually.become([Strings['@CONFIRM_PLACE'],
              Formatter.formatFromTemplate('@DISPLAY_PROFILE', this.userInformation)
            ]);
        });
    });
});
