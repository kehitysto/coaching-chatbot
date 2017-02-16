import readline from 'readline';

import Chatbot from '../src/chatbot/chatbot.service';
import dialog from '../src/chatbot/coaching-chatbot.dialog';

require('../src/lib/envVars').config();


function main() {
    let context = {};
    const sessions = {
        read: (sessionId) => {
            return Promise.resolve(context);
        },

        write: (sessionId, ctx) => {
            context = ctx;
            return Promise.resolve(context);
        }
    };

    const bot = new Chatbot(dialog, sessions);

    interactive(bot);
}

function interactive(bot) {
  const sessionId = "INTERACTIVE";
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
    bot.receive(sessionId, line)
      .then(msg => {
        console.log(msg.join('\n'));
        console.log();
      })
      .catch(err => console.error(err))
  });
};

main();
