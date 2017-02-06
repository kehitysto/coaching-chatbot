import AWS from 'aws-sdk';


module.exports = class Sessions {
    constructor() {
        this.SESSION_TABLE = `${process.env.SERVERLESS_PROJECT}-sessions-${process.env.SERVERLESS_STAGE}`;
        this.db = new AWS.DynamoDB.DocumentClient();
    }

    read(id) {
        return new Promise((resolve, reject) => {
            const params = {
                Key: { id },
                TableName: this.SESSION_TABLE,
                ConsistentRead: true
            };

            this.db.get(params, (err, data) => {
                if (err) {
                    return reject(new Error(err.toString()));
                }

                return resolve(data.context);
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
                    context
                }
            };

            this.db.put(params, (err) => {
                if (err) {
                    return reject(new Error(err.toString()));
                }

                return resolve(context);
            });
        });
    }
}
