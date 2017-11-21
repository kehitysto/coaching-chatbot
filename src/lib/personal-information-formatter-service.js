import log from '../lib/logger-service';
import * as Strings from '../../src/coaching-chatbot/strings.json';
import * as PersonalInformation
    from '../../src/coaching-chatbot/personal-information.json';
import CommunicationMethodsFormatter
    from '../lib/communication-methods-formatter';

const Formatter = {
  format,
  formatFromTemplate,
  createProfile,
  getPersonalInformationbuttons,
};

export default Formatter;

function formatFromTemplate(template, context) {
  let s = Strings[template];

  if (Array.isArray(s)) {
    s = s[Math.floor(Math.random() * s.length)];
  }

  return format(s, context);
}

function format(template, context) {
  log.debug('Formatting template {0} with variables {1}',
      template, JSON.stringify(context));
  let s = template;

  log.silly('Template type: {0}', typeof template);

  s = s.replace(
    /{(\w+)}/g,
    (match, name) => {
      log.silly('Formatting match {0}', match);

      if (name === 'profile') {
        return createProfile(context);
      } else if (name === 'communicationMethods') {
        return CommunicationMethodsFormatter
          .createCommunicationMethodslist(context).join('\n');
      } else if (name === 'availablePeers') {
        return context.availablePeers.length;
      } else if (name === 'sentRequests') {
        return context.sentRequests.length;
      } else if (name === 'pairRequests') {
        return context.pairRequests.length;
      }

      return context[name] != undefined ? context[name] : match;
    }
  );

  return s;
}

/**
 * @param {Context} context
 * @return {string}
 */
function createProfile(context) {
  return [context.name, context.bio]
    .filter((val) => val)
    .join(', ');
}

function getPersonalInformationbuttons(context) {
  return PersonalInformation.reduce((l, m) => {
      l.push({
        title: m.description,
        payload: m.identifier,
      });
    return l;
  }, []);
}
