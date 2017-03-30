import log from '../lib/logger-service';

module.exports = class Chatbot {
  constructor(dialog, sessions) {
    this._dialog = dialog;
    this._sessions = sessions;
  }

  receive(sessionId, text) {
    return this._sessions.read(sessionId)
      .then((context) => {
        log.info('Context retrieved: {0}', JSON.stringify(context));
        return context;
      })
      .catch((err) => {
        console.error(err.message.toString());
        return {};
      })
      .then((context) => {
        return this._dialog.run(
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
