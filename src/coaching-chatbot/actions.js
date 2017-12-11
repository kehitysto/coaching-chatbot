import log from '../lib/logger-service';
import * as Builder from '../chatbot/builder';
import * as Messenger from '../facebook-messenger/messenger-service';

import * as strings from './strings.json';
import PersonalInformationFormatter
 from '../lib/personal-information-formatter-service';
import CommunicationMethodsFormatter
 from '../lib/communication-methods-formatter';
import PairFormatter from '../lib/pair-formatter';
import * as Sessions from '../util/sessions-service';
import * as Pairs from '../util/pairs-service';
import AcceptedPairFormatter from '../lib/accepted-pair-formatter';
import * as Feedback from '../util/feedback-service';
import * as Chatbot from '../chatbot/chatbot-service';
import dialog from './dialog';

import { resolveDataChanges } from '../util/resolve-data-changes';

const contextChanges = resolveDataChanges('context');
const userDataChanges = resolveDataChanges('userData');
const communicationChanges = resolveDataChanges('communicationMethods');

export function setRealName({ context, sessionId }) {
  return Messenger.getUserProfile(sessionId)
    .then((profile) => {
      const {
        first_name: firstName,
        last_name: lastName,
      } = profile;

      return contextChanges(context)({
        name: firstName + ' ' + lastName,
      });
    });
}

export function setName({ context, input }) {
  return contextChanges(context)({
    name: input,
  });
}

export function setRating({ context, input }) {
  return contextChanges(context)({
    rating: [1, 2, 3, 4].includes(Number(input)) ? Number(input) : undefined,
  });
}

export function setBio({ context, input }) {
  return contextChanges(context)({
    bio: input,
  });
}

export function updateProfile({ context, userData }) {
  const profile = PersonalInformationFormatter.createProfile(context);

  return userDataChanges(userData)({
    profile,
  });
}

export function addCommunicationMethod({ context, input }) {
  let undefinedCommunicationInfo = 'UNDEFINED_COMMUNICATION_INFO';
  let method = CommunicationMethodsFormatter
    .getCommunicationMethodByInput(input);

  return contextChanges(context)(
    communicationChanges(context.communicationMethods)({
      [method.identifier]: undefinedCommunicationInfo,
    }), {
      result: method.infoRequestText,
    });
}

export function addCommunicationInfo({ context, input }) {
  let communicationMethods = context.communicationMethods;

  let undefinedCommunicationInfo = 'UNDEFINED_COMMUNICATION_INFO';

  for (let method in communicationMethods) {
    if (communicationMethods[method] === undefinedCommunicationInfo) {
      return contextChanges(context)(
        communicationChanges(communicationMethods)({
          [method]: input,
        })
      );
    };
  }

  return Promise.reject(new Error('AddCommunicationInfo failed'));
}

export function deleteCommunicationMethod({ context, input }) {
  const method = CommunicationMethodsFormatter
    .getCommunicationMethodByInput(input).identifier;

  delete context.communicationMethods[method];

  return contextChanges(context)();
}

export function deleteUndefinedCommunicationMethod({ context }) {
  let communicationMethods = context.communicationMethods;
  let undefinedCommunicationInfo = 'UNDEFINED_COMMUNICATION_INFO';

  for (let method in communicationMethods) {
    if (communicationMethods[method] === undefinedCommunicationInfo) {
      delete context.communicationMethods[method];
      return contextChanges(context)();
    };
  }
}

export function reset() {
  return contextChanges()();
}

export function markUserAsSearching({ context }) {
  return contextChanges(context)({
      searching: true,
  });
}

export function markUserAsNotSearching({ context }) {
  return contextChanges(context)({
      searching: false,
  });
}

export function sendRejectMessages({ peerId, context }) {
  let sessions = new Sessions();

  if (context.pairRequests) {
    for (let i = 0; i < context.pairRequests.length; i++) {
      if (context.pairRequests[i] !== peerId) {
        Messenger.send(
          context.pairRequests[i],
          PersonalInformationFormatter.format(
            strings['@PEER_NO_LONGER_AVAILABLE'],
            { name: context.name }
          ),
          Builder.QuickReplies.createArray([
            'OK',
          ])
        )
        .then(() => {
          return sessions.read(context.pairRequests[i])
            .then((context) => {
              if (!context.state.includes('/ok?')) {
                context.state += '/ok?0';
                return sessions
                  .write(context.pairRequests[i], context)
                  .then(() => {
                    const bot = new Chatbot(dialog, sessions);
                    return bot.receive(context.pairRequests[i], '');
                  });
              }
            });
        });
      }
    }
  }

  return context;
}

export function resetRequestsAndSearching({ context }) {
  return contextChanges(context)({
      rejectedPeers: [],
      availablePeers: [],
      pairRequests: [],
      sentRequests: [],
      searching: false,
  });
}

