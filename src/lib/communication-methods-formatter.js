import * as CommunicationMethods
from '../../src/coaching-chatbot/communication-methods.json';

const CommunicationMethodsFormatter = {
  getCommunicationMethods,
  getCommunicationMethodByInput,
  getCommunicationMethodByIdentifier,
  getFilledCommunicationMethods,
  createCommunicationMethodslist,
};

export default CommunicationMethodsFormatter;

function createCommunicationMethodslist(context) {
  let a = [];
  for (let method in context.communicationMethods) {
    if (method != null) {
      let methodName = getCommunicationMethodByIdentifier(method);
      a.push(` ${methodName.name} (${context.communicationMethods[method]})`);
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

/**
 * @param {Context} context
 * @return {Array<{title: string, payload: string}>}
 */
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

function getFilledCommunicationMethods(context) {
  return CommunicationMethods.reduce((list, method) => {
    return (Object.keys(context.communicationMethods).
      includes(method.identifier) ?
        [...list, { title: method.name, payload: method.identifier }] : list);
  }, []);
}
