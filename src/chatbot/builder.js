import log from '../lib/logger-service';

import Session from './session';

class Builder {
  constructor(strings, maxSteps = 5) {
    this.maxSteps = maxSteps;

    this._tree = {};
    this._match = {};
    this._intents = {};
    this._actions = {};

    this._strings = strings;
  }

  /**
   * Register a dialog with the bot
   * @param {string} stateId
   * @param {Array<Function>|function(Session, string)} substates
   * @param {Array} intents
   * @return {Builder}
   */
  dialog(stateId, substates, intents = []) {
    if (stateId.startsWith('/')) {
      stateId = stateId.substr(1);
    }

    log.debug('Registering state /{0}', stateId);
    this._tree[stateId] = {
      intents,
      substates,
    };

    return this;
  }

  /**
   * Register an intent with the bot
   * @param {string} intentId ID for the intent
   * @param {Array} intentObj Implementation of the intent
   * @return {Builder}
   */
  intent(intentId, intentObj) {
    if (intentId.startsWith('#')) {
      intentId = intentId.substr(1);
    }

    log.debug('Registering intent {0}', intentId);
    this._intents[intentId] = intentObj;

    return this;
  }

  match(intentId, fn) {
    log.debug('Registering a global intent {0}', intentId);
    this._match[intentId] = fn;
  }

  /**
   * Register an action with the bot
   * @param {string} actionId ID for the action
   * @param {function({context, userData, input})} fn
   *  Implementation of the action
   * @return {Builder}
   */
  action(actionId, fn) {
    log.debug('Registering action {0}', actionId);
    this._actions[actionId] = fn;

    return this;
  }

  run(context, input) {
    log.info('Running bot for input "{0}"', input);

    const session = new Session(this)
      ._start(context, input);

    return this._runIntents(session, input)
      .then(() => this._runStep(0, session, input))
      .then(() => session._finalize());
  }

  runAction(actionId, session, input = null) {
    log.info('Running action {0}', actionId);

    if (this._actions[actionId] === undefined) {
      return Promise.reject(new Error(`No such action: ${actionId}`));
    }

    const actionData = {
      context: session.context,
      userData: session.getUserData(),
      input: input || session.getInput(),
    };
    const promise = Promise.resolve(this._actions[actionId](actionData))
      .then((result) => {
        log.silly('Action result: {0}', JSON.stringify(result));
        if (result.context) {
          log.debug('Updating context: {0}', JSON.stringify(result.context));
          session.context = result.context;
        }
        if (result.userData) {
          log.debug('Updating userData: {0}', JSON.stringify(result.userData));
          session.setUserData(result.userData);
        }
        if (result.result) {
          log.silly('Adding result from action: {0}',
              JSON.stringify(result.result));
          session.addResult(result.result);
        }
      })
      .catch((err) => log.error('Action failed!!!\n{0}', err.stack));

    return promise;
  }

  checkIntent(intentId, session) {
    const input = session.getInput();
    if (intentId.startsWith('#')) {
      intentId = intentId.substr(1);
    }

    const match = this._runIntent(intentId, input);
    log.debug('Intent {0} on input "{1}" returned {2}', intentId, input,
      match);

    return match || false;
  }

  getStringTemplate(templateId) {
    log.debug('Retrieving string template {0}', templateId);

    let template = this._strings[templateId];
    if (Array.isArray(template)) {
      template = template[Math.floor(Math.random() * template.length)];
    }
    return (template === undefined) ? templateId : template;
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
        input = input.substr(match[0].length)
          .trim();
        log.silly('Trimmed input after match: "{0}"', input);
      }
    }

    return match;
  }

  _matchIntent(intentObj, input) {
    let ret;
    if (typeof intentObj === 'string') {
      ret = this._runIntent(intentObj, input);
    } else {
      log.silly('Matching intent {0} against input "{1}"',
        intentObj.toString(), input);
      ret = intentObj.exec(input);
    }

    log.silly('Intent returned {0}', ret);

    return ret;
  }

  _runIntent(intentId, input) {
    if (intentId.startsWith('#')) {
      intentId = intentId.substr(1);
    }

    if (this._intents[intentId] === undefined) {
      log.error('Intent not found: {0}', intentId);
      return null;
    }

    log.debug('Running intent {0}', intentId);

    const intent = this._intents[intentId];
    let result = null;

    if (intent.any !== undefined) {
      log.silly('Matching strategy: any');
      result = this._matchIntentAny(intent.any, input);
    } else if (intent.each !== undefined) {
      log.silly('Matching strategy: each');
      result = this._matchIntentEach(intent.each, input);
    } else {
      throw new Error(`Intent ${intentId}: any or each must be defined`);
    }

    if (result === null) {
      return null;
    } else {
      if (intent.match !== undefined) {
        log.debug('Running function for intent {0}', intentId);
        result = intent.match(result);
      }

      return result;
    }
  }

  _runIntents(session, input) {
    return new Promise((resolve, reject) => {
      log.silly('Running global intents');

      for (let match in this._match) {
        if (this.checkIntent(match, session) === false) continue;
        this._match[match](session, input);
        return resolve();
      }

      const states = session._state;

      let i = states.length - 1;

      log.silly('Running intents for state /{0}', states[i][0]);

      if (this._tree[states[i][0]] === undefined) {
        session.clearState();
        log.error('No such dialog: {0}', states[i][0]);
        return resolve();
      }

      let intents = this._tree[states[i][0]].intents;

      for (let j = 0; j < intents.length; ++j) {
        let match = this.checkIntent(intents[j][0], session);

        if (match !== false) {
          intents[j][1](session, match);
          return resolve();
        }
      }

      return resolve();
    });
  }

  _runStep(step, session, input) {
    log.silly('Running iteration {0}', step);

    return new Promise((resolve, reject) => {
      if (step > this.maxSteps) {
        return reject(new Error('Too many iterations'));
      }

      const state = session.stateId;

      if (this._tree[state] !== undefined) {
        const substate = session.subStateId;

        log.debug('Running state /{0}?{1}', state, substate);

        this._tree[state].substates[substate](session, input);

        return resolve(
          session.runQueue()
              .then(() => {
                log.silly('Iteration {0} completed', step);
                if (session.stateId !== state ||
                  session.subStateId !== substate) {
                  return this._runStep(step + 1, session, input);
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
}
module.exports = Builder;

Builder.QuickReplies = {
  create(title, payload) {
    return {
      title,
      payload: (payload === undefined) ? title : payload,
    };
  },
};