export function removeSentRequests({ sessionId, context }) {
  const sessions = new Sessions();
  context.sentRequests = context.sentRequests || [];

  return Promise.all(
    context.sentRequests.map((recipientId) => {
      return sessions.read(recipientId)
        .then((recipient) => {
          return sessions.write(recipientId, {
            ...recipient,
            pairRequests: recipient.pairRequests
              .filter((senderId) => senderId !== sessionId),
          });
        });
    }))
  .then(() => {
    return { context };
  });
}

export function removeSentRequest({ sessionId, context }) {
  const sessions = new Sessions();
  context.sentRequests = context.sentRequests || [];
  const recipientId = context.sentRequests[context.sentRequestsIndex - 1];
  context.sentRequests.splice(context.sentRequestsIndex - 1, 1);
  if (context.sentRequestsIndex > context.sentRequests.length) {
    context.sentRequestsIndex = 1;
  }
  return sessions.read(recipientId)
    .then((recipient) => {
      return sessions.write(recipientId, {
        ...recipient,
        pairRequests: recipient.pairRequests
          .filter((senderId) => senderId !== sessionId),
      });
    })
    .then(() => {
      Messenger.send(
        recipientId,
        PersonalInformationFormatter.format(
          strings['@PEER_NO_LONGER_AVAILABLE'],
          { name: context.name }
        ),
        Builder.QuickReplies.createArray([
          'OK',
        ]))
      .then(() => {
        return sessions.read(recipientId)
          .then((context) => {
            if (!context.state.includes('/ok?')) {
              context.state += '/ok?0';
            }
            return sessions.write(recipientId, context);
          });
      })
      .then(() => {
        const bot = new Chatbot(dialog, sessions);
        return bot.receive(recipientId, '');
      });
    })
    .then(() => {
      return { context };
    });
}

export function getAvailablePeers({ sessionId, context }) {
  const sessions = new Sessions();
  const rejectedPeers = context.rejectedPeers || [];
  const availablePeersIndex = context.availablePeersIndex || 1;

  return sessions.getAvailablePairs(sessionId)
    .then((pairs) => {
      return contextChanges(context)({
        availablePeers: pairs
          .map((entry) => entry.id)
          .filter((entry) => rejectedPeers.indexOf(entry) < 0),
        availablePeersIndex: availablePeersIndex,
      });
    });
}

export function updateAvailablePeers({ sessionId, context }) {
  return getAvailablePeers({ sessionId, context }).then((session) => {
    return contextChanges(context)({
        availablePeers: context.availablePeers
          .filter((peer) => session.context.availablePeers.includes(peer)),
    });
  });
}

