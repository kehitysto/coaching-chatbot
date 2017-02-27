import readline from 'readline';

import Chatbot from '../src/chatbot/chatbot.service';
import dialog from '../src/chatbot/coaching-chatbot.dialog';

require('../src/lib/envVars')
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
        console.log('\x1b[31m' + msg.join('\n'));
        rl.prompt();
      })
      .catch((err) => console.error(err.stack));
  });

  rl.setPrompt('\x1b[32m> ');
  rl.prompt();
};

main();
