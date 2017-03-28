import DynamoDBProvider from './sessions-dynamodb-provider';
import InMemoryProvider from './sessions-inmemory-provider';

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
    if (process.env.RUN_ENV === 'dev') {
      this.db = db = new InMemoryProvider();
    } else {
      this.db = db = new DynamoDBProvider();
    }
  }

  read(id) {
    return this.db.read(id);
  }

  write(id, context) {
    return this.db.write(id, context);
  }

  getAvailablePairs() {
    return this.db.getAvailablePairs();
  }
};
