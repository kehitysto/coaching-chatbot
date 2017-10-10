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
        session.addResult('@INFORMATION_ABOUT_BUTTONS');
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
        session.switchDialog('/confirm_permission');
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
          session.addResult('@TELL_HOW_TO_STOP_SEARCH'),
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
      ['#SET_BIO', (session, match) => {
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
          session.switchDialog('/communication_methods');
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
          return session.addResult('@NO_PAIRS_AVAILABLE');
        }

        session.addResult('@INFORMATION_ABOUT_LIST');
        session.next();
      },
      (session) => {
        if (session.context.availablePeers.length <= 0) {
          return session.resetDialog();
        }

        session.runActions(['displayAvailablePeer']);
        session.addQuickReplies([
          Builder.QuickReplies.create('@YES'),
          Builder.QuickReplies.create('@NO'),
        ]);
      },
      (session) => {
        if (session.checkIntent('#NO')) {
          session.runActions(['rejectAvailablePeer']);
          session.runActions(['nextAvailablePeer']);
        } else if (session.checkIntent('#YES')) {
          session.runActions(['addPairRequest']);
          session.runActions(['nextAvailablePeer']);
        } else {
          session.addResult('@UNCLEAR');
        }

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
          session.addQuickReplies([
            Builder.QuickReplies.create('@YES'),
            Builder.QuickReplies.create('@NO'),
          ]);
        },
        (session) => {
          if (session.checkIntent('#NO')) {
            session.runActions(['rejectRequest']);
          } else if (session.checkIntent('#YES')) {
            session.runActions(['acceptRequest']);
            session.switchDialog('/accepted_pair_information');
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
    ])
  .dialog(
    '/accepted_pair_profile', [
      (session) => {
        session.addResult('@PAIR_CREATED');
        session.addResult('@LINK_TO_HELP');
        session.runActions(['displayAcceptedPeer']);
        if (session.getFacilitation()) {
          session.addResult('@ASK_FOR_FACILITATION', [
            Builder.QuickReplies.create('@SET_DATE'),
          ]);
        } else {
          session.addResult('@CONFIRM_DATE');
          session.addQuickReplies([
            Builder.QuickReplies.create('@SET_DATE'),
          ]);
        }
      },
    ], [
      ['#CHANGE_DATE', (session, match) => {
        if (match !== true) {
          session.runActions(['setTime'], match);
        } else {
          session.beginDialog('/set_date');
        }
      }],
    ])
  .dialog(
    '/set_date', [
      (session) => {
        session.addResult('@ASK_FOR_DAY');
        session.addQuickReplies([
          Builder.QuickReplies.create('@MON'),
          Builder.QuickReplies.create('@TUE'),
          Builder.QuickReplies.create('@WED'),
          Builder.QuickReplies.create('@THURS'),
          Builder.QuickReplies.create('@FRI'),
          Builder.QuickReplies.create('@SAT'),
          Builder.QuickReplies.create('@SUN'),
        ]);
      },
      (session) => {
        if (session.checkIntent('#MON')) {
          session.runActions(['setDay']);
        } else if (session.checkIntent('#TUE')) {
          session.runActions(['setDay']);
        } else if (session.checkIntent('#WED')) {
          session.runActions(['setDay']);
        } else if (session.checkIntent('#THURS')) {
          session.runActions(['setDay']);
        } else if (session.checkIntent('#FRI')) {
          session.runActions(['setDay']);
        } else if (session.checkIntent('#SAT')) {
          session.runActions(['setDay']);
        } else if (session.checkIntent('#SUN')) {
          session.runActions(['setDay']);
        } else {
          session.addResult('@UNCLEAR');
          session.prev();
        }
        session.next();
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
        session.addResult('@FEEDBACK_ABOUT_MEETING');
      },
      (session) => {
        session.runActions(['giveFeedback']);
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
          if (session.context.searching) {
            session.addResult('@CONFIRM_STOP_SEARCHING', [Builder.QuickReplies
              .create(
                '@YES'),
              Builder.QuickReplies.create('@NO'),
            ]);
          } else {
            session.addResult('@NOT_CURRENTLY_SEARCHING');
            session.endDialog();
          }
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
          session.runActions(['breakAllPairs', 'removeSentRequests', 'reset']);
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
