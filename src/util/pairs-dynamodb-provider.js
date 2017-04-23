import AWS from 'aws-sdk';

import log from '../lib/logger-service';

module.exports = class DynamoDBProvider {
  constructor() {
    this.PAIRS_TABLE =
      `${process.env.SERVERLESS_PROJECT}` +
      `-pairs-${process.env.SERVERLESS_STAGE}`;

    if (typeof AWS.config.region !== 'string') {
      log.warning('No region found, defaulting to us-east-1');
      AWS.config.update({ region: 'us-east-1' });
    }

    this.db = new AWS.DynamoDB.DocumentClient();
  }

  read(id) {
    return new Promise((resolve, reject) => {
      const params = {
        Key: {
          id,
        },
        TableName: this.PAIRS_TABLE,
        ConsistentRead: true,
      };

      this.db.get(params, (err, data) => {
        if (err) {
          console.error(err.toString());
          return reject(err);
        }

        log.info('db read: {0}', JSON.stringify(data));

        if (data.Item !== undefined) {
          return resolve(data.Item.pairs);
        } else {
          // return an empty pairs list for new sessions
          return resolve([]);
        }
      });
    });
  }

  write(id, pairs) {
    return new Promise((resolve, reject) => {
      if (!id) {
        return reject(new TypeError('No session ID'));
      }

      // coerce session id to string
      id = id + '';

      const params = {
        TableName: this.PAIRS_TABLE,
        Item: {
          id,
          pairs,
        },
      };

      log.info('db write: {0}', JSON.stringify(pairs));

      this.db.put(params, (err, data) => {
        if (err) {
          log.error(err.toString());
          return reject(err);
        }

        return resolve(pairs);
      });
    });
  }
};
