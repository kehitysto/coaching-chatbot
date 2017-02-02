import { Wit, log } from 'node-wit';

import Sessions from './sessions.service';

// FIXME: uncouple fb-messenger service
import FBMessenger from '../facebook-messenger/messenger.service';


module.exports = class WitAI {
    constructor() {
        if (!process.env.WIT_AI_TOKEN) {
            throw new Error('No WIT_AI_TOKEN defined');
        }

        this.wit = new Wit({
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

        this.sessions = new Sessions();
    }

    receive(sessionId, text) {
        return this.sessions.read(sessionId)
            .catch(() => {})
            .then(context => {
                return this.wit.runActions(
                    sessionId,
                    text,
                    context
                );
            })
            .then(context => {
                return this.sessions.write(sessionId, context);
            });
    }
}