export function displayAvailablePeer({ context }) {
  return new Promise((resolve, reject) => {
    let sessions = new Sessions();

    return sessions.read(
      context.availablePeers[context.availablePeersIndex - 1])
      .then((profile) => {
        resolve({
          result: PairFormatter.createPairString(profile),
        });
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
  return contextChanges(context)({
      availablePeersIndex: context.availablePeersIndex + 1,
  });
}

export function nextSentRequest({ context }) {
  let sentRequestsIndex = context.sentRequestsIndex || 1;
  sentRequestsIndex = sentRequestsIndex + 1;
  if (sentRequestsIndex > context.sentRequests.length) {
    sentRequestsIndex = 1;
  }
  return contextChanges(context)({
    sentRequestsIndex: sentRequestsIndex,
  });
}

export function rejectAvailablePeer({ context }) {
  const rejectedPeers = context.rejectedPeers || [];
  rejectedPeers.push(context.availablePeers[context.availablePeersIndex - 1]);
  return contextChanges(context)({
      rejectedPeers,
  });
}

export function checkAvailablePeersIndex({ context }) {
  let availablePeersIndex = context.availablePeersIndex;
  if (availablePeersIndex > context.availablePeers.length) {
    availablePeersIndex = 1;
  }
  return contextChanges(context)({
      availablePeersIndex,
  });
}

export function rejectRequest({ context }) {
  const rejectedPeers = context.rejectedPeers || [];
  rejectedPeers.push(context.pairRequests[0]);
  let sessions = new Sessions();

  Messenger.send(
    context.pairRequests[0],
    PersonalInformationFormatter.format(
      strings['@PEER_NO_LONGER_AVAILABLE'],
      { name: context.name }
    ),
    Builder.QuickReplies.createArray([
      'OK',
    ]))
  .then(() => {
    return sessions.read(context.pairRequests[0])
      .then((context) => {
        if (!context.state.includes('/ok?')) {
          context.state += '/ok?0';
          return sessions
            .write(context.pairRequests[0], context)
            .then(() => {
              const bot = new Chatbot(dialog, sessions);
              return bot.receive(context.pairRequests[0], '');
            });
        }
      });
  });

  return contextChanges(context)({
    rejectedPeers,
    pairRequests: context.pairRequests.slice(1),
  });
}

export function acceptRequest({ sessionId, context }) {
  let pairs = new Pairs();
  let sessions = new Sessions();
  context.pairRequests = context.pairRequests || [];

  const chosenPeerId = context.pairRequests[0];

  return sessions.read(sessionId).then((session) => {
    if (!session.pairRequests || !session.pairRequests.includes(chosenPeerId)) {
      return Promise.resolve({
        result: '@PEER_NO_LONGER_AVAILABLE_GENERIC',
      });
    }

    return pairs.createPair(sessionId, chosenPeerId)
        .then(() => {
          return sessions.read(chosenPeerId)
              .then((chosenPeer) => {
                return sendRejectMessages({
                  peerId: sessionId, context: chosenPeer });
              })
              .then((chosenPeer) => {
                return removeSentRequests({
                  sessionId: chosenPeerId, context: chosenPeer });
              })
              .then((chosenPeer) => {
                return resetRequestsAndSearching(chosenPeer);
              }
            )
              .then((chosenPeer) => {
                const peer = chosenPeer.context;
                peer.state = '/?0/profile?0/accepted_pair_information?0';
                peer.hasPair = true;
                return sessions.write(chosenPeerId, peer);
              }
            );
        })
        .then(() => {
          const bot = new Chatbot(dialog, sessions);

          return bot.receive(chosenPeerId, '').then((out) => {
            let promise = Promise.resolve();

            out.forEach((m) => {
              promise = promise.then(() =>
                Messenger.send(chosenPeerId, m.message, m.quickReplies)
              );
            });

            return promise;
          });
        })
        .then(() => sendRejectMessages({ peerId: chosenPeerId, context }))
        .then(() => removeSentRequests({ sessionId, context }))
        .then(() => resetRequestsAndSearching({ context }))
        .then(({ context }) => contextChanges(context)({ hasPair: true }));
  });
}

export function breakPairGeneric({ sessionId, context, input }) {
  return breakPair({ sessionId, context, input, isReset: false });
}

export function breakPairReset({ sessionId, context, input }) {
  return breakPair({ sessionId, context, input, isReset: true });
}

export function breakPair({ sessionId, context, input, isReset }) {
  let pairs = new Pairs();
  let sessions = new Sessions();

  let reason = isReset ? strings['@PEER_HAS_RESET_MESSAGE'] : input;

  return pairs.read(sessionId)
      .then((pairList) => {
        const pairId = pairList[0];
        if (pairId == undefined) {
          return Promise.reject(new Error('No pair to break!'));
        }

        return pairs.breakPair(sessionId, pairId)
            .then(() => sessions.read(pairId))
          .then((context) => resetMeetingAndHasPair({ context }))
            .then((context) => sessions.write(
              pairId,
              {
                ...context,
                state: '/?0/profile?0/ok?0',
              }
            ))
            .then(() => {
              const bot = new Chatbot(dialog, sessions);
              return bot.receive(pairId, '');
            })
            .then(() => {
              return Messenger.send(
                pairId,
                PersonalInformationFormatter.format(
                  strings['@NOTIFY_PAIR_BROKEN'],
                  { pairName: context.name,
                    breakReason: reason }
                ),
                Builder.QuickReplies.createArray([
                  'OK',
                ])
              );
            });
      })
    .then(() => resetMeetingAndHasPair({ context }))
      .then((context) => sessions.write(sessionId, context))
      .then(() => {
        return Promise.resolve({
          result: '@PAIR_BROKEN',
        });
      });
}

export function displayRequest({ context, sessionId }) {
  return new Promise((resolve, reject) => {
    let sessions = new Sessions();

    return sessions.read(context.pairRequests[0])
      .then((profile) => {
        resolve({
          result: PairFormatter.createPairString(profile),
        });
      });
  });
}

export function displayRequestMessage({ context, sessionId }) {
  return new Promise((resolve, reject) => {
    let sessions = new Sessions();

    return sessions.read(context.pairRequests[0])
      .then((profile) => {
        resolve({
          result: profile.sentRequestMessages[sessionId],
        });
      });
  });
}

export function displaySentRequest({ context, sessionId }) {
  return new Promise((resolve, reject) => {
    let sessions = new Sessions();
    let sentRequestsIndex = context.sentRequestsIndex || 1;
    return sessions.read(context.sentRequests[sentRequestsIndex - 1])
      .then((profile) => {
        resolve({
          result: PairFormatter.createPairString(profile, sessionId),
        });
      });
  });
}

export function addPairRequest({ sessionId, context, input }) {
  let peerId = context.availablePeers[context.availablePeersIndex - 1];
  let sessions = new Sessions();

  return sessions.read(peerId).then((chosenPeer) => {
    if (chosenPeer.searching) {
      context.sentRequestMessages = context.sentRequestMessages || {};
      context.sentRequestMessages[peerId] = input;
      chosenPeer.pairRequests = [sessionId, ...(chosenPeer.pairRequests || [])];
      context.sentRequests = [peerId, ...(context.sentRequests || [])];
      context.availablePeers = context.availablePeers.slice(1);
      return sessions.write(peerId, chosenPeer)
          .then(() => {
            return Messenger.send(
              peerId,
              strings['@TELL_USER_HAS_NEW_REQUEST'],
              Builder.QuickReplies.createArray([
                strings['@REQUESTS'],
                'OK',
              ])
            )
            .then(() => {
              return sessions.read(peerId)
                .then((context) => {
                  if (!context.state.includes('/ok?')) {
                    context.state += '/ok?0';
                    return sessions
                      .write(peerId, context)
                      .then(() => {
                        const bot = new Chatbot(dialog, sessions);
                        return bot.receive(peerId, '');
                      });
                  }
                });
            });
          })
          .then(() => {
            return sessions.write(sessionId, context);
          })
          .then(() => {
            return {
              context,
              result: '@CONFIRM_NEW_PEER_ASK',
            };
          });
    } else {
      return Promise.resolve({
        result: '@PEER_NO_LONGER_AVAILABLE_GENERIC',
      });
    }
  });
}

export function sendRating({ context, sessionId }) {
  let pairs = new Pairs();

  const answer = context.rating;

  log.info('SendRating with answer ' + answer);

  return pairs.read(sessionId)
      .then((pairList) => {
        const pairId = pairList[0];
        if (pairId == undefined) {
          return Promise.reject(new Error('No pair found!'));
        }

        return Messenger.send(
          pairId, strings['@TELL_USER_HAS_NEW_FEEDBACK'] + answer + '/4'
        );
    }).then(() => {
      return Promise.resolve({ result: '' });
    });
}

export function sendFeedback({ context, sessionId, input }) {
  let pairs = new Pairs();
  let feedback = new Feedback();
  let sessions = new Sessions();

  log.info('SendFeedback with input ' + input);

  return pairs.read(sessionId)
    .then((pairList) => {
        const pairId = pairList[0];
        if (pairId == undefined) {
          return Promise.reject(new Error('No pair found!'));
        }

        return Messenger.send(
          pairId,
          input,
          Builder.QuickReplies.createArray([
            'OK',
          ]))
        .then(() => {
          return sessions.read(pairId)
            .then((context) => {
              context.state += '/ok?0';
              return sessions.write(pairId, context);
            });
        })
        .then(() => {
          const bot = new Chatbot(dialog, sessions);
          return bot.receive(pairId, '');
        })
        .then(() => {
          return feedback.createFeedback({
            giver: sessionId, pair: pairId, feedback: input,
          });
        });
    });
}

export function setWeekday({ context, input }) {
  return contextChanges(context)({
      weekDay: input.substring(0, 2).toUpperCase(),
  });
}

export function setTime({ context, input }) {
  return contextChanges(context)({
      time: input,
      remindersEnabled: true,
  });
}

export function testReminderAndFeedback({ context }) {
  const sessions = new Sessions();
  return sessions.readAllWithReminders()
    .then((sessionsFromDb) => {
      const promises = [];
      for (let i = 0; i < sessionsFromDb.length; i++) {
        if (!sessionsFromDb[i].context.remindersEnabled) {
          continue;
        }
        promises.push(
            Messenger.send(sessionsFromDb[i].id,
              strings['@REMINDER_MESSAGE'] + sessionsFromDb[i].context.time,
              Builder.QuickReplies.createArray([
                'OK',
              ]))
        );
      }
      return sessions.readAllWithFeedbacks()
        .then((feedbackSessions) => {
          for (let feedbackSession of feedbackSessions) {
            promises.push(
              sessions.write(
                feedbackSession.id,
                {
                  ...feedbackSession.context,
                  state:
                  '/?0/profile?0/accepted_pair_profile?0/give_feedback?1',
                }
              ).then(() => {
                Messenger.send(feedbackSession.id,
                  strings['@FEEDBACK_MESSAGE'],
                  Builder.QuickReplies.createArray([
                    strings['@YES'],
                    strings['@NO'],
                  ])
                );
              })
            );
          }
          return Promise.all(promises);
        });
    });
}

export function resetMeetingAndHasPair({ context }) {
  delete context.weekDay;
  delete context.time;
  delete context.remindersEnabled;
  delete context.hasPair;

  return Promise.resolve(
    context
  );
}

export function toggleReminders({ context }) {
  return contextChanges(context)({
      remindersEnabled: !context.remindersEnabled,
  });
}
