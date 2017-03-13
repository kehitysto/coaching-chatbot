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

export function addCommunicationMethod( { context, input } ) {
  // let communicationMethod = input;
  let undefinedCommunicationInfo = "UNDEFINED_COMMUNICATION_INFO";
  return Promise.resolve({
    context: {
      ...context,
      communicationMethods: { input: undefinedCommunicationInfo },
    },
  });
}

export function getCommunicationMethodRequestInfoText( { context } ) {
  for (let communicationMethod in context.communicationMethods) {
    if (communicationMethod.value === "UNDEFINED_COMMUNICATION_INFO") {
      return Formatter.matchCommunicationMethod(communicationMethod.value);
    }
  }
}

export function addCommunicationInfo( { context, input } ) {

  return Promise.resolve({
    context: {
      ...context,
      communicationMethods: input,
    },
  });
}

export function reset() {
    return Promise.resolve({
        context: {},
    });
}
