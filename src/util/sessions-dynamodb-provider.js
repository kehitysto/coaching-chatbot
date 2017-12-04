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
    let d = new Date();
    let utc = d.getTime() + (d.getTimezoneOffset() * 60 * 1000);
    // UTC + 2 -> Suomen aika
    let currentDate = new Date(utc + (2 * 60 * 60 * 1000));
    let currentDay = strings['@WEEKDAYS'][currentDate.getDay()].toUpperCase();
    let currentHour = ('0' + currentDate.getHours()).substr(-2, 2);

    const params = {
      Limit: 50,
      FilterExpression: 'context.weekDay = :currentDay',
      ExpressionAttributeValues: {
        ':currentDay': currentDay,
      },
    };

    return this.table.scan(params).then((items) => {
      let sessions = items.filter((item) =>
        ('0' + item.context.time).substr(-5, 2) == currentHour);
      log.debug('Sessions with reminder: ' + JSON.stringify(sessions));
      return sessions;
    });
  }

  readAllWithFeedbacks() {
    let d = new Date();
    let utc = d.getTime() + (d.getTimezoneOffset() * 60 * 1000);
    // UTC + 2 -> Suomen aika
    let currentDate = new Date(utc + (2 * 60 * 60 * 1000));
    let enumDay = (currentDate.getDay() + 6) % 7;
    let currentDay = strings['@WEEKDAYS'][enumDay].toUpperCase();
    let currentHour = ('0' +
      ((currentDate.getHours() + 23) % 24)).substr(-2, 2);

    const params = {
      Limit: 50,
      FilterExpression: 'context.weekDay = :currentDay',
      ExpressionAttributeValues: {
        ':currentDay': currentDay,
      },
    };

    return this.table.scan(params).then((items) => {
      let sessions = items.filter((item) =>
        ('0' + item.context.time).substr(-5, 2) == currentHour);
      log.debug('Sessions with feedback: ' + JSON.stringify(sessions));
      return sessions;
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
