/**
* Facebook Messenger service
*/

import request from 'request-promise';

import log from '../lib/logger-service';

const Messenger = {
  send(id, text, quickReplies=[]) {
    let body = {
      recipient: { id },
      message: { text },
    };

    if (quickReplies.length) {
      body.message['quick_replies'] = [];
      for (let i = 0; i < quickReplies.length; ++i) {
        let title = quickReplies[i].name;
        let payload = quickReplies[i].payload || title;
        body.message['quick_replies'].push({
          'content_type': 'text',
          title,
          payload,
        });
      }
    }

    return _fbMessageRequest(body);
  },

  toggleTypingIndicator(id, typing=true) {
    const action = (typing) ? 'typing_on' : 'typing_off';
    const body = {
      'recipient': { id },
      'sender_action': action,
    };

    return _fbMessageRequest(body);
  },

  receive(data, chatbot) {
    if (data.object === 'page') {
      const promises = [];

      data.entry.forEach((entry) => {
        entry.messaging.forEach((msgEvent) => {
          if (msgEvent.message && !msgEvent.message.is_echo) {
            promises.push(_receiveMessage(msgEvent, chatbot));
          }
        });
      });

      return Promise.all(promises);
    } else {
      return Promise.reject(new Error('Bad event'));
    }
  },

  verify(token, challenge) {
    if (token === process.env.FACEBOOK_VERIFY_TOKEN) {
      return Promise.resolve({ response: challenge });
    }

    return Promise.reject(new Error('400 Bad Token'));
  },
};
module.exports = Messenger;


function _receiveMessage(msgEvent, chatbot) {
  return new Promise((resolve, reject) => {
    const sender = msgEvent.sender.id;

    const { text, attachments } = msgEvent.message;

    if (attachments) {
      return reject(new Error('Attachments are not supported'));
    } else if (text) {
      return resolve(
        chatbot.receive(sender, text).then((response) => {
          let promise = Messenger.toggleTypingIndicator(true);
          for (let i = 0; i < response.length; ++i) {
            promise = promise.then(() => {
              return Messenger.send(sender,
                  response[i].message, response[i].quickReplies);
            });
          }
          return promise.then(() => Messenger.toggleTypingIndicator(false));
        })
      );
    }
  });
}

function _fbMessageRequest(json) {
  if (!process.env.FACEBOOK_PAGE_ACCESS_TOKEN) {
    return Promise
        .reject(new Error('No FACEBOOK_PAGE_ACCESS_TOKEN defined'));
  }

  log.info('Sending message to Facebook: {0}', JSON.stringify(json));

  return request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN },
    method: 'POST',
    json,
  });
}
