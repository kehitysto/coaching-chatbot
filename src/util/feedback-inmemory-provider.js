import log from '../lib/logger-service';

module.exports = class InMemoryProvider {
  constructor() {
    this.db = [];
  }

  write(row) {
    return new Promise((resolve, reject) => {
        const { date, giver, pair, feedback } = row;
        if (!date || !giver || !pair || !feedback || !feedback.length) {
            return reject(new Error('Missing feedback parameters!'));
        }

        this.db.push(row);

        log.debug('FeedbackDB: ' + JSON.stringify(this.db));

        return resolve(row);
    });
  }

  dump() {
    return this.db;
  }

  load(data) {
    this.db = data;
  }
};
