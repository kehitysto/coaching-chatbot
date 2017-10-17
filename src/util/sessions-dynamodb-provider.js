import log from '../lib/logger-service';
import * as DynamoDBTable from './dynamodb-table';
import * as strings from '../coaching-chatbot/strings.json';

module.exports = class DynamoDBProvider {
  constructor() {
    this.table = new DynamoDBTable('sessions');
  }

  read(id) {
    return this.table.get({ id })
        .then((result) => (result !== undefined) ? result.context : {});
  }

  readAll() {
    const params = {};

    return this.table.scan(params).then((items) => {
      log.debug('Getting all sessions. ' + JSON.stringify(items));
      return items;
    });
  }

  readAllWithReminders() {
    let currentDay = strings['@DAYS'][new Date().getDay()].toUpperCase();

    const params = {
      Limit: 50,
      FilterExpression: 'context.weekDay = :currentDay',
      ExpressionAttributeValues: {
        ':currentDay': currentDay,
      },
    };

    return this.table.scan(params).then((items) => {
      log.debug('Sessions with reminder: ' + JSON.stringify(items));
      return items;
    });
  }

  readAllWithFeedbacks() {
    let currentDay = strings['@DAYS']
      [(new Date().getDay() - 2) % 7].toUpperCase();

    const params = {
      Limit: 50,
      FilterExpression: 'context.weekDay = :currentDay',
      ExpressionAttributeValues: {
        ':currentDay': currentDay,
      },
    };

    return this.table.scan(params).then((items) => {
      log.debug('Sessions with feedback: ' + JSON.stringify(items));
      return items;
    });
  }

  write(id, context) {
    return new Promise((resolve, reject) => {
      if (!id) {
        return reject(new TypeError('No session ID'));
      }

      // coerce session id to string
      id = id + '';

      return resolve(
        this.table.put({ id }, { context })
            .then(({ context }) => context)
      );
    });
  }

  getAvailablePairs(id) {
    const params = {
      Limit: 50,
      FilterExpression: 'context.searching = :true AND ' +
                        '(NOT id = :id) AND ' +
                        '(NOT contains(context.pairRequests, :id)) AND ' +
                        '(NOT contains(context.rejectedPeers, :id))',
      ExpressionAttributeValues: { ':true': true,
                                   ':id': id },
      ProjectionExpression: 'id',
    };

    return this.table.scan(params).then((items) => {
      log.debug('Users searching for pair: {0}', JSON.stringify(items));
      return items;
    });
  }
};
