const readline = require('readline');
const uuid = require('uuid');

import WitAI from './src/wit-ai/wit-ai.service';

require('./src/lib/envVars').config();

const AWS = require('aws-sdk');

// Initialize AWS and DynamoDB (for session access)
if (typeof AWS.config.region !== 'string') {
  console.warn('No region found, defaulting to us-east-1');
  AWS.config.update({ region: 'us-east-1' });
}

function interactive() {
  const sessionId = uuid.v1();
  const wit = new WitAI(function(session, message) {
      console.log(message);
      return Promise.resolve();
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.setPrompt('> ');
  const prompt = () => {
    rl.prompt();
    rl.write(null, {ctrl: true, name: 'e'});
  };
  prompt();
  rl.on('line', (line) => {
    line = line.trim();
    if (!line) {
      return prompt();
    }
    wit.receive(sessionId, line)
    .catch(err => console.error(err))
  });
}
interactive();
