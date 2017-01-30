import { Wit, log } from 'node-wit';

import Sessions from './sessions.service';

// FIXME: uncouple fb-messenger service
import FBMessenger from '../facebook-messenger/messenger.service';


const WitAI = {
    receive,
};
module.exports = WitAI;

var wit = null;

activate();


function activate() {
    if (!process.env.WIT_AI_TOKEN) {
        throw new Error('No WIT_AI_TOKEN defined');
    }

    wit = new Wit({
        accessToken: process.env.WIT_AI_TOKEN,
        actions: {
            send({sessionId}, {text}) {
                return FBMessenger.send(sessionId, text).then(() => null);
            },
            set_name({context, entities}) {
                return new Promise((resolve, reject) => {
                    for (let i = 0; i < entities.length; ++i) {
                        if (entities[i].suggested) {
                            return resolve({
                                ...context,
                                name: entities[i].value
                            });
                        }
                    }
                });
            }
        },
        logger: new log.Logger(log.INFO),
    });
}

function receive(sessionId, text) {
    return wit.runActions(
        sessionId,
        text,
        {} // context
    ); // resolves w/ context
}
