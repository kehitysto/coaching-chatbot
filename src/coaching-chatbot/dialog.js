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
        session.addResult('@GREETING',
          Builder.QuickReplies.createArray(['@YES', '@NO']));
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
            '@EDIT', '@DELETE', '@TO_PROFILE']));
      }
    },
    (session) => {
      if (session.checkIntent('#EDIT')) {
        session.switchDialog('/add_communication_method');
      } else if (session.checkIntent('#DELETE')) {
        session.switchDialog('/delete_communication_method');
      } else if (session.checkIntent('#TO_PROFILE')) {
        session.switchDialog('/profile');
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
          session.resetDialog();
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
          session.resetDialog();
        }
      },
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
      ['#CHANGE_NAME', (session, match) => {
        if (match !== true) {
          session.runActions(['setName'], match);
          session.addResult('@CONFIRM_NAME');
        } else {
          session.beginDialog('/set_name');
        }
      }],
      ['#CHANGE_BIO', (session, match) => {
        if (match !== true) {
          session.runActions(['setBio'], match);
          session.addResult('@CONFIRM_BIO');
        } else {
          session.beginDialog('/set_bio');
        }
      }],
      ['#FIND_PAIR', (session) => {
        session.switchDialog('/searching');
      }],
      ['#EDIT_COMMUNICATION_METHODS', (session) => {
        session.beginDialog('/communication_methods');
      }],
      ['#INFO', (session) => {
        session.addResult('@INFO');
      }],
      ['#STOP_SEARCHING', (session) => {
        session.resetDialog();
        session.beginDialog('/stop_searching', true);
      }],
      ['#SHOW_PAIR_REQUESTS', (session) => {
        session.resetDialog();
        session.beginDialog('/list_requests', true);
      }],
      ['#OK', (session) => {
        session.resetDialog();
      }],
      ['#OPTIONAL_VALUE', (session) => {
        session.addResult('@UNCLEAR');
      }],
    ])
  .dialog(
    '/find_pair', [
      (session) => {
        if (session.getCommunicationMethodsCount() === 0) {
          session.addResult('@NO_METHODS_ADDED',
            Builder.QuickReplies.createArray(['@YES', '@NO']));
        } else {
          session.switchDialog('/confirm_permission');
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
    '/searching', [
      (session) => {
        session.runActions(['getAvailablePeers']);
        session.next();
      },
      (session) => {
        if (session.getPairRequestCount() > 0) {
          session.addResult('@TELL_USER_HAS_NEW_REQUEST', [
            Builder.QuickReplies.create('@SHOW_REQUESTS'),
          ]);
        }
        if (!session.context.availablePeers ||
          session.context.availablePeers.length <= 0) {
          if (session.isSearching()) {
            return session.addResult('@NO_PAIRS_AVAILABLE', [
              Builder.QuickReplies.create('@TO_PROFILE'),
              Builder.QuickReplies.create('@STOP_SEARCHING'),
            ]);
          } else {
            return session.addResult('@NO_PAIRS_AVAILABLE', [
              Builder.QuickReplies.create('@LIST_AS_SEARCHING'),
              Builder.QuickReplies.create('@TO_PROFILE'),
            ]);
          }
        }

        session.addResult('@INFORMATION_ABOUT_LIST');
        session.next();
      },
      (session) => {
        if (session.getAvailablePeersCount() <= 0) {
          return session.resetDialog();
        }
        session.addResult('@LIST_LENGTH');
        session.runActions(['displayAvailablePeer']);
        session.addQuickReplies(
          Builder.QuickReplies.createArray([
            '@YES', '@NO', '@NEXT', '@EXIT'])
        );
      },
      (session) => {
        if (session.checkIntent('#NO')) {
          session.runActions(['rejectAvailablePeer']);
        } else if (session.checkIntent('#YES')) {
          session.runActions(['addPairRequest']);
        } else if (session.checkIntent('#NEXT')) {
          session.runActions(['nextAvailablePeer']);
        } else if (session.checkIntent('#RETURN')) {
          session.switchDialog('/profile');
        } else {
          session.addResult('@UNCLEAR');
        }
        session.runActions([
          'updateAvailablePeers',
          'checkAvailablePeersIndex']);
        return session.prev();
      },
    ], [
      ['#STOP_SEARCHING', (session) => {
        session.resetDialog();
        session.beginDialog('/stop_searching', true);
      }],
      ['#SHOW_PAIR_REQUESTS', (session) => {
        session.resetDialog();
        session.beginDialog('/list_requests', true);
      }],
      ['#INFO', (session) => {
        session.addResult('@INFO');
      }],
      ['#LIST_AS_SEARCHING', (session) => {
        session.context.searching = true; // markUserAsSearching is too slow
        session.runActions(['markUserAsSearching']);
        session.resetDialog();
        session.switchDialog('/profile');
      }],
      ['#PROFILE', (session) => {
        session.resetDialog();
        session.switchDialog('/profile');
      }],
    ])
  .dialog(
      '/list_requests', [
        (session) => {
          if (session.getPairRequestCount() <= 0) {
            return session.addResult('@NO_REQUESTS_AVAILABLE');
          }

          session.next();
        },
        (session) => {
          if (session.getPairRequestCount() <= 0) {
            return session.endDialog();
          }

          session.addResult('@INFORMATION_ABOUT_REQUESTS');
          session.runActions(['displayRequest']);
          session.addQuickReplies(
            Builder.QuickReplies.createArray(['@YES', '@NO', '@RETURN'])
          );
        },
        (session) => {
          if (session.checkIntent('#NO')) {
            session.runActions(['rejectRequest']);
          } else if (session.checkIntent('#YES')) {
            session.runActions(['acceptRequest']);
            return session.next();
          } else if (session.checkIntent('#RETURN')) {
            return session.endDialog();
          } else {
            session.addResult('@UNCLEAR');
          }

          return session.prev();
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
    ], [
      ['#BREAK_PAIR', (session) => {
        session.runActions(['breakPair']);
        session.endDialog();
      }],
      ['#INFO', (session) => {
        session.addResult('@INFO');
      }],
    ])
  .dialog(
    '/accepted_pair_profile', [
      (session) => {
        if (session.ifFacilitationSet()) {
          session.addResult('@ASK_FOR_FACILITATION', [
            Builder.QuickReplies.create('@SET_DATE'),
          ]);
        } else {
          session.addResult('@CONFIRM_DATE');
          if (session.areRemindersEnabled()) {
            session.addQuickReplies(
              Builder.QuickReplies.createArray([
                '@CHANGE_DATE', '@SKIP_MEETING',
                '@DISABLE_REMINDERS', '@SHOW_PAIR'])
            );
          } else {
            session.addQuickReplies(
              Builder.QuickReplies.createArray([
                '@CHANGE_DATE', '@SKIP_MEETING',
                '@ENABLE_REMINDERS', '@SHOW_PAIR'])
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
      ['#SKIP_MEETING', (session) => {
        session.runActions(['setSkipMeeting']);
        session.addResult('@CONFIRM_SKIPPED_MEETING');
        session.resetDialog();
      }],
      ['#TOGGLE_REMINDERS', (session) => {
        session.beginDialog('/toggle_reminders');
      }],
      ['#TEST', (session) => {
          session.runActions(['testReminderAndFeedback']);
          session.addResult('@INFO');
          session.resetDialog();
      }],
      ['#BREAK_PAIR', (session) => {
        session.runActions(['breakPair']);
        session.endDialog();
      }],
      ['#INFO', (session) => {
        session.addResult('@INFO');
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
        } else {
          session.addResult('@UNCLEAR');
          session.prev();
          session.prev();
        }
        session.next();
      },
      (session) => {
        session.addResult('@ASK_FOR_TIME');
      },
      (session) => {
        if (session.checkIntent('#TIME')) {
          session.runActions(['setTime', 'resetSkipMeeting']);
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
        if (session.checkIntent('#YES')) {
          session.next();
        } else if (session.checkIntent('#NO')) {
          session.endDialog();
        } else {
          session.addResult('@UNCLEAR');
          session.resetDialog();
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
        if (session.isRatingGood()) {
          session.runActions(['sendRating']);
          session.next();
          session.next();
        } else {
          session.addResult('@GIVE_FEEDBACK');
        }
      },
      (session) => {
        if (session.validInput(600)) {
          session.runActions(['sendRating', 'sendFeedback']);
          session.next();
        } else {
          session.addResult('@TOO_LONG_FEEDBACK');
          session.prev();
        }
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
            session.runActions(['removeSentRequests',
              'markUserAsNotSearching']);
            session.addResult('@STOPPED_SEARCHING');
            session.resetDialog();
            session.switchDialog('/profile');
          } else if (session.checkIntent('#NO')) {
            session.resetDialog();
            session.switchDialog('/searching');
          } else {
            session.addResult('@UNCLEAR');
            session.next();
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
          session.runActions(['breakPair', 'removeSentRequests', 'reset']);
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

export default bot;
