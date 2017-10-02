import * as DynamoDBProvider from './pairs-dynamodb-provider';
import * as InMemoryProvider from './pairs-inmemory-provider';

import log from '../lib/logger-service';

let db = null;

module.exports = class Pairs {
  constructor() {
    if (db != null) {
      this.db = db;
      return;
    }

    log.debug('Initializing Pairs-provider');

    // Use in-memory db when running in local client (npm run bot-client)
    this.db = db = (process.env.RUN_ENV === 'dev') ?
        new InMemoryProvider() :
        new DynamoDBProvider();
  }

  /**
   * @param {string} id Session ID
   * @return {Promise<string[]>}
   */
  read(id) {
    return this.db.read(id);
  }

  write(id, pairs) {
    return this.db.write(id, pairs);
  }

  createPair(id1, id2) {
    const promises = [];

    promises.push(
      this.read(id1)
          .then((pairs) => this.write(id1, pairs.concat([id2])))
    );
    promises.push(
      this.read(id2)
          .then((pairs) => this.write(id2, pairs.concat([id1])))
    );

    return Promise.all(promises);
  }

  breakPair(id1, id2) {
    const promises = [];

    // create a copy of array arr without the item obj
    const without = (arr, obj) => arr.filter((el) => el !== obj);

    promises.push(
      this.read(id1)
          .then((pairs) => this.write(id1, without(pairs, id2)))
    );
    promises.push(
      this.read(id2)
          .then((pairs) => this.write(id2, without(pairs, id1)))
    );

    return Promise.all(promises);
  }
};
