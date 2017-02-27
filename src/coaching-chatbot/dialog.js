import Builder from '../chatbot/builder';

import strings from './strings.json';
import * as actions from './actions';
import * as intents from './intents';


const bot = new Builder(strings);

// ACTIONS
for (let actionId in actions) {
    bot.action(actionId, actions[actionId]);
}

// INTENTS
for (let intentId in intents) {
    bot.intent(intentId, intents[intentId]);
}

// DIALOGS
bot
    .dialog(
        '/',
        [
            (session) => {
                session.addResult("@greeting");
            },
            (session) => {
                if (session.checkIntent('yes')) {
                    session.beginDialog('/create_profile');

                } else if (session.checkIntent('no')) {
                    session.addResult("@goodbye");

                } else {
                    session.addResult("@unclear");
                    session.next();
                }
            }
        ],
        [
            ['reset', (session) => {
                session.runActions(['reset']);
                session.addResult('@reset');
                session.clearState();
            }]
        ])
    .dialog(
        '/create_profile',
        [
            (session) => {
                session.addResult("@great");
                session.beginDialog('/set_name');
            },
            (session) => {
                session.beginDialog('/set_job');
            },
            (session) => {
                session.switchDialog('/profile');
            }
        ])
    .dialog(
        '/set_name',
        [
            (session) => {
                session.addResult("@request_name");
            },
            (session) => {
                session.runActions(['set_name']);
                session.addResult('@confirm_name');
                session.endDialog();
            }
        ])
    .dialog(
        '/set_job',
        [
            (session) => {
                session.addResult('@request_job');
            },
            (session) => {
                session.runActions(['set_job']);
                session.endDialog();
            }
        ])
    .dialog(
        '/set_age',
        [
            (session) => {
                session.addResult('@request_age');
            },
            (session) => {
                session.runActions(['set_age']);
                session.addResult('@confirm_age');
                session.endDialog();
            }
        ])
    .dialog(
        '/set_place',
        [
            (session) => {
                session.addResult('@request_place');
            },
            (session) => {
                session.runActions(['set_place']);
                session.addResult('@confirm_place');
                session.endDialog();
            }
        ])
    .dialog(
        '/profile',
        [
            (session) => {
                session.runActions(['update_profile']);
                session.addResult('@display_profile');
            }
        ],
        [
            ['change_name', (session, match) => {
                if (match !== true) {
                    session.runActions(['set_name'], match);
                    session.addResult('@confirm_name');
                } else {
                    session.beginDialog('/set_name');
                }
            }],
            ['change_job', (session, match) => {
                if (match !== true) {
                    session.runActions(['set_job'], match);
                    session.addResult('@confirm_job');
                } else {
                    session.beginDialog('/set_job');
                }
            }],
            ['set_age', (session, match) => {
                if (match !== true) {
                    session.runActions(['set_age'], match);
                    session.addResult('@confirm_age');
                } else {
                    session.beginDialog('/set_age');
                }
            }],
            ['set_place', (session, match) => {
                if (match !== true) {
                    session.runActions(['set_place'], match);
                    session.addResult('@confirm_place');
                } else {
                    session.beginDialog('/set_place');
                }
            }],
            ['find_pair', (session) => {
                session.addResult("@not_implemented");
            }],
        ]);

module.exports = bot;
