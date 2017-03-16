import Strings from '../../src/coaching-chatbot/strings.json';
import CommunicationMethods
 from '../../src/coaching-chatbot/communication-methods.json';

const Formatter = {
  format,
  formatFromTemplate,
  createProfile,
  getCommunicationMethods,
  matchCommunicationMethod,
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
  let s = template;

  if (context.name) {
    s = s.replace('{name}', context.name);
  }

  if (context.job) {
    s = s.replace('{job}', context.job);
  }

  if (context.age) {
    s = s.replace('{age}', context.age);
  }

  if (context.place) {
    s = s.replace('{place}', context.place);
  }

  s = s.replace('{profile}', createProfile(context));

  return s;
}

function createProfile(context) {
  return [context.name, context.job,
      context.age, context.place,
    ]
    .filter((val) => val)
    .join(', ');
}

function matchCommunicationMethod(input) {
  for(let i = 0; i < CommunicationMethods.length; i++) {
    if(CommunicationMethods[i].name === input) {
      return CommunicationMethods[i].infoRequestText;
    }
  }
}

function getCommunicationMethods( context ) {
  let communicationMethods = [];
  console.log(JSON.stringify(context));
  console.log('testi');
  for(let jsonCommunicationMethod of CommunicationMethods) {
    for(let communicationMethod in context.communicationMethods) {
      if(communicationMethod !== jsonCommunicationMethod.name) {
        let nameAndPayload = { name: jsonCommunicationMethod.name,
        payload: jsonCommunicationMethod.identifier };
        communicationMethods.push(nameAndPayload);
      }
    }
  }
  return communicationMethods;
}
