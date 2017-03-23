import log from '../lib/logger-service';
import Strings from '../../src/coaching-chatbot/strings.json';
import CommunicationMethods
from '../../src/coaching-chatbot/communication-methods.json';

const Formatter = {
  format,
  formatFromTemplate,
  createProfile,
  getCommunicationMethods,
  getCommunicationMethodByInput,
  createCommunicationMethodslist,
  getCommunicationMethodsByIdentifier,
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
  log.debug('Formatting template with variables {0}', JSON.stringify(context));
  let s = template;

  s = s.replace(
    /{(\w+)}/g,
    (match, name) => {
      log.silly('Formatting match {0}', match);

      if (name === 'profile') {
        return createProfile(context);
      } else if (name === 'communicationMethods') {
        return createCommunicationMethodslist(context);
      }

      return context[name] != undefined ? context[name] : match;
    }
  );

  return s;
}
function createCommunicationMethodslist(context) {
  let a = [];
  for ( let method in context.communicationMethods ) {
    if ( method != null ) {
      let methodname = getCommunicationMethodsByIdentifier(method);
      a.push( methodname.name + ' (' + context
      .communicationMethods[method] + ')');
    }
  }
  return a.join('\n');
}

function createProfile(context) {
  return [context.name, context.job,
      context.age, context.place,
    ]
    .filter((val) => val)
    .join(', ');
}

function getCommunicationMethodByInput(input) {
  for (let i = 0; i < CommunicationMethods.length; i++) {
    if (input.toLowerCase()
      .includes(
        CommunicationMethods[i].name.toLowerCase())) {
      return CommunicationMethods[i];
    }
  }
}
function getCommunicationMethodsByIdentifier(input) {
  for (let i = 0; i < CommunicationMethods.length; i++) {
    if (input === CommunicationMethods[i].identifier) {
      return CommunicationMethods[i];
    }
  }
}

function getCommunicationMethods(context) {
  return CommunicationMethods.reduce((l, m) => {
    if (context.communicationMethods === undefined ||
      context.communicationMethods[m.identifier] === undefined) {
      l.push({
        title: m.name,
        payload: m.identifier,
      });
    }
    return l;
  }, []);
}
