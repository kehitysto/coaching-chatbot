import Builder from '../chatbot/builder';

import strings from './strings.json';
import * as actions from './actions';
import * as intents from './intents';

const bot = new Builder(strings);

// ACTIONS
for (let actionId in actions) {
  if ({}.hasOwnProperty.call(actions, actionId)) {
    bot.action(actionId, actions[actionId]);
  }
}

// INTENTS
for (let intentId in intents) {
  if ({}.hasOwnProperty.call(intents, intentId)) {
    bot.intent(intentId, intents[intentId]);
  }
}

// DIALOGS
bot
  .dialog(
    '/', [
      (session) => {
        session.addResult('@GREETING');
      },
      (session) => {
        if (session.checkIntent('yes')) {
          session.beginDialog('/create_profile');
        } else if (session.checkIntent('no')) {
          session.addResult('@GOODBYE');
        } else {
          session.addResult('@UNCLEAR');
          session.next();
        }
      },
    ], [
      ['reset', (session) => {
        session.runActions(['reset']);
        session.addResult('@RESET');
        session.clearState();
      }],
    ])
  .dialog(
    '/create_profile', [
      (session) => {
        session.addResult('@GREAT');
        session.beginDialog('/set_name');
      },
      (session) => {
        session.beginDialog('/set_job');
      },
      (session) => {
        session.switchDialog('/profile');
      },
    ])
  .dialog(
    '/set_name', [
      (session) => {
        session.addResult('@REQUEST_NAME');
      },
      (session) => {
        session.runActions(['setName']);
        session.addResult('@CONFIRM_NAME');
        session.endDialog();
      },
    ])
  .dialog(
    '/set_job', [
      (session) => {
        session.addResult('@REQUEST_JOB');
      },
      (session) => {
        session.runActions(['setJob']);
        session.endDialog();
      },
    ], [
      ['change_name', (session, match) => {
        if (match !== true) {
          session.runActions(['setName'], match);
          session.addResult('@CONFIRM_NAME');
        } else {
          session.beginDialog('/set_name');
        }
      }],
    ])
  .dialog(
    '/set_age', [
      (session) => {
        session.addResult('@REQUEST_AGE');
      },
      (session) => {
        session.runActions(['setAge']);
        session.addResult('@CONFIRM_AGE');
        session.endDialog();
      },
    ])
  .dialog(
    '/set_place', [
      (session) => {
        session.addResult('@REQUEST_PLACE');
      },
      (session) => {
        session.runActions(['setPlace']);
        session.addResult('@CONFIRM_PLACE');
        session.endDialog();
      },
    ])
  .dialog(
    '/add_communication_method', [
        (session) => {
          session.addResult('@REQUEST_COMMUNICATION_METHOD');
        },
        (session) => {
          session.runActions(['addCommunicationMethod']);
          session.addResult(['getCommunicationMethodRequestInfoText']);
          session.runActions(['addCommunicationInfo']);
        },
        (session) => {
          session.addResult('@PROVIDE_OTHER_COMMUNICATION_METHODS');
          if(session.checkIntent('yes')) {
            session.beginDialog('/add_communication_method');
          }else if (session.checkIntent('no')) {
            session.endDialog();
          }else{
            session.addResult('@UNCLEAR');
            session.next();
          }
      },
    ])
  .dialog(
    '/profile', [
      (session) => {
        session.runActions(['updateProfile']);
        session.addResult('@DISPLAY_PROFILE');
      },
    ], [
      ['change_name', (session, match) => {
        if (match !== true) {
          session.runActions(['setName'], match);
          session.addResult('@CONFIRM_NAME');
        } else {
          session.beginDialog('/set_name');
        }
      }],
      ['change_job', (session, match) => {
        if (match !== true) {
          session.runActions(['setJob'], match);
          session.addResult('@confirm_job');
        } else {
          session.beginDialog('/set_job');
        }
      }],
      ['set_age', (session, match) => {
        if (match !== true) {
          session.runActions(['setAge'], match);
          session.addResult('@CONFIRM_AGE');
        } else {
          session.beginDialog('/set_age');
        }
      }],
      ['set_place', (session, match) => {
        if (match !== true) {
          session.runActions(['setPlace'], match);
          session.addResult('@CONFIRM_PLACE');
        } else {
          session.beginDialog('/set_place');
        }
      }],
      ['find_pair', (session) => {
        session.addResult('@NOT_IMPLEMENTED');
        session.beginDialog('/add_communication_method');
      }],
    ]);

module.exports = bot;
