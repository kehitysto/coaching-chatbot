import log from '../lib/logger-service';

module.exports = class InMemoryProvider {
  constructor() {
    this.db = {};
  }

  read(sessionId) {
    if (this.db[sessionId] === undefined) {
      this.db[sessionId] = {};
    }

    log.silly('Retrieved context for {0}: {1}',
        sessionId, JSON.stringify(this.db[sessionId]));
    return Promise.resolve(this.db[sessionId]);
  }

  write(sessionId, context) {
    this.db[sessionId] = context;

    log.silly('Writing context for {0}: {1}',
        sessionId, JSON.stringify(this.db[sessionId]));
    return Promise.resolve(this.db[sessionId]);
  }

  getAvailablePairs(id, meetingFrequency) {
    return new Promise((resolve, reject) => {
      log.silly('Id: {0}; Frequency: {1}', id, meetingFrequency);

      let pairs = [];

      for (let sessionId in this.db) {
        if (!{}.hasOwnProperty.call(this.db, sessionId)) continue;

        log.silly('Evaluating possible pair {0}', sessionId);
        if (sessionId === id) continue;
        if (this.db[sessionId]['searching'] === true &&
            this.db[sessionId]['meetingFrequency'] === meetingFrequency) {
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
