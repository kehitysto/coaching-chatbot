import { interactive } from 'node-wit';

import WitAI from './src/wit-ai/wit-ai.service';

require('./src/lib/envVars').config();


const wit = new WitAI(function(session, message) {
    console.log(message);
    return Promise.resolve();
});
interactive(wit.wit);

