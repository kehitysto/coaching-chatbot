import log from '../lib/logger.service';

module.exports = class Chatbot {
  constructor(dialog, sessions) {
    this._dialog = dialog;
    this._sessions = sessions;
  }

  receive(sessionId, text) {
    return this._sessions.read(sessionId)
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
      });
  }
};
