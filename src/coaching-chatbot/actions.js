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

import Chatbot from '../chatbot/chatbot-service';
import dialog from './dialog';

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

export function setBio({ context, input }) {
  return Promise.resolve({
    context: {
      ...context,
      bio: input,
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
            sentRequests: [],
            searching: false,
        },
  });
}

export function removeSentRequests({ sessionId, context }) {
  let sessions = new Sessions();
  const promises = [];
  if (context.sentRequests) {
    for (let requestRecipientId of context.sentRequests) {
      promises.push(
        sessions.read(requestRecipientId)
          .then((requestRecipient) => {
            let index = requestRecipient.pairRequests.indexOf(sessionId);
            if (index > -1) {
              requestRecipient.pairRequests.splice(index, 1);
              return sessions.write(requestRecipientId, requestRecipient);
            }
          }
        )
      );
    }
  }
  return Promise.all(promises)
    .then(() => context);
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
  let sessions = new Sessions();

  return pairs.read(sessionId).then((pairIds) => {
    const promises = [];

    log.silly('{0}', JSON.stringify(pairIds));
    for (let pairId of pairIds) {
      log.silly('PAIR {0}', pairId);
      promises.push(
        sessions.read(pairId).then((profile) => {
          return AcceptedPairFormatter.createPairString(profile);
        })
      );
    }

    return Promise.all(promises).then((profiles) => {
      return {
        result: profiles.join('\n'),
      };
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
        return sessions.read(chosenPeerId)
            .then((chosenPeer) => {
              return removeSentRequests({
                sessionId: chosenPeerId, context: chosenPeer });
            })
            .then((chosenPeer) => {
              const peer = { context: { ...chosenPeer } };
              return markUserAsNotSearching(peer);
            }
          )
            .then((chosenPeer) => {
              const peer = chosenPeer.context;
              peer.state = '/?0/profile?0/accepted_pair_information?0';
              return sessions.write(chosenPeerId, peer);
            }
          );
        })
      .then(() => {
        const bot = new Chatbot(dialog, sessions);

        return bot.receive(chosenPeerId, '').then((out) => {
          // run the chatbot for the chosen peer
          let promises = [];
          for (let r of out) {
            promises.push(
              Messenger.send(chosenPeerId, r.message, r.quickReplies)
            );
          }
          return Promise.all(promises);
        });
      })
      .then(() => removeSentRequests({ sessionId, context }))
      .then(() => markUserAsNotSearching({ context }));
}

export function breakPair({ sessionId, userData, context }) {
  let pairs = new Pairs();
  let sessions = new Sessions();

  return pairs.read(sessionId)
      .then((pairList) => {
        const pairId = pairList[0];
        if (pairId === undefined) return Promise.reject();

        return pairs.breakPair(sessionId, pairId)
            .then(() => sessions.read(pairId))
            .then((context) => sessions.write(
              pairId,
              {
                ...context,
                state: '/?0/profile?0',
              }
            ))
            .then(() => {
              return Messenger.send(
                pairId,
                PersonalInformationFormatter.format(
                  strings['@NOTIFY_PAIR_BROKEN'],
                  { pairName: context.name }
                )
              );
            });
      })
      .then(() => {
        return {
          result: '@PAIR_BROKEN',
        };
      });
}

export function breakAllPairs({ sessionId }) {
  let pairs = new Pairs();

  return pairs.read(sessionId)
      .then((pairList) => {
        const promises = [];
        for (let pairId of pairList) {
          promises.push(
            pairs.breakPair(sessionId, pairId)
          );
        }
        return Promise.all(promises);
      });
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
      chosenPeer.pairRequests = chosenPeer.pairRequests || [];
      chosenPeer.pairRequests.push(sessionId);
      context.sentRequests = context.sentRequsts || [];
      context.sentRequests.push(peerId);

      return session.write(peerId, chosenPeer)
          .then(() => {
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
            return session.write(sessionId, context);
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
