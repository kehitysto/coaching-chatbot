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
    let currentHourWithoutZero = currentDate.getHours();
    let currentHourWithZero;
    if (currentHourWithoutZero < 10) {
      currentHourWithZero = '0' + currentHourWithoutZero;
    } else {
      currentHourWithZero = currentHourWithoutZero;
    }

    log.debug('PREVIOUS DAY: ' + currentDay);

    const params = {
      Limit: 50,
      FilterExpression: 'context.weekDay = :currentDay',
      ExpressionAttributeValues: {
        ':currentDay': currentDay,
      },
    };

    return this.table.scan(params).then((items) => {
      log.debug('CURRENT TIME: ' + currentHourWithZero +
      ':' + currentDate.getMinutes());
      let sessions = [];
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item.context.time.length == 5) {
          if (item.context.time.substring(0, 2) == currentHourWithZero) {
            sessions.push(items[i]);
          }
        } else if (item.context.time.length == 4) {
          if (item.context.time.substring(0, 1) == currentHourWithoutZero) {
            sessions.push(items[i]);
          }
        }
      }

      log.debug('Sessions with reminder: ' + JSON.stringify(sessions));
      return sessions;
    });
  }

  readAllWithFeedbacks() {
    let d = new Date();
    let utc = d.getTime() + (d.getTimezoneOffset() * 60 * 1000);
    // UTC + 2 -> Suomen aika
    let currentDate = new Date(utc + (2 * 60 * 60 * 1000));
    let enumDate = (currentDate.getDate() + 6) % 7;
    let currentDay = strings['@WEEKDAYS'][enumDate].toUpperCase();
    log.debug('CURRENT DAY: ' + currentDay);
    let currentHourWithoutZero = (currentDate.getHours() - 1) % 24;
    let currentHourWithZero;
    if (currentHourWithoutZero < 10) {
      currentHourWithZero = '0' + currentHourWithoutZero;
    } else {
      currentHourWithZero = currentHourWithoutZero;
    }

    const params = {
      Limit: 50,
      FilterExpression: 'context.weekDay = :currentDay',
      ExpressionAttributeValues: {
        ':currentDay': currentDay,
      },
    };

    return this.table.scan(params).then((items) => {
      log.debug('CURRENT TIME: ' + currentHourWithZero +
      ':' + currentDate.getMinutes());
      let sessions = [];
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item.context.time.length == 5) {
          if (item.context.time.substring(0, 2) == currentHourWithZero) {
            sessions.push(items[i]);
          }
        } else if (item.context.time.length == 4) {
          if (item.context.time.substring(0, 1) == currentHourWithoutZero) {
            sessions.push(items[i]);
          }
        }
      }

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
