import Builder from '../chatbot/builder';

import strings from './strings.json';
import * as actions from './actions';
import * as intents from './intents';
import PersonalInformationFormatter
 from '../lib/personal-information-formatter-service';
import CommunicationMethodsFormatter
 from '../lib/communication-methods-formatter';

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
        session.addResult('@GREETING', [Builder.QuickReplies.create('@YES'),
          Builder.QuickReplies.create('@NO'),
        ]);
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
        session.addResult('@INFORMATION_ABOUT_BUTTONS');
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
        session.addResult('@CONFIRM_JOB');
        session.addResult('@INFORMATION_ABOUT_BUTTONS');
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
          CommunicationMethodsFormatter
            .getCommunicationMethods(session.context));
      },
      (session) => {
        if (session.checkIntent('#COMMUNICATION_METHODS')) {
          session.runActions(['addCommunicationMethod']);
        } else {
          session.addResult('@UNCLEAR');
          session.switchDialog('/add_communication_method');
        }
      },
      (session) => {
        session.runActions(['addCommunicationInfo']);
        session.next();
      },
      (session) => {
        // check if all methods have been filled and
        // go to dumping automatically if so
        if (session.allCommunicationMethodsFilled()) {
          session.switchDialog('/add_meeting_frequency');
        } else {
          session.addResult('@CONFIRM_COMMUNICATION_METHODS');
          session.addResult('@PROVIDE_OTHER_COMMUNICATION_METHODS', [
            Builder.QuickReplies.create('@YES'),
            Builder.QuickReplies.create('@NO'),
          ]);
        }
      },
      (session) => {
        if (session.checkIntent('#YES')) {
          session.switchDialog('/add_communication_method');
        } else if (session.checkIntent('#NO')) {
          session.switchDialog('/add_meeting_frequency');
        } else {
          session.addResult('@UNCLEAR');
          session.prev();
        }
      },
    ])
  .dialog(
    '/add_meeting_frequency', [
      (session) => {
        session.addResult('@REQUEST_MEETING_FREQUENCY',
        PersonalInformationFormatter.getMeetingFrequency(session.context));
      },
      (session) => {
        if (session.checkIntent('#MEETING_FREQUENCY')) {
          session.runActions([
              'markUserAsSearching',
              'addMeetingFrequency']);
          session.addResult('@CHANGE_MEETING_FREQUENCY');
          session.endDialog();
        } else {
          session.addResult('@UNCLEAR');
          session.switchDialog('/add_meeting_frequency');
        }
      },
    ]
  )
  .dialog(
    '/profile', [
      (session) => {
        session.runActions(['updateProfile']);
        if (!session.context.searching) {
          session.addResult('@DISPLAY_PROFILE',
           PersonalInformationFormatter
              .getPersonalInformationbuttons(session.context));
        } else {
          session.runActions(['getAvailablePairs']);
        }
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
        session.beginDialog('/find_pair');
      }],
      ['#CHANGE_MEETING_FREQUENCY', (session) => {
        session.beginDialog('/add_meeting_frequency');
      }],
    ])
  .dialog(
    '/find_pair', [
      (session) => {
        if (session.getCommunicationMethodsCount() === 0) {
          session.addResult('@NO_METHODS_ADDED', [Builder.QuickReplies.create(
              '@YES'),
            Builder.QuickReplies.create('@NO'),
          ]);
        } else {
          session.switchDialog('/dump_pairs');
        }
      },
      (session) => {
        if (session.checkIntent('#YES')) {
          session.prev();
          session.switchDialog('/add_communication_method');
        } else if (session.checkIntent('#NO')) {
          session.endDialog();
        } else {
          session.addResult('@UNCLEAR');
          session.next();
        }
      },
    ])
  .dialog(
    '/reset', [
      (session) => {
        session.addResult('@RESET_CONFIRMATION', [Builder.QuickReplies.create(
            '@YES'),
          Builder.QuickReplies.create('@NO'),
        ]);
      },
      (session) => {
        if (session.checkIntent('#YES')) {
          session.runActions(['reset']);
          session.addResult('@RESET_DONE');
          session.clearState();
        } else if (session.checkIntent('#NO')) {
          session.endDialog();
        } else {
          session.addResult('@UNCLEAR');
          session.next();
        }
      },
    ])
  .match(
      '#RESET',
      (session) => {
        session.beginDialog('/reset');
      });

module.exports = bot;
