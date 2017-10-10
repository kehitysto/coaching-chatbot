import * as DynamoDBTable from './dynamodb-table';

module.exports = class DynamoDBProvider {
  constructor() {
    this.table = new DynamoDBTable('feedback');
  }

  write(row) {
    return new Promise((resolve, reject) => {
        const { date, giver, pair, feedback } = row;
        if (!date || !giver || !pair || !feedback || !feedback.length) {
            return reject(new Error('Missing feedback parameters!'));
        }

        const id = '' + date.getDate() + (date.getMonth() + 1)
          + date.getFullYear() + '-' + giver;

        return resolve(
          this.table.put({ id }, { giver, pair, feedback, date: date.now() })
        );
    });
  }
};
