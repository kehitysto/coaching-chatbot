import AWS from 'aws-sdk';

import log from '../lib/logger-service';

module.exports = class Sessions {
  constructor() {
    this.SESSION_TABLE =
      `${process.env.SERVERLESS_PROJECT}` +
      `-sessions-${process.env.SERVERLESS_STAGE}`;
    this.db = new AWS.DynamoDB.DocumentClient();
  }

  read(id) {
    return new Promise((resolve, reject) => {
      const params = {
        Key: {
          id,
        },
        TableName: this.SESSION_TABLE,
        ConsistentRead: true,
      };

      this.db.get(params, (err, data) => {
        if (err) {
          console.error(err.toString());
          return reject(err);
        }

        log.info('db read: {0}', JSON.stringify(data));

        if (data.Item !== undefined) {
          return resolve(data.Item.context);
        } else {
          // return an empty context for new sessions
          return resolve({});
        }
      });
    });
  }

  write(id, context) {
    return new Promise((resolve, reject) => {
      if (!id) {
        return reject(new TypeError('No session ID'));
      }

      // coerce session id to string
      id = id + '';

      const params = {
        TableName: this.SESSION_TABLE,
        Item: {
          id,
          context,
        },
      };

      log.info('db write: {0}', JSON.stringify(context));

      this.db.put(params, (err, data) => {
        if (err) {
          log.error(err.toString());
          return reject(err);
        }

        return resolve(context);
      });
    });
  }

  getAvailablePairs() {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: this.SESSION_TABLE,
        Limit: 50,
        FilterExpression: 'searching = true',
      };

      this.db.scan(params, (err, data) => {
        if (err) {
          log.error(err.toString());
          return reject(err);
        }

        log.debug('Users searching for pair: {0}', JSON.stringify(data.Items));

        return resolve(data.Items);
      });
    });
  }
};
