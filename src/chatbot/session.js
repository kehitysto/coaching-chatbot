module.exports = class Session {
    constructor(dialog) {
        this.dialog = dialog;
        this.context = null;
        this.input = null;

        this.result = null;

        this._results = [];
        this._done = false;
    }

    start(context, input) {
        this.context = context;
        this.input = input;

        this.state = this._getStateArray();
        delete this.context.state;

        this._results = [];
        this._done = false;

        return this;
    }

    finalize() {
        this.context.state = this._setStateArray(this.state);

        this._processResults();

        return this;
    }

    getInput() {
        return this.input;
    }

    getContext() {
        return this.context;
    }

    getResult() {
        return this.result;
    }

    getState() {
        return this.state[this.state.length-1][0];
    }

    pushState(state) {
        if (state.startsWith('/')) {
            state = state.substr(1);
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
            newState = stateId.substr(1);
        }

        this.state[this.state.length-1] = [newState, 0];
    }

    getSubState() {
        return this.state[this.state.length-1][1];
    }

    addResult() {
        this._results.push(
            Array.prototype.slice.apply(arguments)
        );
    }

    runAction(actionId) {
        return this.dialog.runAction(actionId, this)
            .then(context => this.context = context);
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
                this.dialog.getString(this._results[i], this.context)
            );
        }
    }
};
