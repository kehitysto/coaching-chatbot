import * as DynamoDBProvider from './sessions-dynamodb-provider';
import * as InMemoryProvider from './sessions-inmemory-provider';

import log from '../lib/logger-service';

let db = null;

module.exports = class Sessions {
  constructor() {
    if (db != null) {
      this.db = db;
      return;
    }

    log.debug('Initializing Sessions-provider');

    // Use in-memory db when running in local client (npm run bot-client)
    this.db = db = (process.env.RUN_ENV === 'dev') ?
        new InMemoryProvider() :
        new DynamoDBProvider();
  }

  /**
   * @param {string} id Session ID
   * @return {Promise<Context>}
   */
  read(id) {
    return this.db.read(id);
  }

  readAll() {
    return this.db.readAll();
  }

  readAllWithReminders() {
    return this.db.readAllWithReminders();
  }

  readAllWithFeedbacks() {
    return this.db.readAllWithFeedbacks();
  }

  write(id, context) {
    return this.db.write(id, context);
  }

  getAvailablePairs(id) {
    return this.db.getAvailablePairs(id);
  }
};
