import readline from 'readline';

import Chatbot from '../src/chatbot/chatbot-service';
import dialog from '../src/coaching-chatbot/dialog';

require('../src/lib/env-vars')
  .config();

function main() {
  let context = {};
  const sessions = {
    read: (sessionId) => {
      return Promise.resolve(context);
    },

    write: (sessionId, ctx) => {
      context = ctx;
      return Promise.resolve(context);
    },

    getAvailablePairs: () => [],
  };

  const bot = new Chatbot(dialog, sessions);

  interactive(bot);
}

function interactive(bot) {
  const sessionId = 'INTERACTIVE';
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('line', (line) => {
    line = line.trim();

    if (!line) {
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
    out.push('\x1b[7m ' + quickReplies[i].name + ' \x1b[27m');
  }

  return out.join(' ');
}

main();
