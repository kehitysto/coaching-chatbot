/**
* Manage Wit.ai sessions
*/

import AWS from 'aws-sdk';


const Sessions = {
    getOrCreate,
    read,
    write,
};
module.exports = Sessions;

////////

const DynamoDB = new AWS.DynamoDB.DocumentClient();
const SESSION_TABLE = `${process.env.SERVERLESS_PROJECT}-sessions-${process.env.SERVERLESS_STAGE}`;


function getOrCreate(session) {
    if (!session.id) {
        return Promise.reject(TypeError('No session ID'));
    }

    return read(session.id).catch(() => write(session));
}

function read(id) {
    return new Promise((resolve, reject) => {
        const params = {
            Key: { id },
            TableName: SESSION_TABLE,
            ConsistentRead: true
        };

        DynamoDB.get(params, (err, data) => {
            if (err) {
                return reject(Error(err.toString()));
            }

            const session = {
                id,
                context: {},
                ...data.Item
            };

            return resolve(session);
        });
    });
}

function write(session) {
    return new Promise((resolve, reject) => {
        if (!session.id) {
            return reject(TypeError('No session ID'));
        }

        // coerce session id to string
        session.id = session.id + '';

        const params = {
            TableName: SESSION_TABLE,
            Item: session,
        };

        DynamoDB.put(params, (err) => {
            if (err) {
                return reject(Error(err.toString()));
            }

            return resolve(session);
        });
    });
}
