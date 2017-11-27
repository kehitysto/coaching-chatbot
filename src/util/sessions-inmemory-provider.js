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
    let date = this.getCurrentDateWithOffset();
    let hour = ('0' + date.getHours()).substr(-2, 2);

    return this.filterSessions(date, hour);
  }

  readAllWithFeedbacks() {
    log.silly('Getting all sessions with feedbacks');
    let date = this.getCurrentDateWithOffset(6);
    let hour = ('0' + ((date.getHours() + 23) % 24)).substr(-2, 2);

    return this.filterSessions(date, hour);
  }

  getCurrentDateWithOffset(daysOff = 0) {
    let d = new Date();
    // UTC + 2 -> Suomen aika
    return new Date(d.getTime() +
      (d.getTimezoneOffset() + 120 + daysOff * 24 * 60) * 60 * 1000);
  }

  filterSessions(date, hour) {
    let sessions = [];
    for (let sessionId in this.db) {
      if (!{}.hasOwnProperty.call(this.db, sessionId)) continue;
      log.silly('Evaluating session with id: ', sessionId);
      let context = this.db[sessionId];

      const day = context.weekDay;
      if (day === undefined) continue;
      let meetingDay = strings['@WEEKDAYS'].indexOf(day.toUpperCase());
      if (meetingDay == date.getDay()) {
        if (('0' + context.time).substr(-5, 2) == hour) {
          log.silly('Found context with id: ', sessionId);
          sessions.push( { 'id': sessionId, 'context': context } );
        }
      }
    }
    return Promise.resolve(sessions);
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

      let context = this.db[id];
      if (!context || !context.communicationMethods) return resolve([]);

      let notIn = (prop, content) => !prop || !prop.includes(content);
      let someCommon = (a, b) => Object.keys(a || {})
            .some((method) => Object.keys(b || {}).includes(method));

      resolve(Object.keys(this.db).filter((pairId) => {
          log.silly('Evaluating possible pair {0}', pairId);
          let pair = this.db[pairId];
          return id != pairId && pair.searching === true &&
            notIn(pair.pairRequests, id) &&
            notIn(pair.rejectedPeers, id) &&
            someCommon(pair.communicationMethods, context.communicationMethods);
        }).map((pairId) => ({ id: pairId })));
    });
  }

  dump() {
    return this.db;
  }

  load(data) {
    this.db = data;
  }
};
