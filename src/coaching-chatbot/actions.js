import Formatter from '../lib/personal-information-formatter-service';

export function setName({ context, input }) {
  return Promise.resolve({
    context: {
      ...context,
      name: input,
    },
  });
}

export function setJob({ context, input }) {
  return Promise.resolve({
    context: {
      ...context,
      job: input,
    },
  });
}

export function setAge({ context, input }) {
  return Promise.resolve({
    context: {
      ...context,
      age: input,
    },
  });
}

export function setPlace({ context, input }) {
  return Promise.resolve({
    context: {
      ...context,
      place: input,
    },
  });
}

export function updateProfile({ context, userData }) {
  let profile = Formatter.createProfile(context);

  return Promise.resolve({
    userData: {
      ...userData,
      profile,
    },
  });
}

export function addCommunicationMethod({ context, input }) {
  let undefinedCommunicationInfo = 'UNDEFINED_COMMUNICATION_INFO';
  return Promise.resolve({
    context: {
      ...context,
      communicationMethods: {
        ...context.communicationMethods,
        [input]: undefinedCommunicationInfo,
      },
    },
    result: Formatter.matchCommunicationMethod(input),
  });
}

export function addCommunicationInfo({ context, input }) {
  return new Promise((resolve, reject) => {
    let communicationMethods = context.communicationMethods;

    let undefinedCommunicationInfo = 'UNDEFINED_COMMUNICATION_INFO';

    for (let method in communicationMethods) {
      if (communicationMethods[method] !== undefinedCommunicationInfo) {
        continue;
      }

      return resolve({
        context: {
          ...context,
          communicationMethods: {
            ...communicationMethods,
            [method]: input,
          },
        },
      });
    }

    return resolve({
      context: {
        ...context,
        communicationMethods: {
          input,
        },
      },
    });
  });
}

export function reset() {
  return Promise.resolve({
    context: {},
  });
}

export function markUserAsSearching({ context }) {
  return Promise.resolve({
    context: {
      ...context,
      searching: true,
    },
  });
}
