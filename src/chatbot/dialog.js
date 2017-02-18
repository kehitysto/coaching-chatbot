import log from '../lib/logger.service';

import Session from './session';


module.exports = class Dialog {
    constructor(strings, maxSteps=5) {
        this.maxSteps = maxSteps;

        this._tree = {};
        this._intents = {};
        this._actions = {};

        this._strings = strings;
    }

    addState(stateId, substates, intents=[]) {
        if (stateId.startsWith('/')) {
            stateId = stateId.substr(1);
        }

        log.debug("Registering state /{0}", stateId);
        this._tree[stateId] = {
            intents,
            substates
        };

        return this;
    }

    addIntent(intentId, regexp, fn) {
        log.debug("Registering intent {0}", intentId);
        this._intents[intentId] = [regexp, fn];

        return this;
    }

    addAction(actionId, fn) {
        log.debug("Registering action {0}", actionId);
        this._actions[actionId] = fn;

        return this;
    }

    run(context, input) {
        log.info("Running bot for input \"{0}\"", input);

        const session = new Session(this).start(context, input);

        return this._runIntents(session, input)
            .then(() => this._runStep(0, session, input))
            .then(() => session.finalize());
    }

    runAction(actionId, session, input=null) {
        log.info("Running action {0}", actionId);

        if (this._actions[actionId] === undefined) {
            return Promise.reject(new Error(`No such action: ${actionId}`));
        }

        return this._actions[actionId](session.getContext(),
                                       input || session.getInput());
    }

    checkIntent(intentId, session) {
        if (this._intents[intentId] === undefined) {
            log.error("Intent not found: {0}", intentId);
            return false;
        }

        const input = session.getInput();
        const regexps = this._intents[intentId][0].length ? this._intents[intentId][0] : [ this._intents[intentId][0] ];

        let match = [];
        for (let i = 0; i < regexps.length; ++i) {
            match = regexps[i].exec(input);
            if (match !== null) break;
        }

        log.debug("Intent {0} on input \"{1}\" returned {2}", intentId, input, match);

        if (match === null) {
            return false;
        }

        if (this._intents[intentId][1] !== undefined) {
            log.debug("Running function for intent {0}", intentId);
            return this._intents[intentId][1](match);
        } else {
            return true;
        }
    }

    getString(stringId, context) {
        log.debug("Retrieving string {0}", stringId);

        const template = this._strings[stringId];

        if (template !== undefined) {
            return template.replace(
                /{(\w+)}/g,
                (match, name) => typeof context[name] != 'undefined' ? context[name] : match
            )
        } else {
            log.warning("String not found: {0}", stringId);

            return stringId;
        }
    }

    getSubStateCount(stateId) {
        if (this._tree[stateId] === undefined) {
            return 0;
        }

        return this._tree[stateId].substates.length;
    }

    _runIntents(session, input) {
        return new Promise((resolve, reject) => {
            const states = session.getStateArray();

            for (let i = 0; i < states.length; ++i) {
                let intents = this._tree[states[i]].intents;

                for (let j = 0; j < intents.length; ++j) {
                    let match = this.checkIntent(intents[j][0], session);

                    if (match !== false) {
                        intents[j][1](session, match);
                        return resolve();
                    }
                }
            }

            return resolve();
        });
    }

    _runStep(step, session, input) {
        log.debug("Running iteration {0}", step);

        return new Promise((resolve, reject) => {
            if (step > this.maxSteps) {
                return reject(new Error("Too many iterations"));
            }

            const state = session.getState();

            if (this._tree[state] !== undefined) {
                const substate = session.getSubState();

                this._tree[state].substates[substate](session, input);

                if (session.done) {
                    return resolve();
                } else {
                    return resolve(
                        this._runStep(step+1, session, input)
                    );
                }
            }

            return reject(
                new Error(`Unknown state: ${state}`)
            );
        });
    }
};
