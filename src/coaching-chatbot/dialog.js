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
        session.addResult('@GREETING', [
          Builder.QuickReplies.create('@YES'),
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
        session.beginDialog('/set_real_name');
      },
      (session) => {
        session.beginDialog('/set_bio');
      },
      (session) => {
        session.beginDialog('communication_methods');
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
        session.runActions(['setName']);
        session.addResult('@CONFIRM_NAME');
        session.endDialog();
      },
    ])
  .dialog(
    '/set_bio', [
      (session) => {
        session.addResult('@REQUEST_BIO');
      },
      (session) => {
        session.runActions(['setBio']);
        session.addResult('@CONFIRM_BIO');
        session.endDialog();
      },
    ])
  .dialog(
    '/communication_methods', [
    (session) => {
      if (session.getCommunicationMethodsCount() === 0) {
        session.switchDialog('/add_communication_method');
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
          session.resetDialog();
        }
      },
      (session) => {
        session.runActions(['addCommunicationInfo']);
        session.switchDialog('/communication_methods');
      },
  ])
  .dialog(
    '/confirm_permission', [
      (session) => {
        if (session.context.searching) {
          session.next();
        } else {
          session.addResult('@PERMISSION_TO_RECEIVE_MESSAGES', [
            Builder.QuickReplies.create('@YES'),
            Builder.QuickReplies.create('@NO'),
          ]);
        }
      },
      (session) => {
        if (session.context.searching || session.checkIntent('#YES')) {
          session.runActions([
            'markUserAsSearching',
          ]);
          session.endDialog();
        } else if (session.checkIntent('#NO')) {
          session.endDialog();
        } else {
          session.addResult('@UNCLEAR');
          session.prev();
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
          session.beginDialog('/searching');
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
        session.beginDialog('/find_pair');
      }],
      ['#EDIT_COMMUNICATION_METHODS', (session) => {
        session.beginDialog('/communication_methods');
      }],
      ['#INFO', (session) => {
        session.addResult('@INFO');
      }],
      ['#OPTIONAL_VALUE', (session) => {
        session.addResult('@UNCLEAR');
      }],
    ])
  .dialog(
    '/find_pair', [
      (session) => {
        if (session.getCommunicationMethodsCount() === 0) {
          session.addResult('@NO_METHODS_ADDED', [
            Builder.QuickReplies.create('@YES'),
            Builder.QuickReplies.create('@NO'),
          ]);
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
        if (!session.context.searching) {
          return session.endDialog();
        }

        session.runActions(['updateAvailablePeers']);
        session.next();
      },
      (session) => {
        if (session.context.pairRequests &&
            session.context.pairRequests.length > 0) {
          session.addResult('@TELL_USER_HAS_NEW_REQUEST', [
            Builder.QuickReplies.create('@SHOW_REQUESTS'),
          ]);
        }
        if (session.context.availablePeers.length <= 0) {
          return session.addResult('@NO_PAIRS_AVAILABLE', [
            Builder.QuickReplies.create('@STOP_SEARCHING'),
          ]);
        }

        session.addResult('@INFORMATION_ABOUT_LIST');
        session.next();
      },
      (session) => {
        if (session.context.availablePeers.length <= 0) {
          return session.resetDialog();
        }
        session.addResult('@LIST_LENGTH');
        session.runActions(['displayAvailablePeer']);
        session.addQuickReplies(
          Builder.QuickReplies.createArray([
            '@YES', '@NO', '@NEXT', '@STOP_SEARCHING'])
        );
      },
      (session) => {
        if (session.checkIntent('#NO')) {
          session.runActions(['rejectAvailablePeer']);
        } else if (session.checkIntent('#YES')) {
          session.runActions(['addPairRequest']);
        } else if (session.checkIntent('#NEXT')) {
          session.runActions(['nextAvailablePeer']);
        } else {
          session.addResult('@UNCLEAR');
        }
        session.runActions(['checkAvailablePeersIndex']);
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
    ])
  .dialog(
      '/list_requests', [
        (session) => {
          if (!session.context.searching) {
            return session.endDialog();
          }

          session.next();
        },
        (session) => {
          if (!session.context.pairRequests ||
              session.context.pairRequests.length <= 0) {
            return session.addResult('@NO_REQUESTS_AVAILABLE');
          }

          session.next();
        },
        (session) => {
          if (!session.context.pairRequests ||
              session.context.pairRequests.length <= 0) {
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
            session.switchDialog('/accepted_pair_information');
          } else if (session.checkIntent('#RETURN')) {
            return session.endDialog();
          } else {
            session.addResult('@UNCLEAR');
          }

          return session.prev();
        },
      ])
  .dialog(
    '/accepted_pair_information', [
      (session) => {
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
        session.addResult('@PAIR_CREATED');
        session.runActions(['displayAcceptedPeer']);
        session.addResult('@LINK_TO_HELP');
        if (session.ifFacilitationSet()) {
          session.addResult('@ASK_FOR_FACILITATION', [
            Builder.QuickReplies.create('@SET_DATE'),
          ]);
        } else {
          session.addResult('@CONFIRM_DATE');
          session.addQuickReplies([
            Builder.QuickReplies.create('@SET_DATE'),
            Builder.QuickReplies.create('@SKIP_MEETING'),
          ]);
        }
      },
    ], [
      ['#SET_DATE', (session) => {
        session.beginDialog('/set_date');
      }],
      ['#SKIP_MEETING', (session) => {
        session.runActions(['setSkipMeeting']);
        session.addResult('@CONFIRM_SKIPPED_MEETING');
        session.resetDialog();
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
          session.addResult('@CONFIRM_STOP_SEARCHING', [Builder.QuickReplies
            .create(
            '@YES'),
          Builder.QuickReplies.create('@NO'),
          ]);
        },
        (session) => {
          if (session.checkIntent('#YES')) {
            session.runActions(['markUserAsNotSearching']);
            session.addResult('@STOPPED_SEARCHING');
            session.endDialog();
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
        session.addResult('@RESET_CONFIRMATION', [
          Builder.QuickReplies.create('@YES'),
          Builder.QuickReplies.create('@NO'),
        ]);
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
