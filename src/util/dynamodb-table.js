import * as AWS from 'aws-sdk';

import log from '../lib/logger-service';

module.exports = class DynamoDBTable {
  constructor(tableName) {
    this.NAME = tableName;
    this.TABLE =
      `${process.env.SERVERLESS_PROJECT}` +
      `-${tableName}-` +
      `${process.env.SERVERLESS_STAGE}`;

    if (typeof AWS.config.region !== 'string') {
      log.warning('No region found, defaulting to us-east-1');
      AWS.config.update({ region: 'us-east-1' });
    }

    this.db = new AWS.DynamoDB.DocumentClient();
  }

  /**
   * Read an item from DynamoDB
   * @param {Object} key The key object to pass to DynamoDB, see DynamoDB API
   * @return {Promise}
   */
  get(key) {
    return new Promise((resolve, reject) => {
      const params = {
        Key: { ...key },
        TableName: this.TABLE,
        ConsistentRead: true,
      };

      this.db.get(params, (err, data) => {
        if (err) {
          console.error(err.toString());
          return reject(err);
        }

        log.info('db read ({0}): {1}', this.NAME, JSON.stringify(data));

        return resolve(data.Item);
      });
    });
  }

  /**
   * Write an item to DynamoDB
   * @param {Object} key The key object to pass to DynamoDB, see DynamoDB API
   * @param {Object} data The data fields of the object to write
   * @return {Promise}
   */
  put(key, data = {}) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: this.TABLE,
        Item: {
          ...key,
          ...data,
        },
      };

      log.info('db write: {0}', JSON.stringify(params));

      this.db.put(params, (err, result) => {
        if (err) {
          log.error(err.toString());
          return reject(err);
        }

        return resolve(data);
      });
    });
  }


  /**
   * Scan DynamoDB contents according to params
   * @param {Object} params DynamoDB scan params, see DynamoDB API
   * @return {Promise}
   */
  scan(params) {
    return new Promise((resolve, reject) => {
      log.silly('db scan ({0}): {1}', this.NAME, JSON.stringify(params));

      this.db.scan(
        { TableName: this.TABLE, ...params },
        (err, data) => {
          if (err) {
            log.error(err.toString());
            return reject(err);
          }

          return resolve(data.Items);
        }
      );
    });
  }
};
