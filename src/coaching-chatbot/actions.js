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
              pairRequests: recipient.pairRequests
                .filter((senderId) => senderId != sessionId),
          });
        });
    }))
  .then(() => {
    return { context };
  });
}

export function updateAvailablePeers({ sessionId, context }) {
  const sessions = new Sessions();
  const rejectedPeers = context.rejectedPeers || [];

  return sessions.getAvailablePairs(sessionId)
    .then((pairs) => {
      return contextChanges(context)({
        availablePeers: pairs
          .map((entry) => entry.id)
          .filter((entry) => rejectedPeers.indexOf(entry) < 0),
      });
    })
    .catch((err) => {
      log.error('err: {0}', err);
      return Promise.reject(err);
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
  return contextChanges(context)({
      availablePeers: context.availablePeers.slice(1),
  });
}

export function rejectAvailablePeer({ context }) {
  const rejectedPeers = context.rejectedPeers || [];
  rejectedPeers.push(context.availablePeers[0]);

  return contextChanges(context)({
      rejectedPeers,
  });
}

export function rejectRequest({ context }) {
  const rejectedPeers = context.rejectedPeers || [];
  rejectedPeers.push(context.pairRequests[0]);

  return contextChanges(context)({
    rejectedPeers,
    pairRequests: context.pairRequests.slice(1),
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
              return markUserAsNotSearching(chosenPeer);
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

export function breakPair({ sessionId, context }) {
  let pairs = new Pairs();
  let sessions = new Sessions();

  return pairs.read(sessionId)
      .then((pairList) => {
        const pairId = pairList[0];
        if (pairId == undefined) {
          return Promise.reject(new Error('No pair to break!'));
        }

        return pairs.breakPair(sessionId, pairId)
            .then(() => sessions.read(pairId))
            .then((context) => resetDayAndTime({ context }))
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
      .then(() => resetDayAndTime({ context }))
      .then(() => {
        return Promise.resolve({
          result: '@PAIR_BROKEN',
        });
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
      context.sentRequests = context.sentRequests || [];
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

export function sendRating({ context, sessionId }) {
  let pairs = new Pairs();

  const answer = strings['@RATINGS'][context.rating - 1];

  log.info('SendRating with answer ' + answer);

  return pairs.read(sessionId)
      .then((pairList) => {
        const pairId = pairList[0];
        if (pairId == undefined) {
          return Promise.reject(new Error('No pair found!'));
        }

        return Messenger.send(
          pairId, strings['@TELL_USER_HAS_NEW_FEEDBACK'] + answer,
          Builder.QuickReplies.createArray([
            'OK',
          ])
        );
    }).then(() => {
      return Promise.resolve({ result: '' });
    });
}

export function sendFeedback({ context, sessionId, input }) {
  let pairs = new Pairs();
  let feedback = new Feedback();

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
        ])).then(() => {
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
  });
}

export function testReminderAndFeedback({ context }) {
  const sessions = new Sessions();
  return sessions.readAllWithReminders()
    .then((sessionsFromDb) => {
      const promises = [];
      for (let i=0; i<sessionsFromDb.length; i++) {
        if (sessionsFromDb[i].context.skipMeeting) {
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
          for (let i=0; i<feedbackSessions.length; i++) {
            if (feedbackSessions[i].context.skipMeeting) {
              promises.push(
                sessions.write(
                  feedbackSessions[i].id,
                  {
                    ...feedbackSessions[i].context,
                    skipMeeting: false,
                  }
                )
              );
              continue;
            }
            promises.push(
              sessions.write(
                feedbackSessions[i].id,
                {
                  ...feedbackSessions[i].context,
                  state:
                  '/?0/profile?0/accepted_pair_profile?0/give_feedback?0',
                }
              ).then(() => {
                Messenger.send(feedbackSessions[i].id,
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

export function resetDayAndTime({ context }) {
  const { weekDay, time, ...cleanedContext } = context;

  return Promise.resolve(
    cleanedContext
  );
}

export function setSkipMeeting({ context, sessionId }) {
  let pairs = new Pairs();
  return pairs.read(sessionId)
    .then((pairList) => {
        const promises = [];
        const pairId = pairList[0];
        if (pairId == undefined) {
          return Promise.reject(new Error('No pair found!'));
        }
        promises.push(
          Messenger.send(pairId, strings['@SKIPPED_MEETING_MESSAGE'],
          Builder.QuickReplies.createArray([
            'OK',
          ]))
        );
        promises.push(
          contextChanges(context)({
            skipMeeting: true,
          })
        );
        return Promise.all(promises);
    });
}

export function resetSkipMeeting({ context }) {
  return contextChanges(context)({
      skipMeeting: false,
  });
}
