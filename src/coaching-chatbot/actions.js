import log from '../lib/logger-service';
import PersonalInformationFormatter
 from '../lib/personal-information-formatter-service';
import CommunicationMethodsFormatter
 from '../lib/communication-methods-formatter';
import PairFormatter from '../lib/pair-formatter';
import Sessions from '../util/sessions-service';

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
  let profile = PersonalInformationFormatter.createProfile(context);

  return Promise.resolve({
    userData: {
      ...userData,
      profile,
    },
  });
}

export function addCommunicationMethod({ context, input }) {
  let undefinedCommunicationInfo = 'UNDEFINED_COMMUNICATION_INFO';
  let method = CommunicationMethodsFormatter
    .getCommunicationMethodByInput(input);
  return Promise.resolve({
    context: {
      ...context,
      communicationMethods: {
        ...context.communicationMethods,
        [method.identifier]: undefinedCommunicationInfo,
      },
    },
    result: method.infoRequestText,
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
export function addMeetingFrequency( { context, input } ) {
  return Promise.resolve({
    context: {
      ...context,
      meetingFrequency: PersonalInformationFormatter
        .getMeetingFrequencyIdentifierByInput(input),
    },
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

export function markUserAsNotSearching({ context }) {
    return Promise.resolve({
        context: {
            ...context,
            searching: false,
        },
    });
}

export function getAvailablePairs({ sessionId, context }) {
  return new Promise((resolve, reject) => {
    let sessions = new Sessions();

    return sessions.getAvailablePairs(sessionId, context.meetingFrequency)
      .then((pairs) => {
        if (pairs.length > 0) {
          resolve({
            result: PairFormatter
              .beautifyAvailablePairs(pairs),
          });
        } else {
          resolve({
            result: '@NO_PAIRS_AVAILABLE',
          });
        }
      })
      .catch((err) => {
        log.error('err: {0}', err);
        reject(err);
      });
  });
}
