import 'source-map-support/register';

require('../lib/env-vars').config();

import * as Messenger from './messenger-service';
import * as Sessions from '../util/sessions-service';
import * as Chatbot from '../chatbot/chatbot-service';
import * as strings from '../coaching-chatbot/strings.json';
import * as Builder from '../chatbot/builder';

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

module.exports.meetingCheck = (event, context, cb) => {
  const sessions = new Sessions();
  return sessions.readAllWithReminders()
    .then((sessionsFromDb) => {
      const promises = [];
      for (let i = 0; i < sessionsFromDb.length; i++) {
        if (!sessionsFromDb[i].context.remindersEnabled) {
          continue;
        }
        promises.push(
            Messenger.send(sessionsFromDb[i].id,
              strings['@REMINDER_MESSAGE'] + sessionsFromDb[i].context.time,
              Builder.QuickReplies.createArray([
                'OK',
              ]))
        );
      }
      return sessions.readAllWithFeedbacks()
        .then((feedbackSessions) => {
          for (let i = 0; i < feedbackSessions.length; i++) {
            promises.push(
              sessions.write(
                feedbackSessions[i].id,
                {
                  ...feedbackSessions[i].context,
                  state:
                  '/?0/profile?0/accepted_pair_profile?0/give_feedback?1',
                }
              ).then(() => {
                Messenger.send(feedbackSessions[i].id,
                  strings['@FEEDBACK_MESSAGE'],
                  Builder.QuickReplies.createArray([
                    strings['@YES'],
                    strings['@NO'],
                  ])
                );
              })
            );
          }
          return Promise.all(promises);
        });
    });
};
