import AWS from 'aws-sdk';

module.exports = class Sessions {
  constructor() {
    this.SESSION_TABLE =
      `${process.env.SERVERLESS_PROJECT}
      -sessions-${process.env.SERVERLESS_STAGE}`;
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

        console.log('db read: ' + JSON.stringify(data));

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

      console.log('db write: ' + JSON.stringify(context));

      this.db.put(params, (err, data) => {
        if (err) {
          console.error(err.toString());
          return reject(err);
        }

        return resolve(context);
      });
    });
  }
}
