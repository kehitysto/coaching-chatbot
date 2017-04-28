import log from '../lib/logger-service';

module.exports = class InMemoryProvider {
  constructor() {
    this.db = {};
  }

  read(userId) {
    log.silly('DB contents: {0}', JSON.stringify(this.db));
    if (this.db[userId] === undefined) {
      this.db[userId] = [];
    }

    log.silly('Retrieved pairs for {0}: {1}',
        userId, JSON.stringify(this.db[userId]));
    return Promise.resolve(this.db[userId]);
  }

  write(userId, pairs) {
    this.db[userId] = pairs;

    log.silly('Writing pairs for {0}: {1}',
        userId, JSON.stringify(this.db[userId]));
    return Promise.resolve(this.db[userId]);
  }

  dump() {
    return this.db;
  }

  load(data) {
    this.db = data;
  }
};
