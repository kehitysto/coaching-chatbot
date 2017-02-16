module.exports = class Session {
    constructor(context) {
        this.context = context;

        this.result = [];
        this.done = false;
    }

    start() {
        this.state = this.getStateArray();

        return this;
    }

    finalize() {
        this.context.state = this.setStateArray(this.state);

        return this;
    }

    getStateArray() {
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

    setStateArray(array) {
        let state = "";

        console.log(array);
        for (let i = 0; i < array.length; ++i) {
            state += `/${array[i][0]}?${array[i][1]}`;
            console.log(state);
        }

        return state;
    }

    getState() {
        return this.state[this.state.length-1][0];
    }

    pushState(state) {
        this.state.append([state, 0]);
    }

    popState() {
        if (this.state.length > 1) {
            this.state.pop();
        } else {
            this.state[0] = ['base', 0];
        }
    }

    switchState(newState) {
        this.state[state.length-1] = [newState, 0];
    }

    getSubState() {
        return this.state[this.state.length-1][1];
    }

    setSubState(substate) {
        this.state[this.state.length-1][1] = substate;
    }

    addResult() {
        this.result.push(
            Array.prototype.slice.apply(arguments)
        );
    }

    endDialog() {
        this.done = true;
    }

    getResult() {
        return this.result;
    }

    getContext() {
        return this.context;
    }
};
