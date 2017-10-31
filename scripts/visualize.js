import * as Chatbot from '../src/chatbot/chatbot-service';
import * as fs from 'fs';
import * as discussions from '../doc/flow/discussions.json';
import dialog from '../src/coaching-chatbot/dialog';
import * as Messenger from '../src/facebook-messenger/messenger-service';
import * as Pairs from '../src/util/pairs-service';
import * as path from 'path';
import * as Sessions from '../src/util/sessions-service';
import * as sinon from 'sinon';

const messengerSpy = sinon.spy(Messenger, "send");

process.env.RUN_ENV = 'dev';

require('../src/lib/env-vars').config();

const sessions = new Sessions();
const bot = new Chatbot(dialog, sessions);

sessions.db.load({});

let lines = [];
let promise = bot.receive('', '');

let messageQueue = {};

function addBotReply(output) {
  for (let botReply of output) {
    lines.push('| ' + botReply.message.replace('\n', ' | |\n| ') + ' | |');
    if (botReply.quickReplies.length > 0) {
      lines.push('| [' +
        botReply.quickReplies
          .map((quickReply) => quickReply.title)
          .join('] [') + '] | |');
    }
  }
}

for (let scenario in discussions) {
  const messages = discussions[scenario].messages;

  promise = promise.then(() => {
    lines.push('# ' + scenario);
    lines.push('| Kehitystön vertaisohjausrobotti | ' + discussions[scenario].player + ' |');
    lines.push('|-|-|');
  });

  let sessionID = discussions[scenario].session;

  promise = promise.then(() => {
    if (messageQueue[sessionID] != undefined) {
      addBotReply(messageQueue[sessionID]);
      messageQueue[sessionID] = undefined;
    }
  });

  for (let message of messages) {
    promise = promise.then(() => {
      lines.push('| | ' + message + ' |');
      return bot.receive(sessionID, message);
    }).then((output) => {
      addBotReply(output);
    });
  }

  promise = promise.then(() => {
    if (messengerSpy.callCount > 0) {
      for (let call of messengerSpy.args) {
        if (!messageQueue[call[0]]) {
          messageQueue[call[0]] = [];
        }
        messageQueue[call[0]].push({
          message: call[1],
          quickReplies: call[2] || {}
        });
      }
      messengerSpy.reset();
    }
  });
}

promise = promise.then(() => {
  const target = path.resolve(__dirname, '..', 'doc', 'flow', 'discussions.md');
  fs.writeFileSync(target, lines.join('\n'));
});
