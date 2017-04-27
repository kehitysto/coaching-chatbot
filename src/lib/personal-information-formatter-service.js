import log from '../lib/logger-service';
import Strings from '../../src/coaching-chatbot/strings.json';
import MeetingFrequency
    from '../../src/coaching-chatbot/meeting-frequencies.json';
import PersonalInformation
    from '../../src/coaching-chatbot/personal-information.json';
import CommunicationMethodsFormatter
    from '../lib/communication-methods-formatter';

const Formatter = {
  format,
  formatFromTemplate,
  createProfile,
  getMeetingFrequency,
  getMeetingFrequencyIdentifierByInput,
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
      }

      return context[name] != undefined ? context[name] : match;
    }
  );

  return s;
}

function createProfile(context) {
  return [context.name, context.job,
      context.age, context.place,
    ]
    .filter((val) => val)
    .join(', ');
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
