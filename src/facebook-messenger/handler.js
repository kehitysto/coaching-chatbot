import 'source-map-support/register';

require('../lib/envVars').config();

import Messenger from './messenger.service';
import Sessions from '../util/sessions-service';
import Chatbot from '../chatbot/chatbot.service';

import dialog from '../chatbot/coaching-chatbot.dialog';


module.exports.handler = (event, context, cb) => {
  if (event.method === 'GET') {
    return Messenger.verify(
        event.query['hub.verify_token'],
        event.query['hub.challenge']
      )
      .then((response) => cb(null, response))
      .catch((err) => cb(err));
  } else if (event.method === 'POST') {
    const sessions = new Sessions();
    const bot = new Chatbot(dialog, sessions);

    return Messenger.receive(event.body, bot)
      .then((response) => cb(null, response))
      .catch((err) => cb(err));
  }

  return cb('Unknown event');
};
