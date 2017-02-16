import request from 'request-promise';

import Messenger from '../../src/facebook-messenger/messenger.service';


describe('As a non-registered user I want to start a conversation with the bot so I can start the process of finding a peer', function() {
    it('When the user sends a greeting', function() {
        Messenger.send("", "Moi!");
    });

    it('Messenger Bot should respond to the user', function() {
        
    });
});
