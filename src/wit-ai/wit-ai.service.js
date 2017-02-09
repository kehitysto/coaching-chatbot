import { Wit, log } from 'node-wit';

import Sessions from './sessions.service';


module.exports = class WitAI {
    constructor(sendAction) {
        if (!process.env.WIT_AI_TOKEN) {
            throw new Error('No WIT_AI_TOKEN defined');
        }

        this.sendAction = sendAction;

        this.wit = new Wit({
            accessToken: process.env.WIT_AI_TOKEN,
            actions: {
                send: this.send.bind(this),
                set_name: this.set_name.bind(this),
                set_job: this.set_job.bind(this),
                set_age: this.set_age.bind(this),
            },
            logger: new log.Logger(log.INFO),
        });

        this.sessions = new Sessions();
    }

    receive(sessionId, text) {
        if (text === "!reset") {
            return this.sessions.write(sessionId, {})
                .then(() => this.sendAction(sessionId, "!!! Profiili resetoitu."));
        }
        return this.sessions.read(sessionId)
            .catch(err => {
                console.error(err.message.toString());
                return {};
            })
            .then(context => {
                return this.wit.runActions(
                    sessionId,
                    text,
                    context
                );
            })
            .then(context => {
                console.log('The context looks like this now: ' + JSON.stringify(context));
                return context;
            })
            .then(context => {
                return this.sessions.write(sessionId, context);
            });
    }

    send({sessionId}, {text}) {
        return this.sendAction(sessionId, text).then(() => null);
    }

    set_name({context, entities}) {
        return new Promise((resolve, reject) => {
            if (entities.name) {
                console.log('returning name ' + entities.name[0].value);
                return resolve({
                    ...context,
                    name: entities.name[0].value
                });
            }

            if (entities.contact) {
                console.log('returning contact ' + entities.contact[0].value);
                return resolve({
                    ...context,
                    name: entities.contact[0].value
                });
            }

            return reject(new Error());
        });
    }

    set_job({context, entities}) {
        return new Promise((resolve, reject) => {
            if (entities.job) {
                console.log('returning job ' + entities.job[0].value);
                return resolve({
                    ...context,
                    job: entities.job[0].value
                });
            }

            return reject(new Error());
        });
    }

    set_age({context, entities}) {
        return new Promise((resolve, reject) => {
            if (entities.age) {
                console.log('returning age ' + entities.age[0].value);
                return resolve({
                    ...context,
                    age: entities.age[0].value
                });
            }

            return reject(new Error());
        });
    }
}
