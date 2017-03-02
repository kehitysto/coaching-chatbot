import Dialog from './dialog';

import strings from './coaching-chatbot.strings.json';
import * as actions from './coaching-chatbot.actions';
import * as intents from './coaching-chatbot.intents';


const dialog = new Dialog(strings);

// ACTIONS
for (let actionId in actions) {
  if ({}.hasOwnProperty.call(foo, key)) {
    dialog.addAction(actionId, actions[actionId]);
  }
}

// INTENTS
for (let intentId in intents) {
  if ({}.hasOwnProperty.call(foo, key)) {
    dialog.addIntent(intentId, intents[intentId]);
  }
}

// STATES
dialog
    .addState(
        '/base',
        [
            (session) => {
                session.addResult('@greeting');
                session.next();
                session.endDialog();
            },
            (session) => {
                if (session.checkIntent('yes')) {
                    session.pushState('/createProfile');
                } else if (session.checkIntent('no')) {
                    session.addResult('@goodbye');
                    session.popState();
                    session.endDialog();
                } else {
                    session.addResult('@unclear');
                    session.next();
                }
            },
        ],
        [
            ['reset', (session) => {
                session.runAction('reset');
                session.addResult('@reset');
                session.clearState();
            }],
        ])
    .addState(
        '/createProfile',
        [
            (session) => {
                session.addResult('@great');
                session.next();
                session.pushState('/setName');
            },
            (session) => {
                session.next();
                session.pushState('/setJob');
            },
            (session) => {
                session.switchState('/profile');
            },
        ])
    .addState(
        '/setName',
        [
            (session) => {
                session.addResult('@requestName');
                session.next();
                session.endDialog();
            },
            (session) => {
                session.runAction('setName');
                session.addResult('@confirm_name');
                session.popState();
            },
        ])
    .addState(
        '/setJob',
        [
            (session) => {
                session.addResult('@request_job');
                session.next();
                session.endDialog();
            },
            (session) => {
                session.runAction('setJob');
                session.popState();
            },
        ])
    .addState(
        '/setAge',
        [
            (session) => {
                session.addResult('@request_age');
                session.next();
                session.endDialog();
            },
            (session) => {
                session.runAction('setAge');
                session.addResult('@confirm_age');
                session.popState();
            },
        ])
    .addState(
        '/setPlace',
        [
            (session) => {
                session.addResult('@request_place');
                session.next();
                session.endDialog();
            },
            (session) => {
                session.runAction('setPlace');
                session.addResult('@confirm_place');
                session.popState();
            },
        ])
    .addState(
        '/profile',
        [
            (session) => {
                session.runAction('updateProfile');
                session.addResult('@display_profile');
                session.endDialog();
            },
        ],
        [
            ['change_name', (session, match) => {
                if (match !== true) {
                    session.runAction('setName', match);
                    session.addResult('@confirm_name');
                } else {
                    session.pushState('/set_name');
                }
            }],
            ['change_job', (session, match) => {
                if (match !== true) {
                    session.runAction('setJob', match);
                    session.addResult('@confirm_job');
                } else {
                    session.pushState('/setJob');
                }
            }],
            ['set_age', (session, match) => {
                if (match !== true) {
                    session.runAction('setAge', match);
                    session.addResult('@confirm_age');
                } else {
                    session.pushState('/setAge');
                }
            }],
            ['set_place', (session, match) => {
                if (match !== true) {
                    session.runAction('setPlace', match);
                    session.addResult('@confirm_place');
                } else {
                    session.pushState('/setPlace');
                }
            }],
            ['find_pair', (session) => {
                session.addResult('@not_implemented');
            }],
        ]);

module.exports = dialog;
