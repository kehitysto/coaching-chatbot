import * as DynamoDBProvider from './feedback-dynamodb-provider';
import * as InMemoryProvider from './feedback-inmemory-provider';

import log from '../lib/logger-service';

let db = null;

module.exports = class Feedback {
  constructor() {
    if (db != null) {
      this.db = db;
      return;
    }

    log.debug('Initializing Feedback-provider');

    // Use in-memory db when running in local client (npm run bot-client)
    this.db = db = (process.env.RUN_ENV === 'dev') ?
        new InMemoryProvider() :
        new DynamoDBProvider();
  }

  createFeedback({ giver, pair, feedback }) {
    return this.db.write({ date: new Date(), giver, pair, feedback });
  }
};
