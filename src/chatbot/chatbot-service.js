import log from '../lib/logger-service';

module.exports = class Chatbot {
  /**
   * @param {Builder} dialog
   * @param {Sessions} sessions
   */
  constructor(dialog, sessions) {
    this._dialog = dialog;
    this._sessions = sessions;
  }

  /**
   * Process an incoming message
   * @param {string} sessionId Session ID for the message recipient
   * @param {string} text The message received
   * @return {Array<{message: string, quickReplies: Array}>} Response messages
   */
  receive(sessionId, text) {
    return this._sessions.read(sessionId)
      .then((context) => {
        log.info('Context retrieved: {0}', JSON.stringify(context));
        return context;
      })
      .catch((err) => {
        log.error(err.message.toString());
        return {};
      })
      .then((context) => {
        return this._dialog.run(
          sessionId,
          context,
          text
        );
      })
      .then((session) => {
        log.info('Writing context: {0}', JSON.stringify(session.context));
        this._sessions.write(sessionId, session.context);
        return session.getResult();
      })
      .catch((err) => {
        log.error(err.stack);
        return [`## ERROR: ${err} ##`];
      });
  }
};
