import * as Chatbot from '../src/chatbot/chatbot-service';
import * as fs from 'fs';
import * as discussions from '../doc/flow/discussions.json';
import dialog from '../src/coaching-chatbot/dialog';
import * as Pairs from '../src/util/pairs-service';
import * as path from 'path';
import * as Sessions from '../src/util/sessions-service';

process.env.RUN_ENV = 'dev';

require('../src/lib/env-vars').config();

const sessions = new Sessions();
const bot = new Chatbot(dialog, sessions);

sessions.db.load({});

let lines = [];
let promise = bot.receive('', '');

for (let scenario in discussions) {
  const messages = discussions[scenario].messages;

  promise.then(() => {
    lines.push('# ' + scenario);
    lines.push('| Kehitystön vertaisohjausrobotti | ' + discussions[scenario].player + ' |');
    lines.push('|-|-|');
  });

  for (let message of messages) {
    promise = promise.then(() => {
      lines.push('| | ' + message + ' |');
      return bot.receive(discussions[scenario].session, message);
    }).then((output) => {
      for (let botReply of output) {
        lines.push('| ' + botReply.message.replace('\n', ' | |\n| ') + ' | |');
        if (botReply.quickReplies.length > 0) {
          lines.push('| [' +
            botReply.quickReplies
              .map((quickReply) => quickReply.title)
              .join('] [') + '] | |');
        }
      }
    });
  }
}

promise = promise.then(() => {
  const target = path.resolve(__dirname, '..', 'doc', 'flow', 'discussions.md');
  fs.writeFileSync(target, lines.join('\n'));
});
