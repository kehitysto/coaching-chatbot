/**
* Facebook Messenger service
*/

import request from 'request-promise';


const Messenger = {
    send,
    receive,
    verify,
};
module.exports = Messenger;


function send(id, text) {
    const body = {
        recipient: { id },
        message: { text },
    };

    return _fbMessageRequest(body);
}

function receive(data, cb) {
    if (data.object === 'page') {
        const promises = [];

        data.entry.forEach(entry => {
            entry.messaging.forEach(msgEvent => {
                if (msgEvent.message && !msgEvent.message.is_echo) {
                    promises.push(_receiveMessage(msgEvent, cb));
                }
            });
        });

        return Promise.all(promises);

    } else {
        return Promise.reject(new Error('Bad event'));
    }
}

function verify(token, challenge) {
    if (token === process.env.FACEBOOK_VERIFY_TOKEN) {
        return Promise.resolve({ response: challenge });
    }

    return Promise.reject(new Error('400 Bad Token'));
}

function _receiveMessage(msgEvent, cb) {
    return new Promise((resolve, reject) => {
        const sender = msgEvent.sender.id;

        const { text, attachments } = msgEvent.message;

        if (attachments) {
            return reject(new Error('Attachments are not supported'));
        } else if (text) {
            return resolve(
                cb(sender, text)
            );
        }
    });
}

function _fbMessageRequest(json) {
    if (!process.env.FACEBOOK_PAGE_ACCESS_TOKEN) {
        return Promise.reject(new Error('No FACEBOOK_PAGE_ACCESS_TOKEN defined'));
    }

    return request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN },
        method: 'POST',
        json
    });
}
