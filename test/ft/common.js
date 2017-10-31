process.env.RUN_ENV = 'dev';

import * as Builder from '../../src/chatbot/builder';
import * as Chatbot from '../../src/chatbot/chatbot-service';
import dialog from '../../src/coaching-chatbot/dialog';
import * as FeatureTestStates from './states.json';
import * as Sessions from '../../src/util/sessions-service';
import * as Strings from '../../src/coaching-chatbot/strings.json';

function getTemplate(templateId) {
  return (Strings[templateId] !== undefined) ?
      Strings[templateId] : templateId;
}

export function buildResponse(templateId, quickReplies = []) {
  for (let i = 0; i < quickReplies.length; ++i) {
    quickReplies[i].title = getTemplate(quickReplies[i].title);
  }

  return {
    message: getTemplate(templateId),
    quickReplies,
  };
}

export function setupChatbot(target, scenario = 'DEFAULT') {
  target.sessions = new Sessions();
  target.sessions.db.load({});

  for (let id in FeatureTestStates[scenario]['sessions']) {
    target.sessions.write(id, FeatureTestStates[scenario]['sessions'][id]);
  }

  target.bot = new Chatbot(dialog, target.sessions);
}

const commonFeatures = {
  buildResponse,
  Chatbot,
  dialog,
  FeatureTestStates,
  QuickReplies: Builder.QuickReplies,
  Sessions,
  setupChatbot,
  Strings
};

export default commonFeatures;
