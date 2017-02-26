import Dialog from './dialog';

import strings from './coaching-chatbot.strings.json';
import * as actions from './coaching-chatbot.actions';
import * as intents from './coaching-chatbot.intents';


const dialog = new Dialog(strings);

// ACTIONS
for (let actionId in actions) {
    dialog.addAction(actionId, actions[actionId]);
}

// INTENTS
for (let intentId in intents) {
    dialog.addIntent(intentId, intents[intentId]);
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
                    session.pushState('/create_profile');
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
        '/create_profile',
        [
            (session) => {
                session.addResult('@great');
                session.next();
                session.pushState('/set_name');
            },
            (session) => {
                session.next();
                session.pushState('/set_job');
            },
            (session) => {
                session.switchState('/profile');
            },
        ])
    .addState(
        '/set_name',
        [
            (session) => {
                session.addResult('@request_name');
                session.next();
                session.endDialog();
            },
            (session) => {
                session.runAction('set_name');
                session.addResult('@confirm_name');
                session.popState();
            },
        ])
    .addState(
        '/set_job',
        [
            (session) => {
                session.addResult('@request_job');
                session.next();
                session.endDialog();
            },
            (session) => {
                session.runAction('set_job');
                session.popState();
            },
        ])
    .addState(
        '/set_age',
        [
            (session) => {
                session.addResult('@request_age');
                session.next();
                session.endDialog();
            },
            (session) => {
                session.runAction('set_age');
                session.addResult('@confirm_age');
                session.popState();
            },
        ])
    .addState(
        '/set_place',
        [
            (session) => {
                session.addResult('@request_place');
                session.next();
                session.endDialog();
            },
            (session) => {
                session.runAction('set_place');
                session.addResult('@confirm_place');
                session.popState();
            },
        ])
    .addState(
        '/profile',
        [
            (session) => {
                session.runAction('update_profile');
                session.addResult('@display_profile');
                session.endDialog();
            },
        ],
        [
            ['change_name', (session, match) => {
                if (match !== true) {
                    session.runAction('set_name', match);
                    session.addResult('@confirm_name');
                } else {
                    session.pushState('/set_name');
                }
            }],
            ['change_job', (session, match) => {
                if (match !== true) {
                    session.runAction('set_job', match);
                    session.addResult('@confirm_job');
                } else {
                    session.pushState('/set_job');
                }
            }],
            ['set_age', (session, match) => {
                if (match !== true) {
                    session.runAction('set_age', match);
                    session.addResult('@confirm_age');
                } else {
                    session.pushState('/set_age');
                }
            }],
            ['set_place', (session, match) => {
                if (match !== true) {
                    session.runAction('set_place', match);
                    session.addResult('@confirm_place');
                } else {
                    session.pushState('/set_place');
                }
            }],
            ['find_pair', (session) => {
                session.addResult('@not_implemented');
            }],
        ]);

module.exports = dialog;
