module.exports = class InMemoryProvider {
  constructor() {
    this.db = {};
  }

  read(sessionId) {
    if (this.db[sessionId] === undefined) {
      this.db[sessionId] = {};
    }
    return Promise.resolve(this.db[sessionId]);
  }

  write(sessionId, context) {
    this.db[sessionId] = context;
    return Promise.resolve(this.db[sessionId]);
  }

  getAvailablePairs(meetingFrequency) {
    return new Promise((resolve, reject) => {
      let pairs = [];
      for (let sessionId in this.db) {
        if (this.db[sessionId]['searching'] === true &&
            this.db[sessionId]['meetingFrequency'] == meetingFrequency) {
          pairs.push(this.db[sessionId]);
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
