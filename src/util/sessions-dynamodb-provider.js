import log from '../lib/logger-service';
import DynamoDBTable from './dynamodb-table';

module.exports = class DynamoDBProvider {
  constructor() {
    this.table = new DynamoDBTable('sessions');
  }

  read(id) {
    return this.table.get({ id })
        .then((result) => (result !== undefined) ? result.context : {});
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
