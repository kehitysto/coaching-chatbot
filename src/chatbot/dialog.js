import Session from './session';


module.exports = class Dialog {
    constructor(strings, maxSteps=5) {
        this.maxSteps = maxSteps;

        this._tree = {};
        this._intents = {};
        this._actions = {};

        this._strings = strings;
    }

    addState(name, state) {
        this._tree[name] = state;

        return this;
    }

    addIntent(name, regexp, fn) {
    }

    run(context, input) {
        const session = new Session(context).start();

        return this.runStep(0, session, input)
            .then(session => session.finalize());
    }

    runStep(step, session, input) {
        return new Promise((resolve, reject) => {
            if (step > this.maxSteps) {
                return reject(new Error("Too many iterations"));
            }

            const state = session.getState();

            if (this._tree[state] !== undefined) {
                const substate = session.getSubState();

                this._tree[state][substate](session, input);

                if (session.getState() === state) {
                    session.setSubState(
                        (substate+1) % this._tree[state].length
                    );
                }

                if (session.done) {
                    this.processResults(session);
                    return resolve(session);
                } else {
                    return resolve(
                        this.runStep(step+1, session, input)
                    );
                }
            }

            return Reject(
                new Error(`Unknown state: ${state}`)
            );
        });
    }

    processResults(session) {
        const out = [];

        for (let i = 0; i < session.result.length; ++i) {
            const stringId = session.result[i][0];
            const template = this._strings[stringId];

            if (template === undefined) {
                out.push(stringId);
            } else {
                out.push(template);
            }
        }

        session.result = out.join('\n');
    }
};
