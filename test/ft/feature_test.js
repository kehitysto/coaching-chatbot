import Chatbot from '../../src/chatbot/chatbot.service';
import dialog from '../../src/chatbot/coaching-chatbot.dialog';


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
    });

    describe('As a non-registered user I want to start a conversation with the bot so I can start the process of finding a peer', function() {
        it('When the user sends a greeting MB should respond to the user',
        function() {
            return expect(
                this.bot.receive(SESSION, 'moi')
            ).to.eventually.become(['Hei! Olen Kehitystön vertaisohjausrobotti. Kiinnostaako sinua löytää pari vertaisohjausta varten?']);
        });
    });

    describe('As a non-registered user I want the bot to ask for my name, when I have confirmed that I want to start searching for a peer', function() {
      it('should ask user for a name when user has confirmed that he wants to find a peer',
      function() {
         return expect(
            this.bot.receive(SESSION, 'Kyllä')
          ).to.eventually.become(['Hienoa!', 'Millä nimellä haluaisit esittäytyä mahdollisille pareillesi?']);
        });
});
});
