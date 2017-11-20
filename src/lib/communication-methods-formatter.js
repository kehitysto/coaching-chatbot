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
  return CommunicationMethods
    .filter((method) => context.communicationMethods[method.identifier])
    .map((method) =>
      ` ${method.name} (${context.communicationMethods[method.identifier]})`);
}

function getCommunicationMethodByInput(input) {
  return CommunicationMethods.filter(
    (method) => input.toLowerCase().includes(method.name.toLowerCase()))[0];
}

function getCommunicationMethodByIdentifier(input) {
  return CommunicationMethods.filter(
    (method) => input === method.identifier)[0];
}

/**
 * @param {Context} context
 * @return {Array<{title: string, payload: string}>}
 */
function getCommunicationMethods(context) {
  return CommunicationMethods
    .filter((method) => (context.communicationMethods === undefined ||
            context.communicationMethods[method.identifier] === undefined))
    .map((method) => ({
      title: method.name,
      payload: method.identifier,
    }));
}

function getFilledCommunicationMethods(context) {
  return CommunicationMethods.reduce((list, method) => {
    return (Object.keys(context.communicationMethods)
      .includes(method.identifier) ?
        [...list, { title: method.name, payload: method.identifier }] : list);
  }, []);
}
