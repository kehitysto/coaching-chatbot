import log from '../lib/logger-service';
import * as DynamoDBTable from './dynamodb-table';
import * as strings from '../coaching-chatbot/strings.json';
import * as CommunicationMethods
from '../../src/coaching-chatbot/communication-methods.json';


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
    let currentDay = strings['@WEEKDAYS'][new Date().getDay()].toUpperCase();

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
    let enumForDay = (new Date().getDay() + 5) % 7;
    let currentDay = strings['@WEEKDAYS'][enumForDay].toUpperCase();

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
      ExpressionAttributeValues: { ':true': true, ':id': id },
      ProjectionExpression: 'id, context.communicationMethods',
    };

    return this.table.scan(params).then((items) => {
      if (items == null) {
        return items;
      }

      return this.read(id).then((context) => {
        const contextMethods = Object.keys(context.communicationMethods);
        const hasAllMethods =
          contextMethods.length === Object.keys(CommunicationMethods).length;

        if (!hasAllMethods) {
          const filtered = items.filter((pair) =>
            Object.keys(pair.context.communicationMethods).some(
              (method) => contextMethods.includes(method))
            );

          log.debug('Users searching for pair: {0}', JSON.stringify(filtered));
          return filtered;
        }

        log.debug('Users searching for pair: {0}', JSON.stringify(items));
        return items;
      });
    });
  }
};
