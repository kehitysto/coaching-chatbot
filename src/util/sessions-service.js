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
    this.db = db = (process.env.RUN_ENV === 'dev') ?
        new InMemoryProvider() :
        new DynamoDBProvider();
  }

  read(id) {
    return this.db.read(id);
  }

  write(id, context) {
    return this.db.write(id, context);
  }

  getAvailablePairs(id, meetingFrequency) {
    return this.db.getAvailablePairs(id, meetingFrequency);
  }

  addPairRequest(id, sessionId) {
    return this.db.read(id).then((context) => {
      const pairRequests = context.pairRequests || [];
      return this.db.write(id, {
        ...context,
        pairRequests: [
          ...pairRequests,
          sessionId,
        ],
      });
    });
  }
};
