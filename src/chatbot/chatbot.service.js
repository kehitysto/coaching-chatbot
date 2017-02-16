import log from '../lib/logger.service';


module.exports = class Chatbot {
    constructor(dialog, sessions) {
        this._dialog = dialog;
        this._sessions = sessions;
    }

    receive(sessionId, text) {
        return this._sessions.read(sessionId)
            .catch(err => {
                console.error(err.message.toString());
                return {};
            })
            .then(context => {
                return this._dialog.run(
                    context,
                    text
                );
            })
            .then((session) => {
                log.info('Writing context: {0}', JSON.stringify(session.getContext()));
                this._sessions.write(sessionId, session.getContext());
                return session.getResult();
            });
    }

    set_name({ context, entities }) {
        return new Promise((resolve, reject) => {
            if (entities.name) {
                console.log('returning name ' + entities.name[0].value);
                return resolve({
                    ...context,
                    name: entities.name[0].value,
                });
            }

            if (entities.contact) {
                console.log('returning contact ' + entities.contact[0].value);
                return resolve({
                    ...context,
                    name: entities.contact[0].value,
                });
            }

            return reject(new Error());
        });
    }

    set_job({ context, entities }) {
        return new Promise((resolve, reject) => {
            if (entities.job) {
                console.log('returning job ' + entities.job[0].value);
                return resolve({
                    ...context,
                    job: entities.job[0].value,
                });
            }

            return reject(new Error());
        });
    }

    set_age({ context, entities }) {
        return new Promise((resolve, reject) => {
            if (entities.age) {
                console.log('returning age ' + entities.age[0].value);
                return resolve({
                    ...context,
                    age: entities.age[0].value,
                });
            }

            return reject(new Error());
        });
    }

    reset({ context, entities }) {
    return new Promise((resolve, reject) => {
            return resolve( {} );
    });
}
};
