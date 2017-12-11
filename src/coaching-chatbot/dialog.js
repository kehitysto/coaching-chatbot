import * as Builder from '../chatbot/builder';

import * as strings from './strings.json';
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
        session.addResult('@GREETING_1');
        session.addResult('@GREETING_2');
        session.addResult('@GREETING_3',
          Builder.QuickReplies.createArray(['@YES', '@NO']));
      },
      (session) => {
        if (session.checkIntent('#YES')) {
          session.beginDialog('/create_profile');
        } else if (session.checkIntent('#NO')) {
          session.addResult('@GOODBYE');
        } else {
          session.addResult('@UNCLEAR');
          session.prev();
        }
      },
    ])
  .dialog(
    '/create_profile', [
      (session) => {
        session.addResult('@GREAT');
        session.beginDialog('/set_real_name');
      },
      (session) => {
        session.beginDialog('/set_bio');
      },
      (session) => {
        session.beginDialog('/communication_methods');
      },
      (session) => {
        session.switchDialog('/profile');
      },
    ])
  .dialog(
    '/set_real_name', [
      (session) => {
        session.runActions(['setRealName']);
        session.addResult('@CONFIRM_NAME');
        session.endDialog();
      },
    ])
  .dialog(
    '/set_name', [
      (session) => {
        session.addResult('@REQUEST_NAME');
      },
      (session) => {
        if (session.validInput(50)) {
          session.runActions(['setName']);
          session.addResult('@CONFIRM_NAME');
          session.endDialog();
        } else {
          session.addResult('@TOO_LONG_NAME');
          session.prev();
        }
      },
    ])
  .dialog(
    '/set_bio', [
      (session) => {
        session.addResult('@REQUEST_BIO');
      },
      (session) => {
        if (session.validInput(400)) {
          session.runActions(['setBio']);
          session.addResult('@CONFIRM_BIO');
          session.endDialog();
        } else {
          session.addResult('@TOO_LONG_BIO');
          session.prev();
        }
      },
    ])
  .dialog(
    '/communication_methods', [
    (session) => {
      if (session.getCommunicationMethodsCount() === 0) {
        session.switchDialog('/add_communication_method');
      } else {
        session.addResult('@CONFIRM_COMMUNICATION_METHODS');
        session.addResult('@PROVIDE_OTHER_COMMUNICATION_METHODS',
          Builder.QuickReplies.createArray([
            '@EDIT', '@DELETE', '@DONE']));
      }
    },
    (session) => {
      if (session.checkIntent('#ADD_OR_CHANGE')) {
        session.switchDialog('/add_communication_method');
      } else if (session.checkIntent('#DELETE')) {
        session.switchDialog('/delete_communication_method');
      } else if (session.checkIntent('#DONE')) {
        session.endDialog();
      } else {
        session.addResult('@UNCLEAR');
        session.prev();
      }
    },
  ])
  .dialog(
    '/add_communication_method', [
      (session) => {
        session.addResult('@REQUEST_COMMUNICATION_METHOD',
          CommunicationMethodsFormatter
            .getCommunicationMethods({})
        );
      },
      (session) => {
        if (session.checkIntent('#COMMUNICATION_METHODS')) {
          session.runActions(['addCommunicationMethod']);
        } else {
          session.addResult('@UNCLEAR');
          session.prev();
        }
      },
      (session) => {
        if (session.validInput(50)) {
          session.runActions(['addCommunicationInfo']);
          session.switchDialog('/communication_methods');
        } else {
          session.addResult('@TOO_LONG_COMMUNICATION_METHOD');
          session.runActions(['deleteUndefinedCommunicationMethod']);
          session.resetDialog();
        }
      },
  ])
  .dialog(
    '/delete_communication_method', [
      (session) => {
        session.addResult('@REQUEST_COMMUNICATION_METHOD_DELETE', [
            ...CommunicationMethodsFormatter
              .getFilledCommunicationMethods(session.context),
            Builder.QuickReplies.create('@RETURN'),
          ]
        );
      },
      (session) => {
        if (session.checkIntent('#COMMUNICATION_METHODS')) {
          session.runActions(['deleteCommunicationMethod']);
          session.switchDialog('/communication_methods');
        } else if (session.checkIntent('#RETURN')) {
          session.switchDialog('/communication_methods');
        } else {
          session.addResult('@UNCLEAR');
          session.prev();
        }
      },
  ])
  .dialog(
    '/manage_info', [
      (session) => {
        session.addResult('@MANAGE_INFO',
          Builder.QuickReplies.createArray([
            '@NAME', '@BIO', '@COMMUNICATION_METHODS', '@RETURN']
        ));
      },
    ], [
      ['#NAME', (session, match) => {
        if (match !== true) {
          session.runActions(['setName'], match);
          session.addResult('@CONFIRM_NAME');
        } else {
          session.beginDialog('/set_name');
        }
      }],
      ['#BIO', (session, match) => {
        if (match !== true) {
          session.runActions(['setBio'], match);
          session.addResult('@CONFIRM_BIO');
        } else {
          session.beginDialog('/set_bio');
        }
      }],
      ['#EDIT_COMMUNICATION_METHODS', (session) => {
        session.beginDialog('/communication_methods');
      }],
      ['#RETURN', (session) => {
        session.endDialog();
      }],
      ['#OPTIONAL_VALUE', (session) => {
        session.addResult('@UNCLEAR');
      }],
    ])
  .dialog(
    '/profile', [
      (session) => {
        session.runActions(['updateProfile']);
        if (session.isSearching()) {
          session.addResult('@DISPLAY_PROFILE_SEARCHING',
            PersonalInformationFormatter
              .getPersonalInformationbuttons(session.context));
        } else {
          session.addResult('@DISPLAY_PROFILE',
            PersonalInformationFormatter
              .getPersonalInformationbuttons(session.context));
        }
      },
    ], [
      ['#MANAGE_INFO', (session) => {
      session.beginDialog('/manage_info');
      }],
      ['#FIND_PAIR', (session) => {
        session.switchDialog('/searching');
      }],
      ['#HELP', (session) => {
        session.addResult('@HELP');
      }],
      ['#STOP_SEARCHING', (session) => {
        session.beginDialog('/stop_searching', true);
      }],
      ['#OPTIONAL_VALUE', (session) => {
        session.addResult('@UNCLEAR');
      }],
    ])
  .dialog(
    '/searching', [
      (session) => {
        session.runActions(['getAvailablePeers']);
        session.next();
      },
      (session) => {
        if (!session.context.availablePeers ||
          session.getAvailablePeersCount() <= 0) {
          if (session.isSearching()) {
            return session.addResult('@NO_PAIRS_AVAILABLE',
              Builder.QuickReplies.createArray([
                '@TO_PROFILE', '@STOP_SEARCHING'])
            );
          } else {
            return session.addResult('@NO_PAIRS_AVAILABLE',
              Builder.QuickReplies.createArray([
                '@LIST_AS_SEARCHING', '@TO_PROFILE'])
            );
          }
        }

        session.addResult('@INFORMATION_ABOUT_LIST');
        session.next();
      },
      (session) => {
        if (session.getAvailablePeersCount() <= 0) {
          return session.prev();
        }
        session.addResult('@LIST_LENGTH');
        session.runActions(['displayAvailablePeer']);
        if (session.isSearching()) {
          session.addQuickReplies(
            Builder.QuickReplies.createArray([
              '@YES', '@NO', '@NEXT', '@EXIT', '@STOP_SEARCHING'])
          );
        } else {
          session.addQuickReplies(
            Builder.QuickReplies.createArray([
              '@YES', '@NO', '@NEXT', '@EXIT', '@LIST_AS_SEARCHING'])
          );
        }
      },
      (session) => {
        if (session.checkIntent('#NO')) {
          session.runActions(['rejectAvailablePeer']);
          session.next();
        } else if (session.checkIntent('#YES')) {
          session.beginDialog('/send_pair_request');
        } else if (session.checkIntent('#NEXT')) {
          session.runActions(['nextAvailablePeer']);
          session.next();
        } else if (session.checkIntent('#RETURN')) {
          session.switchDialog('/profile');
        } else {
          session.addResult('@UNCLEAR');
          session.next();
        }
      },
      (session) => {
        session.runActions([
          'updateAvailablePeers',
          'checkAvailablePeersIndex']);
        session.prev();
        session.prev();
      },
    ], [
      ['#STOP_SEARCHING', (session) => {
        session.resetDialog();
        session.beginDialog('/stop_searching', true);
      }],
      ['#HELP', (session) => {
        session.addResult('@HELP');
      }],
      ['#LIST_AS_SEARCHING', (session) => {
        session.context.searching = true; // markUserAsSearching is too slow
        session.runActions(['markUserAsSearching']);
        session.switchDialog('/profile');
      }],
      ['#TO_PROFILE', (session) => {
        session.switchDialog('/profile');
      }],
    ])
  .dialog(
    '/send_pair_request', [
      (session) => {
        session.addResult('@GIVE_PAIR_REQUEST_MESSAGE');
      },
      (session) => {
        if (session.validInput(500)) {
          session.runActions(['addPairRequest']);
          session.endDialog();
        } else {
          session.addResult(['@TOO_LONG_GREETING']);
          session.prev();
        }
      },
    ])
  .dialog(
    '/manage_requests', [
      (session) => {
        session.addResult('@REQUEST_MANAGEMENT');
        session.addQuickReplies(
          Builder.QuickReplies.createArray([
            '@SHOW_SENT_REQUESTS', '@SHOW_REQUESTS', '@RETURN'])
        );
      },
      (session) => {
        if (session.checkIntent('#SENT_REQUESTS')) {
          session.beginDialog('/list_sent_requests');
        } else if (session.checkIntent('#RECEIVED_REQUESTS')) {
          session.beginDialog('/list_requests');
        } else if (session.checkIntent('#RETURN')) {
          session.endDialog();
        } else {
          session.addResult('@UNCLEAR');
          session.prev();
        }
      },
  ])
  .dialog(
    '/list_sent_requests', [
      (session) => {
        if (session.getSentRequestCount() <= 0) {
          session.addResult('@NO_SENT_REQUESTS_AVAILABLE');
          return session.endDialog();
        }
        session.next();
      },
      (session) => {
        session.context.sentRequestsIndex =
          session.context.sentRequestsIndex || 1;
        session.addResult('@SENT_REQUEST_LIST_LENGTH');
        session.runActions(['displaySentRequest']);
        session.addQuickReplies(
          Builder.QuickReplies.createArray(
            ['@REVOKE_REQUEST', '@NEXT', '@RETURN'])
        );
      },
      (session) => {
        if (session.checkIntent('#REVOKE_REQUEST')) {
          session.runActions(['removeSentRequest']);
          session.resetDialog();
        } else if (session.checkIntent('#NEXT')) {
          session.runActions(['nextSentRequest']);
          session.prev();
        } else if (session.checkIntent('#RETURN')) {
          session.endDialog();
        } else {
          session.addResult('@UNCLEAR');
          session.prev();
        }
      },
  ])
  .dialog(
    '/list_requests', [
      (session) => {
        if (session.getPairRequestCount() <= 0) {
          session.addResult('@NO_REQUESTS_AVAILABLE');
          return session.endDialog();
        }
        session.next();
      },
      (session) => {
        session.addResult('@REQUEST_LIST_LENGTH');
        session.addResult('@INFORMATION_ABOUT_REQUESTS');
        session.runActions(['displayRequest', 'displayRequestMessage']);
        session.addQuickReplies(
          Builder.QuickReplies.createArray(['@YES', '@NO', '@RETURN'])
        );
      },
      (session) => {
        if (session.checkIntent('#NO')) {
          session.runActions(['rejectRequest']);
          session.resetDialog();
        } else if (session.checkIntent('#YES')) {
          session.runActions(['acceptRequest']);
          return session.next();
        } else if (session.checkIntent('#RETURN')) {
          session.endDialog();
        } else {
          session.addResult('@UNCLEAR');
          session.prev();
        }
      },
      (session) => {
        if (session.hasPair()) {
          session.switchDialog('/accepted_pair_information');
        } else {
          session.endDialog();
        }
      },
    ])
  .dialog(
    '/accepted_pair_information', [
      (session) => {
        session.addResult('@PAIR_CREATED');
        session.runActions(['displayAcceptedPeer']);
        session.addResult('@LINK_TO_HELP');
        session.switchDialog('/accepted_pair_profile');
      },
    ])
  .dialog('/break_pair', [
    (session) => {
      session.addResult('@BREAK_REASON');
    },
    (session) => {
      if (session.validInput(600)) {
        session.runActions(['breakPairGeneric']);
        session.switchDialog('/profile');
      } else {
        session.addResult('@TOO_LONG_REASON');
        session.prev();
      }
    },
  ])
  .dialog(
    '/accepted_pair_profile', [
      (session) => {
        if (session.ifFacilitationSet()) {
          session.addResult('@ASK_FOR_FACILITATION',
            Builder.QuickReplies.createArray([
              '@SET_DATE', '@SHOW_PAIR'])
          );
        } else {
          session.addResult('@CONFIRM_DATE');
          if (session.areRemindersEnabled()) {
            session.addQuickReplies(
              Builder.QuickReplies.createArray([
                '@CHANGE_DATE', '@DISABLE_REMINDERS', '@SHOW_PAIR'])
            );
          } else {
            session.addQuickReplies(
              Builder.QuickReplies.createArray([
                '@CHANGE_DATE', '@ENABLE_REMINDERS', '@SHOW_PAIR'])
            );
          }
        }
      },
    ], [
      ['#SHOW_PAIR', (session) => {
        session.switchDialog('/accepted_pair_information');
      }],
      ['#SET_DATE', (session) => {
        session.beginDialog('/set_date');
      }],
      ['#TOGGLE_REMINDERS', (session) => {
        session.beginDialog('/toggle_reminders');
      }],
      ['#TEST', (session) => {
          if (process.env.STAGE != 'production') {
            session.runActions(['testReminderAndFeedback']);
            session.resetDialog();
          } else {
            session.addResult('@UNCLEAR');
          }
      }],
      ['#BREAK_PAIR', (session) => {
        session.switchDialog('/break_pair');
      }],
      ['#HELP', (session) => {
        session.addResult('@HELP');
      }],
    ])
  .dialog(
    '/toggle_reminders', [
      (session) => {
        if (session.areRemindersEnabled()) {
          session.runActions(['toggleReminders']);
          session.addResult('@CONFIRM_REMINDERS_DISABLED');
        } else {
          session.runActions(['toggleReminders']);
          session.addResult('@CONFIRM_REMINDERS_ENABLED');
        }
        session.endDialog();
      },
    ])
  .dialog(
    '/set_date', [
      (session) => {
        session.addResult('@ASK_FOR_WEEKDAY');
        session.addQuickReplies(
          Builder.QuickReplies.createArray(strings['@WEEKDAYS']));
      },
      (session) => {
        if (session.checkIntent('#WEEKDAY')) {
          session.runActions(['setWeekday']);
          session.next();
        } else {
          session.addResult('@UNCLEAR');
          session.prev();
        }
      },
      (session) => {
        session.addResult('@ASK_FOR_TIME');
      },
      (session) => {
        if (session.checkIntent('#TIME')) {
          session.runActions(['setTime']);
          session.endDialog();
        } else {
          session.addResult('@UNCLEAR');
          session.prev();
        }
      },
    ])
  .dialog(
    '/give_feedback', [
      (session) => {
        session.addResult('@FEEDBACK_MESSAGE',
          Builder.QuickReplies.createArray(['@YES', '@NO']));
      },
      (session) => {
        if (session.checkIntent('#YES')) {
          session.next();
        } else if (session.checkIntent('#NO')) {
          session.endDialog();
        } else {
          session.addResult('@UNCLEAR');
          session.prev();
        }
      },
      (session) => {
        session.addResult('@FEEDBACK_ABOUT_MEETING');
        session.addQuickReplies(
          Builder.QuickReplies.createArray(['1', '2', '3', '4'])
        );
      },
      (session) => {
        if (session.checkIntent('#NUMERIC_RATING')) {
          session.runActions(['setRating']);
          session.next();
        } else {
          session.addResult('@UNCLEAR');
          session.prev();
        }
      },
      (session) => {
          session.addResult('@GIVE_FEEDBACK');
      },
      (session) => {
        if (session.validInput(600)) {
          session.context.input = session.getInput();
          session.addResult('@CONFIRM_FEEDBACK',
            Builder.QuickReplies.createArray(['@YES', '@NO']));
        } else {
          session.addResult('@TOO_LONG_FEEDBACK');
          session.prev();
        }
      },
      (session) => {
        if (session.checkIntent('#YES')) {
          session.next();
        } else if (session.checkIntent('#NO')) {
          session.resetDialog();
        } else {
          session.addResult('@UNCLEAR');
          session.prev();
        }
      },
      (session) => {
          session.input = session.context.input;
          delete session.context.input;
          session.runActions(['sendRating', 'sendFeedback']);
          session.next();
      },
      (session) => {
        session.addResult('@THANKS_FOR_FEEDBACK');
        session.endDialog();
      },
    ])
  .dialog(
      '/stop_searching', [
        (session) => {
          session.addResult('@CONFIRM_STOP_SEARCHING', [
            Builder.QuickReplies.create('@YES'),
            Builder.QuickReplies.create('@NO'),
          ]);
        },
        (session) => {
          if (session.checkIntent('#YES')) {
            session.runActions(['markUserAsNotSearching']);
            session.addResult('@STOPPED_SEARCHING');
            session.switchDialog('/profile');
          } else if (session.checkIntent('#NO')) {
            session.endDialog();
          } else {
            session.addResult('@UNCLEAR');
            session.prev();
          }
        },
      ])
  .dialog(
    '/reset', [
      (session) => {
        session.addResult('@RESET_CONFIRMATION',
          Builder.QuickReplies.createArray(['@YES', '@NO']));
      },
      (session) => {
        if (session.checkIntent('#YES')) {
          session.runActions(['breakPairReset', 'removeSentRequests', 'reset']);
          session.addResult('@RESET_DONE');
          session.clearState();
        } else if (session.checkIntent('#NO')) {
          session.endDialog();
        } else {
          session.addResult('@UNCLEAR');
          session.prev();
        }
      },
    ])
  .dialog(
    '/ok', [
      (session) => {
      },
      (session) => {
        session.next();
      },
      (session) => {
        session.endDialog();
        session.prev();
      },
    ])
  .match(
    '#RESET',
    (session) => {
      session.beginDialog('/reset');
    })
  .match(
    '#PAIR_REQUEST',
    (session) => {
      if (!session.hasPair()) {
        session.beginDialog('/manage_requests');
      }
    });

export default bot;
