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

    dialog(stateId, substates, intents=[]) {
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

    intent(intentId, intentObj) {
        log.debug("Registering intent {0}", intentId);
        this._intents[intentId] = intentObj;

        return this;
    }

    action(actionId, fn) {
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

        const actionData = {
            context: session.getContext(),
            userData: session.getUserData(),
            input: input || session.getInput()
        };
        const promise = Promise.resolve(this._actions[actionId](actionData))
            .then((result) => {
                if (result.context) {
                    log.debug("Updating context: {0}", JSON.stringify(result.context));
                    session.setContext(result.context);
                }
                if (result.userData) {
                    log.debug("Updating userData: {0}", JSON.stringify(result.userData));
                    session.setUserData(result.userData);
                }
            });

        return promise;
    }

    checkIntent(intentId, session) {
        const input = session.getInput();

        const match = this._runIntent(intentId, input);
        log.debug("Intent {0} on input \"{1}\" returned {2}", intentId, input, match);

        return match || false;
    }

    getString(stringId, variables) {
        log.debug("Retrieving string {0}", stringId);

        let template = this._strings[stringId];

        if (template !== undefined) {
            if (typeof template !== 'string') {
                template = template[Math.floor(Math.random() * template.length)];
            }

            log.debug("Template: {0}", template);
            log.debug("Variables: {0}", JSON.stringify(variables));

            return template.replace(
                /{(\w+)}/g,
                (match, name) => typeof variables[name] != 'undefined' ? variables[name] : match
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

    _matchIntentAny(anyArray, input) {
        let match = null;

        if (!anyArray.length) {
            anyArray = [anyArray];
        }

        for (let i = 0; i < anyArray.length; ++i) {
            match = this._matchIntent(anyArray[i], input);
            if (match !== null) break;
        }

        return match;
    }

    _matchIntentEach(eachArray, input) {
        let match = null;

        if (!eachArray.length) {
            eachArray = [eachArray];
        }

        for (let i = 0; i < eachArray.length; ++i) {
            match = this._matchIntent(eachArray[i], input);

            if (match === null) {
                return null;
            }

            if (match[0] !== undefined) {
                // match the next regexp against the remainder of input string
                input = input.substr(match[0].length).trim();
                log.silly("Trimmed input after match: \"{0}\"", input);
            }
        }

        return match;
    }

    _matchIntent(intentObj, input) {
        let ret;
        if (typeof intentObj === 'string') {
            ret = this._runIntent(intentObj, input);
        } else {
            log.silly("Matching intent {0} against input \"{1}\"",
                      intentObj.toString(), input);
            ret = intentObj.exec(input);
        }

        log.silly("Intent returned {0}", ret);

        return ret;
    }

    _runIntent(intentId, input) {
        if (this._intents[intentId] === undefined) {
            log.error("Intent not found: {0}", intentId);
            return null;
        }

        log.debug("Running intent {0}", intentId);

        const intent = this._intents[intentId];
        let result = null;

        if (intent.any !== undefined) {
            log.silly("Matching strategy: any");
            result = this._matchIntentAny(intent.any, input);
        } else if (intent.each !== undefined) {
            log.silly("Matching strategy: each");
            result = this._matchIntentEach(intent.each, input);
        } else {
            throw new Error(`Intent ${intentId}: any or each must be defined`);
        }

        if (result === null) {
            return null;
        } else {
            if (intent.match !== undefined) {
                log.debug("Running function for intent {0}", intentId);
                result = intent.match(result);
            }

            return result;
        }
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

                return resolve(
                    session.runQueue().then(() => {
                        if (session.getState() !== state || session.getSubState() !== substate) {
                            return this._runStep(step+1, session, input);
                        } else {
                            session.next();
                        }
                    })
                );
            }

            return reject(
                new Error(`Unknown state: ${state}`)
            );
        });
    }
};
