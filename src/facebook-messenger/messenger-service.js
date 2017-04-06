import request from 'request-promise';

import log from '../lib/logger-service';

const Messenger = {
  send(id, text, quickReplies = []) {
    let body = {
      recipient: {
        id,
      },
      message: {
        text,
      },
    };

    if (quickReplies.length) {
      body.message['quick_replies'] = [];
    }

    for (let quickReply of quickReplies) {
      body.message['quick_replies'].push({
        'content_type': 'text',
        'title': quickReply.title,
        'payload': quickReply.payload || quickReply.title,
      });
    }

    return _fbMessageRequest(body);
  },

  toggleTypingIndicator(id, typing = true) {
    const action = (typing) ? 'typing_on' : 'typing_off';
    const body = {
      'recipient': {
        id,
      },
      'sender_action': action,
    };

    return _fbMessageRequest(body);
  },

  receive(data, chatbot) {
    if (data.object === 'page') {
      const promises = [];

      data.entry.forEach((entry) => {
        entry.messaging.forEach((messageEvent) => {
          if (messageEvent.message && !messageEvent.message.is_echo) {
            promises.push(_receiveMessage(messageEvent, chatbot));
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
      return Promise.resolve({
        response: challenge,
      });
    }

    return Promise.reject(new Error('400 Bad Token'));
  },
};

module.exports = Messenger;

function _receiveMessage(messageEvent, chatbot) {
  return new Promise((resolve, reject) => {
    const sender = messageEvent.sender.id;
    const text = messageEvent.message.text;

    if (!text) {
      const unhandledMessageTypeResponse =
        'Voit lähettää minulle vain tekstiä tai painaa antamiani nappeja.';
      return resolve(Messenger.send(sender, unhandledMessageTypeResponse));
    }

    return resolve(
      chatbot.receive(sender, text)
      .then((response) => {
        let promise = Messenger.toggleTypingIndicator(sender, true);

        for (let r of response) {
          promise = promise.then(() => {
            return Messenger.send(sender,
              r.message, r.quickReplies);
          });
        }
        return promise
          .then(() => Messenger.toggleTypingIndicator(sender, false));
      })
    );
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
    qs: {
      access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
    },
    method: 'POST',
    json,
  });
}
