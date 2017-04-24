import log from '../lib/logger-service';
import Builder from '../chatbot/builder';
import Messenger from '../facebook-messenger/messenger-service';

import strings from './strings.json';
import PersonalInformationFormatter
 from '../lib/personal-information-formatter-service';
import CommunicationMethodsFormatter
 from '../lib/communication-methods-formatter';
import PairFormatter from '../lib/pair-formatter';
import Sessions from '../util/sessions-service';
import Pairs from '../util/pairs-service';
import AcceptedPairFormatter from '../lib/accepted-pair-formatter';

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
            rejectedPeers: [],
            availablePeers: [],
            pairRequests: [],
            searching: false,
        },
    });
}

export function updateAvailablePeers({ sessionId, context }) {
  return new Promise((resolve, reject) => {
    let sessions = new Sessions();

    const rejectedPeers = context.rejectedPeers || [];

    return sessions.getAvailablePairs(sessionId, context.meetingFrequency)
      .then((pairs) => {
        resolve({
          context: {
            ...context,
            availablePeers: pairs
                .map((entry) => entry.id)
                .filter((entry) => rejectedPeers.indexOf(entry) < 0),
          },
        });
      })
      .catch((err) => {
        log.error('err: {0}', err);
        reject(err);
      });
  });
}

export function displayAvailablePeer({ context }) {
  return new Promise((resolve, reject) => {
    let sessions = new Sessions();

    return sessions.read(context.availablePeers[0])
      .then((profile) => {
        resolve({
          result: PairFormatter.createPairString(profile),
        });
      })
      .catch((err) => {
        log.error('err: {0}', err);
        reject(err);
      });
  });
}
export function displayAcceptedPeer({ sessionId, context }) {
  let pairs = new Pairs();
  return new Promise((resolve, reject) => {
    let sessions = new Sessions();
    return pairs.read(sessionId)
      .then((pairIds) => {
        return sessions.read(pairIds[0])
          .then((profile) => {
            resolve({
              result: AcceptedPairFormatter.createPairString(profile),
            });
          });
      })
      .catch((err) => {
        log.error('err: {0}', err);
        reject(err);
      });
  });
}

export function nextAvailablePeer({ context }) {
  return Promise.resolve({
    context: {
      ...context,
      availablePeers: context.availablePeers.slice(1),
    },
  });
}

export function rejectAvailablePeer({ context }) {
  const rejectedPeers = context.rejectedPeers || [];
  rejectedPeers.push(context.availablePeers[0]);

  return Promise.resolve({
    context: {
      ...context,
      rejectedPeers,
    },
  });
}

export function nextRequest({ context }) {
  return Promise.resolve({
    context: {
      ...context,
      pairRequests: context.pairRequests.slice(1).concat(
          context.pairRequests.slice(0, 1)),
    },
  });
}

export function rejectRequest({ context }) {
  const rejectedPeers = context.rejectedPeers || [];
  rejectedPeers.push(context.pairRequests[0]);

  return Promise.resolve({
    context: {
      ...context,
      rejectedPeers,
      pairRequests: context.pairRequests.slice(1),
    },
  });
}

export function acceptRequest({ sessionId, context }) {
  let pairs = new Pairs();
  let sessions = new Sessions();
  const chosenPeerId = context.pairRequests[0];
  return pairs.createPair(sessionId, chosenPeerId)
      .then(() => {
        return sessions.read(chosenPeerId).then((chosenPeer) => {
          chosenPeer.state = '/?0/profile?0/accepted_pair_information?0';
          return sessions.write(chosenPeerId, chosenPeer);
        });
      })
      .then(() => {
        // skip notification on local client
        if (process.env.RUN_ENV === 'dev') return;

        return Messenger.send(
          chosenPeerId,
          strings['@ACCEPTED_REQUEST'],
          Builder.QuickReplies.createArray(['Vahvista'])
        );
      })
      .then(() => markUserAsNotSearching({ context }))
      .then((resultObject) => {
        return { ...resultObject, result: '@PAIR_CREATED' };
      });
}

export function breakPair({ sessionId }) {
  let pairs = new Pairs();
  let sessions = new Sessions();

  return pairs.read(sessionId)
      .then((pairs) => {
        const pairId = pairs[0];

        return pairs.breakPair(sessionId, pairId)
            .then(() => sessions.read(pairId))
            .then((context) => sessions.write(pairId, {
              ...context,
              state: '/?0/profile?0',
            }));
      })
      .then(() => {});
}

export function displayRequest({ context }) {
  return new Promise((resolve, reject) => {
    let sessions = new Sessions();

    return sessions.read(context.pairRequests[0])
      .then((profile) => {
        resolve({
          result: PairFormatter.createPairString(profile),
        });
      })
      .catch((err) => {
        log.error('err: {0}', err);
        reject(err);
      });
  });
}

export function addPairRequest({ sessionId, context }) {
  let peerId = context.availablePeers[0];
  let session = new Sessions();

  return session.read(peerId).then((chosenPeer) => {
    if (chosenPeer.searching) {
      if (chosenPeer.pairRequests === undefined) {
        chosenPeer.pairRequests = [];
      }
      chosenPeer.pairRequests.push(sessionId);

      return session.write(peerId, chosenPeer)
          .then(() => {
            // skip notification on local client
            if (process.env.RUN_ENV === 'dev') return;

            return Messenger.send(
              peerId,
              strings['@TELL_USER_HAS_NEW_REQUEST'],
              Builder.QuickReplies.createArray([
                strings['@SHOW_REQUESTS'],
                strings['@STOP_SEARCHING'],
              ])
            );
          })
          .then(() => {
            return {
              result: '@CONFIRM_NEW_PEER_ASK',
            };
          });
    } else {
      return Promise.resolve({
        result: '@PEER_NO_LONGER_AVAILABLE',
      });
    }
  });
}
