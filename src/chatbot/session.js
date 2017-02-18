import log from '../lib/logger.service';


module.exports = class Session {
    constructor(dialog) {
        this.dialog = dialog;
        this.context = null;
        this.userData = null;
        this.input = null;

        this.result = null;

        this._queue = null;
        this._results = [];
        this._done = false;
    }

    start(context, input) {
        this.context = context;
        this.input = input;
        this.userData = {};

        this.state = this._getStateArray();
        delete this.context.state;

        this._queue = Promise.resolve();
        this._results = [];
        this._done = false;

        return this;
    }

    finalize() {
        this.context.state = this._setStateArray(this.state);

        this._processResults();

        return this;
    }

    runQueue() {
        return this._queue;
    }

    getInput() {
        return this.input;
    }

    getContext() {
        return this.context;
    }

    setContext(context) {
        this.context = context;
    }

    getUserData() {
        return this.userData;
    }

    setUserData(userData) {
        this.userData = userData;
    }

    getVariables() {
        log.debug("Building variable state...");
        log.debug("context: {0}", JSON.stringify(this.context));
        log.debug("userData: {0}", JSON.stringify(this.userData));

        return {
            ...this.context,
            ...this.userData
        }
    }

    getResult() {
        return this.result;
    }

    getState() {
        return this.state[this.state.length-1][0];
    }

    getStateArray() {
        const out = [];

        for (let i = 0; i < this.state.length; ++i) {
            out.push(this.state[i][0]);
        }

        return out;
    }

    pushState(state) {
        if (state.startsWith('/')) {
            state = state.substr(1);
        }

        for (let i = 0; i < this.state.length; ++i) {
            if (this.state[i][0] === state) {
                throw new Error("Recursive state tree");
            }
        }

        this.state.push([state, 0]);
    }

    popState() {
        if (this.state.length > 1) {
            this.state.pop();
        } else {
            this.state[0] = ['base', 0];
        }
    }

    switchState(newState) {
        if (newState.startsWith('/')) {
            newState = newState.substr(1);
        }

        this.state[this.state.length-1] = [newState, 0];
    }

    clearState() {
        this.state = [['base', 0]];
    }

    getSubState() {
        return this.state[this.state.length-1][1];
    }

    addResult() {
        this._results.push(
            Array.prototype.slice.apply(arguments)
        );
    }

    runAction(actionId, input=null) {
        this._queue = this._queue.then(
            this.dialog.runAction(actionId, this, input)
        );
    }

    checkIntent(intentId) {
        return this.dialog.checkIntent(intentId, this);
    }

    next() {
        const state = this.state[this.state.length-1];
        const subStateCount = this.dialog.getSubStateCount(this.getState());

        state[1] = (state[1] + 1) % subStateCount;
    }

    endDialog() {
        this.done = true;
    }

    _getStateArray() {
        if (this.context.state === undefined) {
            return [['base', 0]];
        }

        let state = this.context.state.split('/').slice(1);
        for (let i = 0; i < state.length; ++i) {
            state[i] = state[i].split('?');
            state[i][1] = parseInt(state[i][1]);
        }

        return state;
    }

    _setStateArray(array) {
        let state = "";

        for (let i = 0; i < array.length; ++i) {
            state += `/${array[i][0]}?${array[i][1]}`;
        }

        return state;
    }

    _processResults() {
        this.result = [];

        for (let i = 0; i < this._results.length; ++i) {
            this.result.push(
                this.dialog.getString(this._results[i], this.getVariables())
            );
        }
    }
};
