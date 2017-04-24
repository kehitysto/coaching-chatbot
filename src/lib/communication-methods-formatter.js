import CommunicationMethods
from '../../src/coaching-chatbot/communication-methods.json';

const CommunicationMethodsFormatter = {
  getCommunicationMethods,
  getCommunicationMethodByInput,
  getCommunicationMethodByIdentifier,
  createCommunicationMethodslist,
};

export default CommunicationMethodsFormatter;

function createCommunicationMethodslist(context) {
  let a = [];
  for (let method in context.communicationMethods) {
    if (method != null) {
      let methodname = getCommunicationMethodByIdentifier(method);
      a.push(' ' + methodname.name + ' (' + context
        .communicationMethods[method] + ')');
    }
  }
  return a;
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
