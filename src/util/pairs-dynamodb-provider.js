import * as DynamoDBTable from './dynamodb-table';

module.exports = class DynamoDBProvider {
  constructor() {
    this.table = new DynamoDBTable('pairs');
  }

  read(id) {
    return this.table.get({ id })
        .then((result) => (result !== undefined) ? result.pairs : []);
  }

  write(id, pairs) {
    return new Promise((resolve, reject) => {
      if (!id) {
        return reject(new TypeError('No session ID'));
      }

      // coerce session id to string
      id = id + '';

      return resolve(
        this.table.put({ id }, { pairs })
            .then(({ pairs }) => pairs)
      );
    });
  }
};
