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
                }
            }
        ])
    .addState(
        '/create_profile',
        [
            (session) => {
                session.addResult("@request_name");
                session.next();
                session.endDialog();
            },
            (session) => {
                session.runAction('set_name');
                session.addResult('@confirm_name');
                session.next();
            },
            (session) => {
                session.addResult('@request_job');
                session.next();
                session.endDialog();
            },
            (session) => {
                session.runAction('set_job');
                session.addResult('@confirm_job');
                session.pushState('/profile');
            }
        ])
    .addState(
        '/profile',
        [
            (session) => {
                session.addResult('@display_profile');
                session.next();
                session.endDialog();
            },
            (session) => {
                session.addResult("@unclear");
                session.next();
            }
        ]);

module.exports = dialog;
