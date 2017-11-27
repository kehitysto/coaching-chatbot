import * as Chatbot from '../src/chatbot/chatbot-service';
import dialog from '../src/coaching-chatbot/dialog';
import * as Messenger from '../src/facebook-messenger/messenger-service';
import * as Sessions from '../src/util/sessions-service';
import * as sinon from 'sinon';

export function generate(discussions, states) {
  const messengerSpy = sinon.spy(Messenger, "send");
  var clock = sinon.useFakeTimers(new Date().getTime());

  const sessions = new Sessions();
  const bot = new Chatbot(dialog, sessions);

  sessions.db.load(states);

  let lines = [];
  let promise = bot.receive('', '');

  let messageQueue = {};

  function addBotReply(output) {
    for (let botReply of output) {
      for (let message of botReply.message.replace('\n\n', '\n').split('\n')) {
        if (message.length > 0) {
          lines.push('| ' + message + ' | |');
        }
      }
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
    const sessionID = discussions[scenario].session;

    if (discussions[scenario].time) {
      promise = promise.then(() => {
        clock = sinon.useFakeTimers(new Date(discussions[scenario].time).getTime());
      });
    }

    if (discussions[scenario].hide) {
      for (let message of messages) {
        promise = promise.then(() => {
          return bot.receive(sessionID, message);
        });
      }
    } else {
      promise = promise.then(() => {
        lines.push('# ' + scenario);
        lines.push('| Kehitystön vertaisohjausrobotti | ' + discussions[scenario].player + ' |');
        lines.push('|-|-|');
      });

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
        clock.reset();
      }
    });
  }

  return promise.then(() => messengerSpy.restore()).then(() => lines);
}
