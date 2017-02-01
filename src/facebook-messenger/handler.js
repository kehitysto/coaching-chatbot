import 'source-map-support/register'

require('../lib/envVars').config();

import Messenger from './messenger.service';
import WitAI from '../wit-ai/wit-ai.service';


module.exports.handler = (event, context, cb) => {
    if (event.method === 'GET') {
        return Messenger.verify(
            event.query['hub.verify_token'],
            event.query['hub.challenge']
        )
            .then(response => cb(null, response))
            .catch(err => cb(err));

    } else if (event.method === 'POST') {
        return Messenger.receive(event.body, WitAI.receive)
            .then(response => cb(null, response))
            .catch(err => cb(err));
    }

    return cb('Unknown event');
};
