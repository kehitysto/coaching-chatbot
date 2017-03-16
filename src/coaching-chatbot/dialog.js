import Builder from '../chatbot/builder';

import strings from './strings.json';
import * as actions from './actions';
import * as intents from './intents';
import Formatter from '../lib/personal-information-formatter-service';

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
        session.addResult('@GREETING',
            [Builder.QuickReply.create('@YES'),
             Builder.QuickReply.create('@NO')]);
      },
      (session) => {
        if (session.checkIntent('#YES')) {
          session.beginDialog('/create_profile');
        } else if (session.checkIntent('#NO')) {
          session.addResult('@GOODBYE');
        } else {
          session.addResult('@UNCLEAR');
          session.next();
        }
      },
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
      ['#CHANGE_NAME', (session, match) => {
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
          session.addResult('@REQUEST_COMMUNICATION_METHOD',
              Formatter.getCommunicationMethods( session.context ));
        },
        (session) => {
          session.runActions(['addCommunicationMethod']);
        },
        (session) => {
          session.runActions(['addCommunicationInfo']);
          session.addResult('@PROVIDE_OTHER_COMMUNICATION_METHODS',
              [Builder.QuickReply.create('@YES'),
               Builder.QuickReply.create('@NO')]);
        },
        (session) => {
          if(session.checkIntent('#YES')) {
            session.switchDialog('/add_communication_method');
          }else if (session.checkIntent('#NO')) {
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
      ['#CHANGE_NAME', (session, match) => {
        if (match !== true) {
          session.runActions(['setName'], match);
          session.addResult('@CONFIRM_NAME');
        } else {
          session.beginDialog('/set_name');
        }
      }],
      ['#CHANGE_JOB', (session, match) => {
        if (match !== true) {
          session.runActions(['setJob'], match);
          session.addResult('@CONFIRM_JOB');
        } else {
          session.beginDialog('/set_job');
        }
      }],
      ['#SET_AGE', (session, match) => {
        if (match !== true) {
          session.runActions(['setAge'], match);
          session.addResult('@CONFIRM_AGE');
        } else {
          session.beginDialog('/set_age');
        }
      }],
      ['#SET_PLACE', (session, match) => {
        if (match !== true) {
          session.runActions(['setPlace'], match);
          session.addResult('@CONFIRM_PLACE');
        } else {
          session.beginDialog('/set_place');
        }
      }],
      ['#FIND_PAIR', (session) => {
        session.beginDialog('/add_communication_method');
      }],
      ['#RESET', (session) => {
        session.beginDialog('/reset');
      }],
    ])
  .dialog(
    '/reset', [
      (session) => {
        session.addResult('@RESET_CONFIRMATION',
            [Builder.QuickReply.create('@YES'),
             Builder.QuickReply.create('@NO')]);
      },
      (session) => {
        if (session.checkIntent('#YES')) {
          session.runActions(['reset']);
          session.addResult('@RESET');
          session.clearState();
        } else if (session.checkIntent('#NO')) {
          session.endDialog();
        } else {
          session.addResult('@UNCLEAR');
          session.next();
        }
      },
    ]);

module.exports = bot;
