import log from '../lib/logger-service';
import * as strings from '../coaching-chatbot/strings.json';

module.exports = class InMemoryProvider {
  constructor() {
    this.db = {};
  }

  read(sessionId) {
    log.silly('DB contents: {0}', JSON.stringify(this.db));
    if (this.db[sessionId] === undefined) {
      this.db[sessionId] = {};
    }

    log.silly('Retrieved context for {0}: {1}',
        sessionId, JSON.stringify(this.db[sessionId]));
    return Promise.resolve(this.db[sessionId]);
  }

  readAll() {
    log.silly('DB contents: {0}', JSON.stringify(this.db));
    return this.db;
  }

  readAllWithReminders() {
    log.silly('Getting all sessions with reminders');
    return new Promise((resolve, reject) => {
      let sessions = [];

      for (let sessionId in this.db) {
        if (!{}.hasOwnProperty.call(this.db, sessionId)) continue;
        log.silly('Evaluating session with id: ', sessionId);
        let context = this.db[sessionId];

        const day = context.weekDay;
        if(day === undefined) continue;
        let meetingDay = strings['@DAYS'].indexOf(day.toUpperCase());
        if (meetingDay == new Date().getDay()) {
          log.silly('Found context with id: ', sessionId);
          sessions.push({'Id': sessionId, 'context': context});
        }
      }

      resolve(sessions);
    });
  }

  write(sessionId, context) {
    this.db[sessionId] = context;

    log.silly('Writing context for {0}: {1}',
        sessionId, JSON.stringify(this.db[sessionId]));
    return Promise.resolve(this.db[sessionId]);
  }

  getAvailablePairs(id) {
    return new Promise((resolve, reject) => {
      log.silly('Id: {0}', id);

      let pairs = [];

      for (let sessionId in this.db) {
        if (!{}.hasOwnProperty.call(this.db, sessionId)) continue;

        log.silly('Evaluating possible pair {0}', sessionId);
        if (sessionId == id) continue;
        let session = this.db[sessionId];

        if (session.searching === true &&
            (!session.pairRequests || !session.pairRequests.includes(id)) &&
            (!session.rejectedPeers || !session.rejectedPeers.includes(id))) {
          log.silly('Found a valid pair!');
          pairs.push({ id: sessionId });
        }
      }

      resolve(pairs);
    });
  }

  dump() {
    return this.db;
  }

  load(data) {
    this.db = data;
  }
};
