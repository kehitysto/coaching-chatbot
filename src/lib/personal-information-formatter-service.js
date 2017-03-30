import log from '../lib/logger-service';
import Strings from '../../src/coaching-chatbot/strings.json';
import CommunicationMethods
from '../../src/coaching-chatbot/communication-methods.json';
import MeetingFrequency
from '../../src/coaching-chatbot/meeting-frequencies.json';
import PersonalInformation
from '../../src/coaching-chatbot/personal-information.json';

const Formatter = {
  format,
  formatFromTemplate,
  createProfile,
  getCommunicationMethods,
  getCommunicationMethodByInput,
  createCommunicationMethodslist,
  getCommunicationMethodByIdentifier,
  getMeetingFrequency,
  getMeetingFrequencyIdentifierByInput,
  getPersonalInformationbuttons,
  beautifyAvailablePairs,
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
      let methodName = getCommunicationMethodByIdentifier(method);
      a.push(methodName.name + ' (' + context
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

function getCommunicationMethodByIdentifier(input) {
  for (let i = 0; i < CommunicationMethods.length; i++) {
    if (input === CommunicationMethods[i].identifier) {
      return CommunicationMethods[i];
    }
  }

  return 'undefined';
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

function getMeetingFrequency(context) {
  return MeetingFrequency.reduce((l, m) => {
      l.push({
        title: m.description,
        payload: m.identifier,
      });
    return l;
  }, []);
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

function getMeetingFrequencyIdentifierByInput(input) {
  for (let i = 0; i < MeetingFrequency.length; i++) {
    if (input.toLowerCase()
      .includes(
        MeetingFrequency[i].description.toLowerCase())) {
      return MeetingFrequency[i].identifier;
    }
  }

  return 'undefined';
}

function createPairString(context) {
    const s =
        Object.keys(context.communicationMethods)
        .filter((v) => v)
        .map((v) => `  - ${getCommunicationMethodByIdentifier(v).name}`)
        .join('\n');

    return `${createProfile(context)}\n${s}`;
}

function beautifyAvailablePairs(dumps) {
    const a = dumps.map((d) => createPairString(d.context));
    return a.join('\n');
}
