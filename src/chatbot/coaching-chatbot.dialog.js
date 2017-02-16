import Dialog from './dialog';
import strings from './strings.json';

import * as actions from './coaching-chatbot.actions';
import * as intents from './coaching-chatbot.intents';


const dialog = new Dialog(strings);

// ACTIONS
for (let actionId in actions) {
    dialog.addAction(actionId, actions[actionId]);
}

// INTENTS
for (let intentId in intents) {
    dialog.addIntent(intentId, ...intents[intentId]);
}

// STATES
dialog
    .addState(
        '/base',
        [
            (session) => {
                session.addResult("@greeting");
                session.next();
                session.endDialog();
            },
            (session) => {
                if (session.checkIntent('yes')) {
                    session.pushState('/create_profile');

                } else if (session.checkIntent('no')) {
                    session.addResult("@goodbye");
                    session.popState();

                } else {
                    session.addResult("@unclear");
                    session.next();
                }
            }
        ],
        [
            ['reset', (session) => {
                session.runAction('reset');
                session.clearState();
            }]
        ])
    .addState(
        '/create_profile',
        [
            (session) => {
                session.addResult("@great");
                session.next();
                session.pushState('/set_name');
            },
            (session) => {
                session.next();
                session.pushState('/set_job');
            },
            (session) => {
                session.switchState('/profile');
            }
        ])
    .addState(
        '/set_name',
        [
            (session) => {
                session.addResult("@request_name");
                session.next();
                session.endDialog();
            },
            (session) => {
                session.runAction('set_name');
                session.addResult('@confirm_name');
                session.popState();
            }
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
                session.addResult('@confirm_job');
                session.popState();
            }
        ])
    .addState(
        '/profile',
        [
            (session) => {
                session.addResult('@display_profile');
                session.endDialog();
            }
        ],
        [
            ['change_name', (session) => {
                session.pushState('/set_name');
            }],
            ['change_job', (session) => {
                session.pushState('/set_job');
            }],
            ['find_match', (session) => {
                session.addResult("@not_implemented");
            }],
        ]);

module.exports = dialog;
