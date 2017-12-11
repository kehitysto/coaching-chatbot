import log from '../lib/logger-service';
import PersonalInformationFormatter
 from '../lib/personal-information-formatter-service';
import CommunicationMethodsFormatter
 from '../lib/communication-methods-formatter';

module.exports = class Session {
  constructor(dialog) {
    this.dialog = dialog;

    this.id = null;
    this.context = null;
    this.userData = null;

    this.result = null;

    this._input = null;
    this._queue = null;
    this._state = [];
    this._results = [];
    this._done = false;
  }

  /**
   * Start a new dialog
   * @param {string} dialogId ID of the new dialog to start
   * @param {boolean} inPlace do not progress dialog on returning
   */
  beginDialog(dialogId, inPlace = false) {
    if (dialogId.startsWith('/')) {
      dialogId = dialogId.substr(1);
    }

    for (let i = 0; i < this._state.length; ++i) {
      if (this._state[i][0] === dialogId) {
        throw new Error('Recursive state tree');
      }
    }

    if (!inPlace) this.next();
    this._state.push([dialogId, 0]);
  }

  /**
   * End execution of the current dialog, and return control to parent
   */
  endDialog() {
    if (this._state.length > 1) {
      this._state.pop();
    } else {
      this._state[0] = ['', 0];
    }
  }

  /**
   * Restart the current dialog from the beginning
   */
  resetDialog() {
    this._state[this._state.length - 1][1] = 0;
  }

  /**
   * Switch execution to a different dialog
   * Replaces the top level of the dialog stack with the new dialog,
   *  control will be returned to current parent when
   *  endDialog() is called.
   * @param {string} dialogId ID of the dialog to switch to
   */
  switchDialog(dialogId) {
    if (dialogId.startsWith('/')) {
      dialogId = dialogId.substr(1);
    }

    this._state[this._state.length - 1] = [dialogId, 0];
  }

  /**
   * Completely reset the dialog stack
   * Control will return to the beginning of the '/' dialog.
   */
  clearState() {
    this._state = [
      ['', 0],
    ];
  }

  /**
   * Add a response to give to the user
   * @param {string} templateId ID of the string template to use
   * @param {Array<{title: string, payload: string}>} quickReplies
   */
  addResult(templateId, quickReplies = []) {
    this._queueFunction(() => this._addResult(templateId, quickReplies));
  }

  _addResult(templateId, quickReplies = []) {
    let template = this.dialog.getStringTemplate(templateId);

    this._send(template, quickReplies);

    if (quickReplies.length !== 0) {
      this.addQuickReplies(quickReplies);
    }
  }

  /**
   * @param {Array<{title: string, payload: string}>} quickReplies
   */
  addQuickReplies(quickReplies) {
    this._queueFunction(() => this._addQuickReplies(quickReplies));
  }

  _addQuickReplies(quickReplies) {
    if (this._results.length <= 0) return;

    log.debug('Adding quick replies: {0}', JSON.stringify(quickReplies));
    for (let quickReply of quickReplies) {
      if (quickReply.title !== undefined) {
        let quickReplyTemplate =
          this.dialog.getStringTemplate(quickReply.title);
        quickReply.title = quickReplyTemplate;
      }
    }

    this._results[this._results.length - 1].quickReplies = quickReplies;
  }

  /**
   * Add a response to give to the user
   * @param {string} message The message to send to the user
   * @param {Array<{name: string, payload: string}>} quickReplies
   */
  send(message, quickReplies = []) {
    this._queueFunction(() => this._send(message, quickReplies));
  }

  _send(message, quickReplies = []) {
    log.debug('Adding result: {0}', message);
    this._results.push({
      message,
      quickReplies,
    });
  }

  /**
   * @param {Array<string>|string} actionArr ID(s) of actions to be run
   * @param {string} input Optional input to use instead of user message
   */
  runActions(actionArr, input = null) {
    if (!Array.isArray(actionArr)) {
      actionArr = [actionArr];
    }

    for (let i = 0; i < actionArr.length; ++i) {
      this._queueFunction(
        () => this.dialog.runAction(actionArr[i], this, input)
      );
    }
  }

  /**
   * Skip to the next substate of the current dialog
   */
  next() {
    const state = this._state[this._state.length - 1];
    const subStateCount = this.dialog.getSubStateCount(this.stateId);

    state[1] = (state[1] + 1) % subStateCount;
  }

  /**
   * Return to the previous substate of the current dialog
   */
  prev() {
    const state = this._state[this._state.length - 1];
    const subStateCount = this.dialog.getSubStateCount(this.stateId);

    state[1] = (state[1] > 0) ? state[1] - 1 : subStateCount - 1;
  }

  /**
   * Start processing a new message by user
   * @param {string} sessionId The id for the current session
   * @param {Context} context The current conversation context
   * @param {string} input The message sent by the user
   * @return {Session}
   */
  _start(sessionId, context, input) {
    log.debug('Starting session...');

    this.id = sessionId;
    this.context = context;
    this.userData = {};

    this._state = this._getStateArray();
    delete this.context.state;

    this._input = input;
    this._queue = Promise.resolve();
    this._results = [];
    this._done = false;

    return this;
  }

  /**
   * End processing a new message by user
   * @return {Session}
   */
  _finalize() {
    log.debug('Finalizing session...');
    this.context.state = this._setStateArray(this._state);
    return this;
  }

  get runQueue() {
    return this._queue;
  }

  getInput() {
    return this._input;
  }

  set input(newInput) {
    this._input = newInput;
  }

  get context() {
    return this._context;
  }

  set context(newContext) {
    this._context = newContext;
  }

  getUserData() {
    return this.userData;
  }

  setUserData(userData) {
    this.userData = userData;
  }

  getVariables() {
    log.debug('Building variable state...');
    log.debug('context: {0}', JSON.stringify(this.context));
    log.debug('userData: {0}', JSON.stringify(this.userData));

    return {
      ...this.context,
      ...this.userData,
    };
  }

  getResult() {
    let result = [];
    let variables = this.getVariables();

    for (let i = 0; i < this._results.length; ++i) {
      let {
        message,
        quickReplies,
      } = this._results[i];
      message = PersonalInformationFormatter.format(message, variables);
      result.push({
        message,
        quickReplies,
      });
    }

    return result;
  }

  get stateId() {
    return this._state[this._state.length - 1][0];
  }

  get subStateId() {
    return this._state[this._state.length - 1][1];
  }

  checkIntent(intentId) {
    return this.dialog.checkIntent(intentId, this);
  }

  _queueFunction(fn) {
    this._queue = this._queue.then(() => fn());
  }

  _getStateArray() {
    if (this.context.state === undefined) {
      return [
        ['', 0],
      ];
    }

    let state = this.context.state.split('/')
      .slice(1);
    for (let i = 0; i < state.length; ++i) {
      state[i] = state[i].split('?');
      state[i][1] = parseInt(state[i][1]);
    }

    return state;
  }

  _setStateArray(array) {
    let state = '';

    for (let i = 0; i < array.length; ++i) {
      state += `/${array[i][0]}?${array[i][1]}`;
    }

    return state;
  }

  getAvailablePeersCount() {
    return this.context.availablePeers.length;
  }

  getCommunicationMethodsCount() {
    let m = this.context.communicationMethods;
    return m === undefined ? 0 : Object.keys(m).length;
  }

  getPairRequestCount() {
    return this.context.pairRequests ? this.context.pairRequests.length : 0;
  }

  getSentRequestCount() {
    return this.context.sentRequests ? this.context.sentRequests.length : 0;
  }

  allCommunicationMethodsFilled() {
    return CommunicationMethodsFormatter.getCommunicationMethods(this.context)
      .length === 0;
  }

  ifFacilitationSet() {
    let d = this.context.weekDay;
    let t = this.context.time;
    return (d === undefined || t === undefined);
  }

  isSearching() {
    return this.context.searching;
  }

  areRemindersEnabled() {
    return this.context.remindersEnabled;
  }

  hasPair() {
    return this.context.hasPair;
  }

  // Messenger max length for messages is 640 characters
  validInput(maxLength) {
    return this.getInput().length <= maxLength;
  }
};
