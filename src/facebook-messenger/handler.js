import 'source-map-support/register';

require('../lib/env-vars').config();

import * as Messenger from './messenger-service';
import * as Sessions from '../util/sessions-service';
import * as Chatbot from '../chatbot/chatbot-service';
import * as strings from '../coaching-chatbot/strings.json';

import dialog from '../coaching-chatbot/dialog';


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

module.exports.meetingReminder = (event, context, cb) => {
  const sessions = new Sessions();
  return sessions.readAll()
    .then((contexts) => {
      const promises = [];

      for (let i=0; i<contexts.length; i++) {
        const day = contexts[i].context.weekDay;
        if(day === undefined) continue;

        let meetingDay = strings['@DAYS'].indexOf(day.toUpperCase());
        if (meetingDay == new Date().getDay()) {
          promises.push(
              Messenger.send(contexts[i].id,
                strings['@REMINDER_MESSAGE'] + contexts[i].context.time,
              [])
          );
        }
      }
      return Promise.all(promises);
    });
};
