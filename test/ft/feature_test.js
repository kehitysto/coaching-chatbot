import Chatbot from '../../src/chatbot/chatbot.service';
import dialog from '../../src/chatbot/coaching-chatbot.dialog';
import Strings from '../../src/chatbot/coaching-chatbot.strings.json';

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

        this.userInformation = {
            name: 'Matti',
            job: 'Opiskelija',
            age: '22',
            location: 'Helsinki',
        }
    });

    describe('As a non-registered user I want to start a conversation with the bot so I can start the process of finding a peer', function() {
        it('When the user sends a greeting MB should respond to the user',
        function() {
            return expect(
                this.bot.receive(SESSION, 'moi')
            ).to.eventually.become([Strings['@greeting']]);
        });
    });
    describe('As a non-registered user I want the bot to ask for my name, when I have confirmed that I want to start searching for a peer', function() {
     it('should ask user for a name when user has confirmed that he wants to find a peer',
     function() {
        return expect(
           this.bot.receive(SESSION, 'Kyllä')
         ).to.eventually.become([Strings['@great'], Strings['@request_name']]);
       });
     });
     describe('As a registered user I want to provide my name to the bot so other people can see it and ask for occupation after name is confirmed', function() {
      it('should ask user for a occupation when user has provided his/her name',
      function() {
         return expect(
            this.bot.receive(SESSION, this.userInformation.name)
          ).to.eventually.become([Strings['@confirm_name'].replace('{name}', this.userInformation.name), Strings['@request_job']]);
        });
    });
    describe('As a registered user I want to provide my occupation to the bot so other people can see it and bot will show the information and asks for additional information', function() {
    it('should ask user for a occupation when user has provided his/her name',
    function() {
       return expect(
          this.bot.receive(SESSION, this.userInformation.job)
        ).to.eventually.become(['Parin etsijät näkisivät nyt sinut seuraavasti: \"Matti, Opiskelija\". Voit lisätä ikäsi tai paikkakuntasi kertomalla minulle esim. \"Lisää ikä 33\". Jos olet tyytyväinen profiilisi, voit siirtyä parin etsimiseen kirjoittamalla \"Etsi pari\".']);
      });
  });
  describe('As a registered user I want to provide my age to the bot so other people can see it and bot will show the information and asks for additional information', function() {
  it('should ask user for a additional information when user has provided his/her name and occupation',
  function() {
     return expect(
        this.bot.receive(SESSION, 'Lisää ikä ' + this.userInformation.age)
     ).to.eventually.become([Strings['confirm_age'].replace('{age}', this.userInformation.age), 'Parin etsijät näkisivät nyt sinut seuraavasti: \"Matti, Opiskelija, 22\". Voit lisätä ikäsi tai paikkakuntasi kertomalla minulle esim. \"Lisää ikä 33\". Jos olet tyytyväinen profiilisi, voit siirtyä parin etsimiseen kirjoittamalla \"Etsi pari\".']);
    });
});
describe('As a registered user I want to provide my location to the bot so other people can see it and bot will show the information ', function() {
it('should ask user for a additional information when user has provided his/her name and occupation',
function() {
   return expect(
      this.bot.receive(SESSION, 'Lisää paikkakunta ' + this.userInformation.location)
    ).to.eventually.become(['Paikkakunta lisätty profiiliin.', 'Parin etsijät näkisivät nyt sinut seuraavasti: \"Matti, Opiskelija, 22, Helsinki\". Voit lisätä ikäsi tai paikkakuntasi kertomalla minulle esim. \"Lisää ikä 33\". Jos olet tyytyväinen profiilisi, voit siirtyä parin etsimiseen kirjoittamalla \"Etsi pari\".']);
  });
});
describe('Unclear information', function() {
it('should ask user for a additional information when user has provided his/her name and occupation',
function() {
   return expect(
      this.bot.receive(SESSION, 'asdaswa834*½')
    ).to.eventually.become(['Paikkakunta lisätty profiiliin.', 'Parin etsijät näkisivät nyt sinut seuraavasti: \"Matti, Opiskelija, 22, Helsinki\". Voit lisätä ikäsi tai paikkakuntasi kertomalla minulle esim. \"Lisää ikä 33\". Jos olet tyytyväinen profiilisi, voit siirtyä parin etsimiseen kirjoittamalla \"Etsi pari\".']);
  });
});

});
