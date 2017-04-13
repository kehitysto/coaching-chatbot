import readline from 'readline';
import minimist from 'minimist';
import fs from 'fs';
import path from 'path';

import Sessions from '../src/util/sessions-service';
import Chatbot from '../src/chatbot/chatbot-service';
import dialog from '../src/coaching-chatbot/dialog';

require('../src/lib/env-vars')
  .config();

// normally undefined, set to 'dev' for local client only
process.env.RUN_ENV = 'dev';

const STATE_STORE = '.state.json';

const options = minimist(process.argv.slice(2));
const sessions = new Sessions();

if (options.h || options.help) {
  console.log('USAGE:');
  console.log(
    `\n> bot-client` +
    ` [-t|--test] [-h|--help] [--session=<ID>]\n`);
  console.log('\tt, test\t-- run client without persisting state to disk');
  console.log('\th, help\t-- print usage guide');
  console.log('\tsession\t-- use ID as session id');
  process.exit();
}

if (!options.test && !options.t) {
  const dbRead = sessions.db.read.bind(sessions.db);
  const dbWrite = sessions.db.write.bind(sessions.db);

  // hack persistent state
  sessions.db.write = (sessionId, context) => {
    return dbWrite(sessionId, context)
        .then((ret) => {
          snapState();
          return ret;
        });
  };

  sessions.db.read = (sessionId) => {
    loadState();
    return dbRead(sessionId);
  };
}

function main() {
  const bot = new Chatbot(dialog, sessions);

  interactive(bot);
}

function snapState() {
  const storePath = path.resolve(__dirname, '..', STATE_STORE);
  const data = sessions.db.dump();

  fs.writeFileSync(storePath, JSON.stringify(data));
}

function loadState() {
  const storePath = path.resolve(__dirname, '..', STATE_STORE);
  const data = fs.readFileSync(storePath);

  sessions.db.load(JSON.parse(data));
}

function interactive(bot) {
  const sessionId = options.session || 'INTERACTIVE';
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('line', (line) => {
    line = line.trim();

    if (!line) {
      return rl.prompt();
    } else if (line === '!snap') {
      snapState();
      return rl.prompt();
    } else if (line === '!load') {
      loadState();
      return rl.prompt();
    }

    bot.receive(sessionId, line)
      .then((msg) => {
        for (let i = 0; i < msg.length; ++i) {
          let { message, quickReplies } = msg[i];
          console.log('\x1b[93m' + message + '\x1b[39m');
          if (quickReplies.length) {
            console.log(formatQuickReplies(quickReplies));
          }
        }
        rl.prompt();
      })
      .catch((err) => console.error(err.stack));
  });

  rl.setPrompt('\x1b[0m> ');
  rl.prompt();
};

function formatQuickReplies(quickReplies) {
  let out = [];

  for (let i = 0; i < quickReplies.length; ++i) {
    out.push('\x1b[7m ' + quickReplies[i].title + ' \x1b[27m');
  }

  return out.join(' ');
}

main();
